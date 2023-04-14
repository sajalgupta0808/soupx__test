'use strict';
// Include our packages in our main server file
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var cors = require('cors');
var path = require('path');
var port = 3504;

var Razorpay = require('razorpay');
const { response } = require('express');

let instance = new Razorpay({
    key_id:"rzp_test_4wIWvYrxDrtp8s",
    key_secret:"u5BhaEiebMWLRjLxrVnOXV1s",
});

// Use body-parser to get POST requests for API use
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());


var mysql = require('mysql');
const { use } = require('express/lib/application');
   
var con = mysql.createConnection({
  host: "soupx-db.cfnfjggw1jc7.ap-south-1.rds.amazonaws.com",
  port: 3306,
  user: "admin",
  password: "adminSoupX",
  database: "SoupX_db",
//   socketPath: "/Applications/MAMP/tmp/mysql/mysql.sock"
//   insecureAuth : true
});
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  con.query('CREATE TABLE IF NOT EXISTS leads(id int NOT NULL AUTO_INCREMENT, phone varchar(30), PRIMARY KEY(id));', function(error, result, fields) {
    console.log(result);
  });
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


app.post('/leads', (req, res) => {
    const phone  = req.body.phone;
    console.log(phone);
    con.query(`INSERT INTO leads (phone) VALUES ("${phone}")`, function(err, result, fields) {
        if (err) throw err 
        // res.send('User saved successfully!')
        res.redirect("https://explore.soupx.in/")
    })
});

app.delete('/leads', (req, res)=>{
    con.connect(function(err){
        con.query(`DELETE FROM leads`, function(err, result, fields){
            if (err) throw err 
        })
    })
})

app.get('/leads', (req, res) => {
    con.connect(function(err) {
        con.query(`SELECT * FROM leads`, function(err, result, fields) {
            if (err) res.send(err);
            if (result) res.send(result);

        });
    });
});


// app.post('/db', function(req, res) {
//     console.log(typeof (parseInt(req.body.ID)));
//     console.log(typeof (req.body.name.toString()));
//     var ID = parseInt(req.body.ID);
//     var name = req.body.name.toString();
//     con.query(`INSERT INTO Tests  VALUES (${ID},"${name}") `, function (error, results, fields) {
//         if (error) throw error;
//         // console.log('The solution is: ', results[0].ID);
//       });
//       res.send("OK");


// });

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
     
    // res.render(path.join(__dirname+'/soupx/subscription.ejs'))
    response.redirect("https://subscription.soupx.in/")
    
});

app.get('/explore', function(request, response){
    
    response.render(path.join(__dirname+'/soupx/explore.ejs'))
    // response.redirect("http://localhost:8888/explore/")

});

app.get('/faq', function(request, response){    
  
    response.render(path.join(__dirname+'/soupx/faq'))    
   
});


app.get('/about-us', function(request, response){    
    
    response.render(path.join(__dirname+'/soupx/about'))     
   
}, function(err){});

app.get('/privacy-policy', function(request, response){ 

    response.render(path.join(__dirname+'/soupx/privacy-policy'))  
});

app.get('/refund-policy', function(request, response){ 

    response.render(path.join(__dirname+'/soupx/refund-policy'))  
});

app.get('/terms-and-conditions', function(request, response){ 

    response.render(path.join(__dirname+'/soupx/terms-and-conditions'))
});  





// Start the server
app.listen(port);
console.log('Your server is running on port ' + port + '.');
