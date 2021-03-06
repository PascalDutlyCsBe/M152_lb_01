// For the file upload I used this Tutorial: https://www.youtube.com/watch?v=9Qzmri1WaaE

var express = require('express');
var multer  = require('multer');
const ejs = require('ejs');
var fs = require('fs')
    , gm = require('gm').subClass({imageMagick: true});
const path = require('path');

const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb){
        cb(null, file.fieldname + path.extname(file.originalname));
    }
});

var upload = multer({
    storage: storage
});

var app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.post('/api/file', upload.single('myImage'), function(req, res, next) {
    const file = req.file;
    var filetype = file.mimetype.split("/")[0];
    if(filetype === "image") {
        if (!file) {
            res.render('index');
        } else {
            console.log(req.file);
            res.send(file);
        }
    }else{
        res.send(500);
    }
    gm('./public/uploads/*')
        .resize(720, 720)
        .write('./public/small/small_image.jpg', function (err) {
            if (!err) console.log('small resized');
        });
    gm('./public/uploads/*')
        .resize(1280, 1280)
        .write('./public/medium/medium_image.jpg', function (err) {
            if (!err) console.log('medium resized');
        });
    gm('./public/uploads/*')
        .resize(1920, 1920)
        .write('./public/large/large_image.jpg', function (err) {
            if (!err) console.log('large resized');
        });
});

app.get('/', function (req, res) {
    res.render('index');
});

app.listen(process.env.PORT || 80, function () {
    console.log('App listening on port ' + process.env.PORT);
});
