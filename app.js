var express = require('express');
var bodyParser = require('body-parser');
var drive = require('./drive');


var nodemailer = require('nodemailer');

function sendEmail(userEmail){
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'shivanshmitra53@gmail.com',
          pass: 'hello9877'
        }
      });
      var mailOptions = {
        from: 'mitrashivansh47@gmail.com',
        to: 'myfriend@yahoo.com',
        subject: 'Sending Email using Node.js',
        text: 'Dear Customer, Thank you for placing an order with us. Your order has been successfully processed.You will receive an email within next 12 hours for updating the key ingredients of your Valentines Magazine Edition i.e. your narratives and images.Thankyou for choosing ImUrs. We won’t disappoint you! Cheers ImUrs - I Am Your Story'
      };

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          //console.log('Email sent: ' + info.response);
        }
      });      
}




app = express();
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 

app.get('/', function(req,res){
  res.sendFile( __dirname + "/views" + "/landing.html" );
});

app.get('/public/imgs/:imgname', function(req,res){
    res.sendFile( __dirname + "/public/imgs/" + req.params.imgname);
  });

app.post('/landedUsersInfo',function(req,res){
  var landeduserfile = "1TBvaC7NjpVHUh6hkfs_rQwX1hLzFs_hr";
  var nd;
  drive.downloadFile(landeduserfile).then(data =>{
    nd = data.data + '\n' + req.body.name+ ' ,' +  req.body.phone+ ' ,' + req.body.email + ' ,' +  req.body.gender+ ' ,' +  req.body.town;
    drive.updateFile(landeduserfile,nd);
  });
})

app.post('/reciveOrder',function(req,res){

  var landeduserfile = "1W6WFLBeerPS_hZOcGKTi2rWrHSIWZwGz";

  drive.createFolder(req.body.name,req.body.phone).then(data =>{

    var nd;
    drive.downloadFile(landeduserfile).then(dataa =>{
      nd = dataa.data + '\n' + req.body.name+ ' ,' +  req.body.phone+ ' ,' + req.body.email + ' ,' +  req.body.gender+ ' ,' +  req.body.town + ' ,' + data;
      drive.updateFile(landeduserfile,nd);
      drive.createFile(req.body.name,req.body.phone,req.body.email,req.body.town,req.body.pg,data);
    });
  });



})

app.listen(process.env.PORT || 5000);
