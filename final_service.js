/*
Name:Lu Yu
Course: CSC 337
Assignment:final assignment  
Description: This app will allow user to build memos. When the page loads, 
it will show an input box for the user to write the title of the memo and a 
button to save the memo. The saved memo will be shown on the page. 
The user will be able to add more memos. New memo will be added to the page, 
displayed on top of old memos. When the mouse hovers over an old memo, 
two options will appear. One option is to delete this memo. 
The other option is to add more information and set the date for this memo. 
All memos and its information will be saved to a txt file.
Files: final.html, final.css, final.js,final_service.js
*/
const express = require("express");
const app = express();
var fs = require('fs');
app.use(express.static('public'));
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", 
               "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
function ReadNodes() {
    var objs = [];
    districts = fs.readFileSync("node.txt", 'utf8');
    var lines = districts.split("\n");
    console.log(lines);
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i].split(",");
        var obj = {};
        obj.id = line[0].split(":")[1];
        obj.title = line[1].split(":")[1];
        obj.desc = line[2].split(":")[1];
        obj.date = line[3].split(":")[1];
        objs.push(obj);
    }
    return objs;
}


function WriteNodes(array) {
    console.log(array);
    var datas = JSON.parse(array);
    var strs = "";
    for (var i = 0; i < datas.length; i++) {
        var str = "";
        if (i == datas.length - 1) {
            str = JSON.stringify(datas[i]);
        } else {
            str = JSON.stringify(datas[i]) + "\r\n";
        }
        strs += str;
    }
    fs.writeFile("node.txt", strs, 'utf-8', function (err) {
        if (err) {
            return false;
        }
        else {
            return true;
        }
    });
}

console.log('web service started');
app.get('/', jsonParser, function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var mode = req.query.mode;
    console.log(content);
    var content = req.query.content;
    console.log(content);
    if (mode == "Read") {
        var objs = ReadNodes();
        res.send(objs);
    } else {
        console.log(content);
        var result = WriteNodes(content);
        if (result) {
            res.send("False");
        } else {
            res.send("Success");
        }
    }
})



app.use(express.static('public'));

app.post('/', jsonParser, function (req, res) {
    //console.log(req.body.text);
    //res.send(JSON.stringify(req.body.text));
    res.header("Access-Control-Allow-Origin", "*");
    var mode = req.body.mode;
    var content = req.body.content;
    if (mode == "Read") {
        var objs = ReadNodes();
        res.send(objs);
    } else {
        var result = WriteNodes(content);
        if (result) {
            res.send("False");
        } else {
            res.send("Success");
        }
    }
})

//app.listen(3000);
app.listen(process.env.PORT);









