var connection = require('../connection');
const { v4: uuidv4 } = require('uuid');

// Add order
async function postOrder(req, res) {
    const order = req.body.order;
  
    try {
      const orderId = await insertOrder(order);
  
      if (orderId) {
        const confirmationNumber = generateConfirmationNumber();
        await insertConfirmationNumber(orderId, confirmationNumber);
        await insertOrderDetails(orderId, order.productDetails);
        return res.status(200).json({ status: 200, message: 'Order successfully submitted', confirmationNumber: confirmationNumber });
      } else {
        return res.status(500).json({ message: 'Failed to submit order' });
      }
    } catch (error) {
      console.error('Error processing order:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

//   Get order for specific customer
  async function getOrdersByCustomerId(req, res) {
    const customerId = req.body.customerId;
  
    try {
      const orders = await getOrdersWithDetails(customerId);
      return res.status(200).json({ status: 200, orders });
    } catch (error) {
      console.error('Error fetching orders:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }


  
  async function getOrdersWithDetails(customerId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT orders.*, orderdetails.product_id, orderdetails.quantity
        FROM orders
        LEFT JOIN orderdetails ON orders.order_id = orderdetails.order_number
        WHERE orders.user_id = ?
      `;
  
      connection.query(query, [customerId], (err, dbRes) => {
        if (err) {
          reject(err);
        } else {
          // Organize the data into a structured format
          const ordersMap = new Map();
  
          dbRes.forEach((row) => {
            const orderId = row.order_id;
  
            if (!ordersMap.has(orderId)) {
              ordersMap.set(orderId, {
                order_id: orderId,
                customer_id: row.user_id,
                order_status: row.order_status,
                order_date: row.date_creation,
                order_details: [],
              });
            }
  
            const order = ordersMap.get(orderId);
            if (row.product_id !== null) {
              order.order_details.push({
                product_id: row.product_id,
                quantity: row.quantity,
              });
            }
          });
  
          const orders = Array.from(ordersMap.values());
          resolve(orders);
        }
      });
    });
  }
  
  
  
  
function generateConfirmationNumber() {
    // Use UUID library to generate a unique alphanumeric confirmation number
    return uuidv4().replace(/-/g, '').substring(0, 12).toUpperCase();
  }

  async function insertOrder(order) {
    return new Promise((resolve, reject) => {
      const query = 'INSERT INTO orders (user_id, order_status) VALUES (?, ?)';
  
      connection.query(query, [order.customer_id, 'Pending'], (err, dbRes) => {
        if (err) {
          reject(err);
        } else {
          resolve(dbRes.insertId); // Return the generated order_number
        }
      });
    });
  }
  
  async function insertOrderDetails(orderId, productDetails) {
    return new Promise((resolve, reject) => {
      const values = productDetails.map((product) => [orderId, product.productId, product.quantity]);
      const query = 'INSERT INTO orderdetails (order_number, product_id, quantity) VALUES ?';
  
      connection.query(query, [values], (err, dbRes) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }  

  async function insertConfirmationNumber(orderId, confirmationNumber) {
    return new Promise((resolve, reject) => {
      const query = 'UPDATE orders SET confirmation_number = ? WHERE order_id = ?';
      connection.query(query, [confirmationNumber, orderId], (err, dbRes) => {
        if (err) {
          reject(err);
        } else {
          resolve(dbRes);
        }
      });
    })
  }

module.exports = {postOrder, getOrdersByCustomerId};