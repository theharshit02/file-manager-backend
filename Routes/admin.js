const { Router } = require("express")
const route = Router();
const mongoose = require("mongoose");

const passwordSchema = mongoose.Schema({
    password: String
})

const folderSchema = mongoose.Schema({
    name: String,
    files: [{
        fname: String,
        fcontent: String
    }]
})

const password = mongoose.model("Password", passwordSchema)
const folder = mongoose.model("Folder", folderSchema)

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

route.post("/folderName/:name", async function(req, res){
    var newFolder = new folder({
        name: req.params.name
    })
    await newFolder.save()
})

route.get("/listFolder", function(req, res){
    folder.find(function(err, result){
        res.send(result)
    })
})

route.post("/file/:foldername", function(req, res){
    folder.find({name: req.params.foldername}, async function(err, result){
        if(err){
            console.log(err);
        }
        else{
            var newobj = {
                fname: req.query.fname,
                fcontent: ""
            }
            await folder.updateOne({name: req.params.foldername}, {$push: {files: [newobj]}})
        }
    })
})

route.get("/getFiles/:foldername", function(req, res){
    folder.find({name: req.params.foldername}, async function(err,result){
        if(err){
            console.log(err);
        }
        else{
            res.send(result)
        }
    })
})

route.post("/updateContent/:foldername/:filename/:content", async function(req, res){
    await folder.updateOne({name: req.params.foldername, "files.fname": req.params.filename}, {"files.$.fcontent": req.params.content})
})

route.get("/searchFiles/:searchText", function(req, res){

    const filename = []
    const searched =[]
    folder.find(function(err, result){
        if(err){
            console.log(err)
        }
        else{
            result.forEach((items)=>{
                console.log(items.files)
                const x = items.files
                x.forEach((i)=>{
                    filename.push(i.fname)
                })
            })
            filename.find((element)=>{
                if(element.toLowerCase().includes((req.params.searchText).toLowerCase())){
                    searched.push(element)
                }
            })
            res.send(searched)
        }
    })
})

route.get("/autoSelect/:filename", function(req, res){
    // const filename = req.params.filename
    // folder.find({files: {fname: {filename}}}, function(err, result){
    //     if(err){
    //         console.log(err)
    //     }
    //     else{
    //         res.send(result)
    //     }
    // })

    const x = folder.aggregate([ { $unwind : "$files" } ], function(err, result){
        if(err){
            console.log(err)
        }
        else{
            result.map((i)=>{
                console.log(i)
                if(i.files.fname === req.params.filename){
                    res.send({foldname: i.name, filename: i.files.fname, filecontent: i.files.fcontent})
                }
            })
        }
    })
})
module.exports = route;