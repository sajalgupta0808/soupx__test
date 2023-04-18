'use strict';
// Include our packages in our main server file
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const axios = require('axios');

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
  host: "soupx-db.ct4awx1ga5he.eu-north-1.rds.amazonaws.com",
  port: 3306,
  user: "admin",
  password: "SoupXadmin",
  database: "SoupX_db",
});
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  con.query('CREATE TABLE IF NOT EXISTS explore_leads(id int NOT NULL AUTO_INCREMENT, phone varchar(30), verification varchar(10), PRIMARY KEY(id));', function(error, result, fields) {
    // console.log(result);
  });
});

app.set('view engine', 'ejs');

app.use("/soupx", express.static(__dirname + '/soupx'));
app.use("/css", express.static(__dirname + '/soupx/css'));
app.use("/img", express.static(__dirname + '/soupx/img'));
app.use("/images", express.static(__dirname + '/soupx/images'));
app.use("/js", express.static(__dirname + '/soupx/js'));
app.use("/", express.static(__dirname + '/soupx'));
app.use("/assets", express.static(__dirname + '/soupx/assets'));
app.use("/video", express.static(__dirname + '/soupx/video'));
app.use("/sitemap.xml", express.static(__dirname + '/sitemap.xml'));


//CREATE EXPLORE LEAD API
app.post('/leads', async (req, res) => {
    const phone  = req.body.phone;
    console.log(phone);
    await con.query(`INSERT INTO explore_leads (phone, verification) VALUES ("${phone}", "No")`, function(err, result, fields) {
        if (err) throw err 
        const options = {
            method: 'POST',
            url: `https://control.msg91.com/api/v5/otp?template_id=626695641042174181129b03&mobile=91${phone}`,
            headers: {
              accept: 'application/json',
              'content-type': 'application/json',
              authkey: '372124AHzypLn4SL961e928fcP1'
            },
            data: {Param1: 'value1', Param2: 'value2', Param3: 'value3'}
          };
          
          axios
            .request(options)
            .then(function (response) {
            //   console.log(response.data);
            })
            .catch(function (error) {
              console.error(error);
            });
        // res.send('User saved successfully!')
        // res.redirect("https://explore.soupx.in/")

    })
});

//VERIFY EXPLORE LEAD API
app.post('/verify_lead',  (req, res)=>{
    const phone = req.body.phone;
    const otp = req.body.otp;
    const options = {
        method: 'GET',
        url: `https://control.msg91.com/api/v5/otp/verify?otp=${otp}&mobile=91${phone}`,
        headers: {accept: 'application/json', authkey: '372124AHzypLn4SL961e928fcP1'}
      };

       axios
      .request(options)
      .then(function (response) {
        console.log(response.data);
        if(response.data.type=="success"){
            con.query(`UPDATE explore_leads SET verification="Yes" where phone = "${phone}" `);

            // axios.get('https://explore.soupx.in/').then(function(response) {
            // //    res.redirect( response.request.res.responseUrl); 
            //     console.log(response.request.res.responseUrl);
            //     // console.log(ans.status);
             
            //    }).catch(function(no200){
            //     console.error("404, 400, and other events");
               
            //   });
        }
        else{
            // res.send(response.data);
        }
      })
      .catch(function (error) {
        console.error(error);
      });
  

})


app.get('/explore_menu', async function (req, res) {
     
    // res.render(path.join(__dirname+'/soupx/subscription.ejs'))
    await res.redirect("https://explore.soupx.in/");
    
});



//DELETE EXPLORE LEAD
app.delete('/delete_leads', (req, res)=>{
    con.connect(function(err){
        con.query(`DELETE FROM explore_leads`, function(err, result, fields){
            if (err) throw err 
            res.send('Deleted Successfully!')
        })
    })
})

//GET EXPLORE LEADS
app.get('/get_leads', (req, res) => {
    con.connect(function(err) {
        con.query(`SELECT * FROM explore_leads`, function(err, result, fields) {
            if (err) res.send(err);
            if (result) res.send(result);

        });
    });
});

//CREATE RAZORPAY ORDER
app.post("/api/payment/order",(req,res)=>{
    var params=req.body;
    instance.orders.create(params).then((data) => {
           res.send({"sub":data,"status":"success"});
    }).catch((error) => {
           res.send({"sub":error,"status":"failed"});
    })
    });

//VERIFY PAYMENT
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

//REDIRECT TO HOMEPAGE
app.get('/', function (req, res) {
     
    res.render(path.join(__dirname+'/soupx/index.ejs'))
    
});

//REDIRECT TO PAYMENT PAGE
app.get('/payment', function (req, res) {
     
    res.render(path.join(__dirname+'/soupx/razorpay.ejs'))
    
});

//REDIRECT TO SUBSCRIPTION PAGE
app.get('/subscription', function (req, res) {
     
    res.render(path.join(__dirname+'/soupx/subscription.ejs'))
    // response.redirect("https://subscription.soupx.in/")
    
});

//REDIRECT TO EXPLORE PAGE
app.get('/explore', function(request, response){
    
    response.render(path.join(__dirname+'/soupx/explore.ejs'))
   
});

//REDIRECT TO FAQ PAGE
app.get('/faq', function(request, response){    
  
    response.render(path.join(__dirname+'/soupx/faq'))    
   
});

//REDIRECT TO ABOUT US PAGE
app.get('/about-us', function(request, response){    
    
    response.render(path.join(__dirname+'/soupx/about'))     
   
}, function(err){});

//REDIRECT TO PRIVACY POLICY PAGE
app.get('/privacy-policy', function(request, response){ 

    response.render(path.join(__dirname+'/soupx/privacy-policy'))  
});

//REDIRECT TO REFUND POLICY PAGE
app.get('/refund-policy', function(request, response){ 

    response.render(path.join(__dirname+'/soupx/refund-policy'))  
});

//REDIRECT TO TnC PAGE
app.get('/terms-and-conditions', function(request, response){ 

    response.render(path.join(__dirname+'/soupx/terms-and-conditions'))
});  

// Start the server
app.listen(port);
console.log('Your server is running on port ' + port + '.');
