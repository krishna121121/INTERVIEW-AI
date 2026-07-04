require("dotenv").config();

const app = require("./src/app");
const connectToDb = require("./src/config/database");

connectToDb();

const PORT = process.env.PORT || 3000;


app.get("/",(req,res)=>{
    res.status(200).json({
        message:"successfull"
    })
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});