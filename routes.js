const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;
const app = express();
const userModel = require('./userModel');


app.post('/signup',async(req,res,next)=>{
    try {
        if(!req.body.userName || !req.body.role || !req.body.password){
            return res.status(400).json({statusCode:400,success:false,message:"Missing fields"});
        }
        const getUser = await userModel.findOne({userName:req.body.userName});
        if(getUser){
            return res.status(409).json({statusCode:409,success:false,message:'User Already Exist'});
        }
        if(req.body.role){
            req.body.role = req.body.role.toUpperCase();
        }
        const permissions = getPermissions(req.body.role);
        req.body.permissions = permissions;
        bcrypt.genSalt(saltRounds, (err, salt)=>{
            bcrypt.hash(req.body.password, salt, async(err, hash)=>{
                req.body.password = hash;
                const user = new userModel(req.body);
                await user.save();
                return res.status(201).json({statusCode:201,success:true,message:'User Created'});
            });
        });
      } catch (error) {
        next(error);
      }
})


app.post('/login',async(req,res,next)=>{
    try {
        if(!req.body.userName || !req.body.password){
            return res.status(400).json({statusCode:400,success:false,message:"Missing fields"});
        }
        const getUser = await userModel.findOne({userName:req.body.userName});
        if(getUser){
            bcrypt.compare(req.body.password, getUser.password, function(err, result) {
            if(result){
                let token = jwt.sign({
                    exp: Math.floor(Date.now() / 1000) + (60 * 60),
                    data: {_id:getUser._id,role:getUser.role}
                  }, 'secret');
                return res.status(200).json({statusCode:200,success:true,message:'Login Successfully',data:{
                    token:token
                }});
            }else{
                return res.status(401).json({statusCode:401,success:false,message:'Unauthorized'}); 
            }
            });
        }else{
            return res.status(404).json({statusCode:404,success:false,message:'User not found.'});
        }
      } catch (error) {
        next(error);
      }
})


function getPermissions(role){
   let permissions = {
        "create": true,
        "update": true,
        "delete": true,
        "fetch": true
      }
    switch(role){
        case "ADMIN":
        break;
        case "SELLER":
         permissions.delete = false;
         break;
        case 'SUPPORTER':
        permissions.create = false;
        permissions.update = false;
        break;
        case "CUSTOMER":
        permissions.delete = false;
        permissions.update = false;
        permissions.create = false;  
        break;
        default:
        permissions = permissions;
    }
    return permissions;
}


module.exports = app;