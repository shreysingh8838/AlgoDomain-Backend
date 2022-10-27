const {urlencoded} = require("body-parser");
const express = require("express");
const app = express();
const path = require("path");
var cors = require('cors')

PORT = 8001

const db = require("./src-database");

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(cors())     //to use middleware for all the routes

// Api to call all the products
app.get("/", async(req,res)=>{
    const result = await db.promise().query(`Select * from product;`);
    res.send(result[0]);
})



async function cal(id){
    var item_result = await db.promise().query(`Select * from product where product_id = '${id}'`);
    var per_item_result = item_result[0][0];
    
    var pc = per_item_result.Product_category // pc is for Product Category
    var pp = per_item_result.Product_price  // pp is for Product Price
    var discount = 0;
    var GST = 0;
    var deliveryCharge = 0;
    if(pc === 'Electronics'){
        discount = (15/100) * pp;
        GST = (18/100) * (pp - discount);
        deliveryCharge = 350;
    }else if(pc === 'Home Appliances'){
        discount = 22/100 * pp;
        GST = 24/100 * (pp - discount);
        deliveryCharge = 800;
    }else if(pc === 'Clothing'){
        discount = 40/100 * pp;
        GST = (12/100) * (pp - discount);
        deliveryCharge = 0;
    }else if(pc === 'Furniture'){
        discount = 10/100 * pp;
        GST = 18/100 * (pp - discount);
        deliveryCharge = 300;
    }
    
    var per_item_final_price = (pp + deliveryCharge + GST) - discount ;

    var minor_result = await {
        "productId" : per_item_result.Product_id,
        "name": per_item_result.Product_name,
        "productType": per_item_result.Product_type,
        "category": per_item_result.Product_category,
        "basePrice": per_item_result.Product_price,
        "discount": discount,
        "charges": {
          "gst": GST,
          "delivery": deliveryCharge
        },
        "finalPrice": per_item_final_price
    }
    // console.log(minor_result)
    return minor_result;
}


var list;
app.post('/sendCard',async(req,res)=>{
    console.log(req.body.cart)
    list = req.body; 
    console.log("presenting list" + list.cart)
})


// Api to calculate the Final price is calculated excluding discounts and including GST and Delivery Charges
app.get("/getProduct",async(req,res)=>{
    var result = []
    for(let i = 0; i<list.cart.length; i++){
        let minor_result = await cal(list.cart[i]);
        result.push(minor_result);
    }
    list = [];
    res.send(result);
})


app.listen(PORT,()=>{
    console.log(`Working at ${PORT}`);
})