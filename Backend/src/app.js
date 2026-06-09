const express=require('express');
const authRouter = require('./routes/auth.routes');
const app=express();
const cookieParser=require("cookie-parser");



app.use(express.json());
app.use(cookieParser());

app.use("/api/auth",authRouter);

app.get('/',(req,res)=>{
    res.send("this is my website running")
})

module.exports=app;