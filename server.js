const express = require('express');
const jwt = require('jsonwebtoken');
const signupRoutes = require('./routes');
const productRoutes = require('./productRoutes');
const dbConnection = require('./dbConnection')
const app = express();


app.use(express.json());

app.use(signupRoutes);

app.use('/products',checkAuthentication,productRoutes);

app.use('*', (req, res) => {
    res.status(404).json({
      success: 'false',
      message: 'Page not found',
      error: {
        statusCode: 404,
        message: 'You reached a route that is not defined on this server',
      },
    });
  });


  function checkAuthentication(req,res,next){
    jwt.verify(req.headers.token, 'secret', function(err, decoded) {
        if(err){
            return res.status(401).json({statusCode:401,message:'User not authorized'}); 
        }
        if(req.method === 'GET'){
            next();
        }
        else if(decoded.data.role === 'ADMIN'){
            next();
        }
       else if(req.method === 'DELETE' && decoded.data.role === 'SUPPORTER'){
            next();
        }
        else{
            return res.status(401).json({statusCode:401,message:'Not authorized to access endpoint'});
        }
    });
  }

app.listen(8000,`localhost`,()=>{
    console.log(`Server listening at 8000`);
})

module.exports = app;