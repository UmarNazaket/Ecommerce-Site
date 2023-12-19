var connection = require('../connection');

async function getProducts(req, res){
connection.getConnection(async (err, con)=>{
    if(err){}
    else{
        const query = `Select * from products`;
        con.query(query, async (err, dbRes)=>{
            if(dbRes && dbRes[0]){
                    return res.json({status: 200, products: dbRes});

            }else{
                return res.json({message: "No Product Found"})
            }
            
        });
    }
})
}

async function filterProducts(req, res){
    connection.getConnection(async (err, con)=>{
        if(err){}
        else{
            const searchText = req.query.search;
            const query = `SELECT * FROM products WHERE name LIKE '%${searchText}%' OR description LIKE '%${searchText}%'`;
            con.query(query, async (err, dbRes)=>{
                if(dbRes && dbRes[0]){
                        return res.json({status: 200, products: dbRes});
    
                }else{
                    return res.json({message: "No Product Found"})
                }
                
            });
        }
    })
}

module.exports = {getProducts, filterProducts};