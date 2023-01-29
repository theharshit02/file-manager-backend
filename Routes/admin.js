const { Router } = require("express")
const route = Router();
const mongoose = require("mongoose");

const passwordSchema = mongoose.Schema({
    password: String
})

const password = mongoose.model("Password", passwordSchema)

route.get("/status", function(req, res){
    password.find(function(err, result){
        if(err){
            console.log(err);
        }
        else{
            if(result.length === 0 ){
                res.send("0")
            }
            else{
                console.log(result);
                res.send("1")
            }
        }
    })
})


route.post("/setPin/:pass", function(req, res){
    password.find(async function(err, result){
        if(err){
            console.log(err);
        }
        else{
            if(result.length === 0){
                var newObj = new password({
                    password: req.params.pass
                })
                await newObj.save()
            }
            else{
                await password.updateOne({password: req.params.pass})
            }
        }
    })
})

route.get("/checkPin/:pass", function(req, res){
    password.find(async function(err, result){
        if(err){
            console.log(err);
        }
        else{
            result.forEach(element => {
                if(element.password === req.params.pass){
                    res.send("0")
                }
                else{
                    res.send("1")
                }
            });
            // console.log(result);
        }
    })
})

module.exports = route;