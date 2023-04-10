'use strict';
// Include our packages in our main server file
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var cors = require('cors');
var path = require('path');
var port = 3503;

var Razorpay = require('razorpay');

let instance = new Razorpay({
    key_id:"rzp_test_4wIWvYrxDrtp8s",
    key_secret:"u5BhaEiebMWLRjLxrVnOXV1s",
});

// Use body-parser to get POST requests for API use
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());


var mysql = require('mysql');
   
var con = mysql.createConnection({
  host: "localhost",
  port: 8889,
  user: "root",
  password: "root",
  database: "soupx_db",
  socketPath: "/Applications/MAMP/tmp/mysql/mysql.sock"
//   insecureAuth : true
});
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});





app.set('view engine', 'ejs');


// app.use("/media", express.static(__dirname + '/media'));
app.use("/soupx", express.static(__dirname + '/soupx'));
app.use("/css", express.static(__dirname + '/soupx/css'));
app.use("/img", express.static(__dirname + '/soupx/img'));
app.use("/images", express.static(__dirname + '/soupx/images'));
app.use("/js", express.static(__dirname + '/soupx/js'));
app.use("/", express.static(__dirname + '/soupx'));
app.use("/assets", express.static(__dirname + '/soupx/assets'));
app.use("/video", express.static(__dirname + '/soupx/video'));
app.use("/sitemap.xml", express.static(__dirname + '/sitemap.xml'));

app.get('/db', function(req, res) {
    con.query('SELECT * FROM Tests', function (error, results, fields) {
        if (error) throw error;
        console.log('The solution is: ', results);
      });
      res.send("OK");


});

app.post('/db', function(req, res) {
    console.log(typeof (parseInt(req.body.ID)));
    console.log(typeof (req.body.name.toString()));
    var ID = parseInt(req.body.ID);
    var name = req.body.name.toString();
    con.query(`INSERT INTO Tests  VALUES (${ID},"${name}") `, function (error, results, fields) {
        if (error) throw error;
        // console.log('The solution is: ', results[0].ID);
      });
      res.send("OK");


});

app.post("/api/payment/order",(req,res)=>{
    var params=req.body;
    instance.orders.create(params).then((data) => {
           res.send({"sub":data,"status":"success"});
    }).catch((error) => {
           res.send({"sub":error,"status":"failed"});
    })
    });


app.post("/api/payment/verify",(req,res)=>{
    var body=req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;
    var crypto = require("crypto");
    var expectedSignature = crypto.createHmac('sha256', 'u5BhaEiebMWLRjLxrVnOXV1s')
                                    .update(body.toString())
                                    .digest('hex');
                                    console.log("sig"+req.body.razorpay_signature);
                                    console.log("sig"+expectedSignature);
    var response = {"status":"failure"}
    if(expectedSignature === req.body.razorpay_signature)
        response={"status":"success"}
        res.send(response);
    });    
    







app.get('/', function (req, res) {
     
    res.render(path.join(__dirname+'/soupx/index.ejs'))
    
});

app.get('/payment', function (req, res) {
     
    res.render(path.join(__dirname+'/soupx/razorpay.ejs'))
    
});

app.get('/subscription', function (req, res) {
     
    res.render(path.join(__dirname+'/soupx/subscription.ejs'))
    
});

app.get('/explore', function(request, response){
    
    response.redirect("http://localhost:8888/explore/")
});

app.get('/faq', function(request, response){    
  
    response.render(path.join(__dirname+'/soupx/faq'), {user: db.signInUser});    
   
}, function(err){});


app.get('/about-us', function(request, response){    
    
    response.render(path.join(__dirname+'/soupx/about'))     
   
}, function(err){});

app.get('/privacy-policy', function(request, response){ 
    auth.checkToken(request, response, function(){
        response.render(path.join(__dirname+'/soupx/privacy-policy'), {user: db.signInUser});    
    }, function(err){
        response.render(path.join(__dirname+'/soupx/privacy-policy'), {user: {}});    
    });   
}, function(err){});

app.get('/refund-policy', function(request, response){ 
    auth.checkToken(request, response, function(){
        response.render(path.join(__dirname+'/soupx/refund-policy'), {user: db.signInUser});    
    }, function(err){
        response.render(path.join(__dirname+'/soupx/refund-policy'), {user: {}});    
    });   
}, function(err){});

app.get('/terms-and-conditions', function(request, response){ 
    auth.checkToken(request, response, function(){
        response.render(path.join(__dirname+'/soupx/terms-and-conditions'), {user: db.signInUser});    
    }, function(err){
        response.render(path.join(__dirname+'/soupx/terms-and-conditions'), {user: {}});    
    });   
}, function(err){});




// Start the server
app.listen(port);
console.log('Your server is running on port ' + port + '.');
