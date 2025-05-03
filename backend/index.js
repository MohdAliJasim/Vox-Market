const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const {requireAuth} = require("./middleware/authMiddleware");
const UsrRout = require('./routers/userRouter');
const SlrRout = require('./routers/sellerRouter');
const PrdtRout = require('./routers/productRouter');
const orderRout = require('./Routers/orderRouter');
const imageRout = require('./Routers/cloudinaryRouter');
const reviewRout = require('./Routers/reviewRouter');



const app = express();
const port = 5000;

//middlewares
app.use(cors({
    origin:'http://localhost:3000',
    credentials: true
}))//this allows the cross origin request from port 3000

app.use(express.json());//this middleware is used to convert json_req to object_req value.

app.use(cookieParser());

app.use('/u',UsrRout);//this passes all req(/u) to UsrRouter
app.use('/s',SlrRout);
app.use('/p',PrdtRout);
app.use('/o',orderRout);
app.use('/img',imageRout);
app.use('/review',reviewRout);

app.get('/test',(req,res)=>{
    res.send("test : Working")
});

app.get('/',requireAuth,(req,res)=>{
    console.log('inside home');
    res.send('hello');
})

app.listen(port,()=>{
    console.log("server started at port : "+port);
})