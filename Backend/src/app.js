const express=require('express');
const authRouter = require('./routes/auth.routes');
const app=express();
const cookieParser=require("cookie-parser");
const cors=require("cors");
const interviewRouter = require('./routes/interview.routes');


app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://interview-eubzhe3gt-krishna121121s-projects.vercel.app",
        "https://interview-ai-git-master-krishna121121s-projects.vercel.app",
        "https://interview-ai-jet-omega.vercel.app/"
    ],
    credentials: true,
}));



app.use(express.json());
app.use(cookieParser());

app.use("/api/auth",authRouter);
app.use("/api/interview",interviewRouter)



module.exports=app;