require('dotenv').config();
const cors = require('cors')
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser")
const admin = require("./Routes/admin")

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));

const port = process.env.PORT
const host = process.env.HOST

mongoose.connect(`${process.env.mongodb}/fileManager`)

app.get("/api/health", function(req, res){
    res.send(`Serer active at time: ${new Date()}`)
})

app.use("/api/admin", admin)

app.listen(port, function(err){
    if(err){
        console.log(err);
    }
    else{
        console.log(`Listening on ${host}:${port}`);
    }
})