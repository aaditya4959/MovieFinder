const express = require("express");
const path = require("path");
const app = express();
const fs = require("fs");
const cors = require("cors");
// const corsOptions = require("./config/corsOptions");
PORT = process.env.PORT || 3500;


// app.use(cors(corsOptions));  Will use it later
app.use(express.urlencoded({extended:false}));
app.use('/', express.static(path.join(__dirname, '/public')));






app.get("/" , (req,res) => {
    const data = fs.readFileSync(path.join(__dirname,"public","index.html"));
    res.end(data);
})

app.listen(PORT, () => {
    console.log(`The application is listening to the port ${PORT}`);
})