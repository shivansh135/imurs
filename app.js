var express = require('express');
var bodyParser = require('body-parser');
var drive = require('./drive');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

var question = [
  {
    "head" : "Relationship Ignition",
    "questions": "How you both got introduced to each other.\nHow things wrapped into relationship & who made the first move.\nAny characteristic of him/her you got attracted to or any special memory you wish to put forward." 
  },
  {
    "head" : "First Meeting",
    "questions": "Date and location\nHow the meet started and wrapped up\nMemorable stories and moments from the day" 
  },
  {
    "head" : "Pre-proposal",
    "questions": "How the relation looked like when you both were not committed\nA incident from your pre relationship days" 
  },
  {
    "head" : "Proposal",
    "questions": "Date and venue/social media/call\nWho proposed and how\nDid first proposal got accepted. If no, what happened next\nSome memory from the day like  coffee date or something " 
  },
  {
    "head" : "Go-to places",
    "questions": "Any fav food to eat\nAny trip together. If yes, elaborate a bit" 
  },
  {
    "head" : "Nature",
    "questions": "Similarities between both\nDifferences between both" 
  },
  {
    "head" : "Introvert or Extrovert",
    "questions": "Who is introvert and who is extrovert?\nMention a incidence which proves so" 
  },
  {
    "head" : "Resolutions",
    "questions": "Places planned to visit together\nCareer goals to accomplish and how you’ve supporting each other" 
  },
  {
    "head": "EOQs",
    "questions": "its the end of questions"
  }
]


var nodemailer = require('nodemailer');
const { json } = require('express');

async function sendEmail(name,id,fl) {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtpout.secureserver.net",
    port: 465,
    secure: true, // true for 465, false for other ports
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
    text: "Dear " + name.split(" ")[0] + ",\n\nThank you for placing an order with us. Your order has been successfully processed.\n\nYou will receive an email within next 6 hours for updating the key ingredients of your Valentines Magazine Edition i.e. your narratives and images.\nhttps://iamyourstory.in/uplodeDataForWedding/"+ fl +"\nThankyou for choosing ImUrs. We won’t disappoint you!\n\nCheers\nImUrs - I Am Your Story", 
  });

  //console.log("Message sent: %s", info.messageId);
}

async function sendPhotographerEmail(name,id) {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtpout.secureserver.net",
    port: 465,
    secure: true, // true for 465, false for other ports
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
    text: "Dear " + name.split(" ")[0] + ",\n\n" + "https://iamyourstory.in/collab/"+name.replace(/\s+/g, '-').toLowerCase(), 
  });

  //console.log("Message sent: %s", info.messageId);
}

app = express();
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 

app.get('/', function(req,res){
  res.sendFile( __dirname + "/views" + "/landing.html" );
});

app.get('/photographers', function(req,res){
  res.sendFile( __dirname + "/views" + "/photographer.html" );
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

app.post('/registerPhotographer',function(req,res){
  var landeduserfile = "1t0FBRrUIDRnGyxxwzntKlfgvCDuzJJ-d";
  var nd;
  drive.downloadFile(landeduserfile).then(data =>{
    nd = data.data + '\n' + req.body.name + ' ,' +  req.body.phone+ ' ,' + req.body.email;
    drive.updateFile(landeduserfile,nd);
    sendPhotographerEmail(req.body.name,req.body.email).then(hello => {
      res.send("Thank You");
    })
  });
})

app.get('/collab/:name',function(req,res){
  const data = fs.readFileSync(path.join(__dirname+'/views/collab.html'),{encoding:'utf8', flag:'r'});
  res.send(data + "<script>var p_name ='" + req.params.name + "';setName()</script>");
})

app.post('/reciveOrder',function(req,res){

  var landeduserfile = "1W6WFLBeerPS_hZOcGKTi2rWrHSIWZwGz"; 

  drive.createFolder(req.body.name,req.body.phone,'1gQ8dFtDYe3mvSFlaX0qp1oPNoffjrct0').then(data =>{

    var nd;
    drive.downloadFile(landeduserfile).then(dataa =>{
      nd = dataa.data + '\n' + req.body.name+ ' ,' +  req.body.phone+ ' ,' + req.body.email + ' ,' +  req.body.pg + ' ,' +  req.body.town + ' ,' + data;
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

app.post('/reciveOrderByPG',function(req,res){

  var landeduserfile = "1SXq33T65axRxs1PY6VI6BcTChMYI_s5Z"; 

  drive.createFolder(req.body.name,req.body.phone,'1gQ8dFtDYe3mvSFlaX0qp1oPNoffjrct0').then(data =>{
    var nd;
    drive.downloadFile(landeduserfile).then(dataa =>{
      nd = dataa.data + '\n' + req.body.photog+ " ," +req.body.name + ' ,' +  req.body.phone+ ' ,' + req.body.email + ' ,' +  req.body.date + ' ,' +  req.body.pg + ' ,' + data;
      drive.updateFile(landeduserfile,nd);
      drive.createFile(req.body.name,req.body.phone,req.body.email,req.body.photog,req.body.pg,data);
      try{
        sendEmail(req.body.name,req.body.email,data);
      }
      catch(e){
        console.log(e);
      }
    });
  });
})

app.post('/getlayout',function(req,res){
  var id = req.body.id;
  drive.downloadFile(id).then(data =>{
    res.send(data);
  });
})

app.get('/valentines', function(req,res){
    res.sendFile( __dirname + "/views" + "/landing.html" );
});

app.get('/thankyou', function(req,res){
    res.sendFile( __dirname + "/views/thankyou.html" );
  });

  app.get('/uplodeDataForWedding/:prod_id', function(req,res){
    var name;
    var no_of_folders = 0;
    const data = fs.readFileSync(path.join(__dirname+'/views/userinputt.html'),{encoding:'utf8', flag:'r'});
      drive.searchFiles(req.params.prod_id).then(files=>{
        files.forEach(ele=>{
          if(ele.mimeType == "text/plain"){
            name = ele.name.split(" ")[0];
          }
          if(ele.mimeType == "application/vnd.google-apps.folder"){
            no_of_folders++;
          }
        })
        if(no_of_folders == 8){
          res.sendFile(__dirname+"/views/tracking.html");
        }
        else{
          res.send(data+"<script> var prod_id = '"+req.params.prod_id+"';var curr_q = "+ (no_of_folders + 1) +";setQuestion("+JSON.stringify(question[no_of_folders])+",'"+name+"');</script>");
        }
      })
  });
  const upload = multer({ dest: 'uploads/' });
  
  

  app.post('/updateNextQuestion', upload.fields([
    { name: 'image0', maxCount: 1 },
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 },
  ]), (req, res) => {
    drive.createFolder(question[req.body.curr_q-1].head," ",req.body.prod_id).then(id=>{
      drive.createUserInputs('info',req.body.ans,id).then(xyz=>{
        var nid = id;
        drive.uploadImagesToDrive(req.files,nid).then(imgsid=>{
          console.log(imgsid);
            res.send(question[req.body.curr_q]);
        });
      })
    })

  });


app.listen(process.env.PORT || 5000);
