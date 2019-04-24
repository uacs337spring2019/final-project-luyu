const express = require("express");
const app = express();
var fs = require('fs');
app.use(express.static('public'));

//¥”txt÷–∂¡»°
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
app.get('/', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var mode = req.query.mode;
    var content = req.query.content;
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









