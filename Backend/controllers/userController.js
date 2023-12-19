const db = require('../connection'); // Update the path based on your actual file structure
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

async function loginUser(req, res) {
  try {
    const userData = await getUserByUsername(req.body.user.email);
    console.log(userData)
    if (userData && userData.length> 0) {
      const isCorrectPass = await bcrypt.compare(req.body.user.password, userData[0].password);
      if (isCorrectPass) {
        const secretKey = process.env.JWT_SECRET_KEY;
        console.log("SECRET KEY ", secretKey)
        const token = jwt.sign({ username: userData.username, password: userData.password }, secretKey, { expiresIn: '1h' });

        return res.json({ user: userData, token: token });
      } else {
        return res.json({ message: 'Incorrect Password' });
      }
    } else {
      return res.json({ message: 'User does not exist' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

async function registerUser(req, res) {
  try {
    const hashedPassword = await bcrypt.hash(req.body.user.password, 10);
    const result = await insertUser(req.body.user.firstname, req.body.user.lastname, req.body.user.email, hashedPassword);

    return res.json(result);
  } catch (error) {
    console.error('Error during registration:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

async function getUserByUsername(email) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

async function insertUser(firstname, lastname, email, password) {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO users (firstname, lastname, email, password) VALUES (?, ?, ?, ?)';
    db.query(query, [firstname, lastname, email, password], function (err) {
        console.log(query);
      if (err) {
        reject({ message: 'Error during user registration', error: err });
      } else {
        resolve({ message: 'User successfully registered', userId: this.lastID });
      }
    });
  });
}

module.exports = { loginUser, registerUser };
