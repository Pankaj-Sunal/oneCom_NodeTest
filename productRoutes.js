const express = require('express');
const app = express();


app.get('/getProduct',(req,res)=>{
    return res.status(200).json({ statusCode:200,message:`Products sent successfully`})
})

app.post('/addProduct',(req,res)=>{
    return res.status(201).json({ statusCode:201,message:`Products added successfully`})
})

app.put('/updateProduct',(req,res)=>{
    return res.status(200).json({ statusCode:200,message:`Products updated successfully`})
})

app.delete('/deleteProduct',(req,res)=>{
    return res.status(200).json({ statusCode:200,message:`Products deleted successfully`})
})


module.exports = app;