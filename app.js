var express = require('express');
var bodyParser = require('body-parser');
var drive = require('./drive');


var nodemailer = require('nodemailer');

async function sendEmail(name,id) {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtpout.secureserver.net",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "info@iamyourstory.in", // generated ethereal user
      pass: "ImUrs1402$" // generated ethereal password
    },
    timeout: 10000
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"ImUrs" <info@iamyourstory.in>', // sender address
    to: id, 
    subject: "Order processed at I Am Your Story", 
    text: "Dear " + name.split(" ")[0] + ",\n\nThank you for placing an order with us. Your order has been successfully processed.\n\nYou will receive an email within next 12 hours for updating the key ingredients of your Valentines Magazine Edition i.e. your narratives and images.\n\nThankyou for choosing ImUrs. We won’t disappoint you!\n\nCheers\nImUrs - I Am Your Story", 
  });

  //console.log("Message sent: %s", info.messageId);
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
      try{
        sendEmail(req.body.name,req.body.email);
      }
      catch(e){
        console.log(e);
      }
    });
  });
})

app.get('/valentines', function(req,res){
    res.sendFile( __dirname + "/views" + "/landing.html" );
});
app.get('/thankyou', function(req,res){
    res.sendFile( __dirname + "/views/thankyou.html" );
  });

app.listen(process.env.PORT || 5000);
