require('dotenv').config();

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Schema = mongoose.Schema
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const cron = require('node-cron');
const axios = require('axios');
const { body } = require('express-validator');
const multer = require('multer');
const { google } = require('googleapis');
const session = require('express-session');
const fs = require('fs');
const stream = require("stream");
const { customAlphabet } = require('nanoid');
const autoIncrement = require("mongoose-sequence")(mongoose);


//function keepServerAwaike() {
//  http.get('https://mymongoose.onrender.com', (res) => {
//    console.log(`Status Code: ${res.statusCode}`);
//}).on('error', (e) => {
//  console.error(`Error: ${e.message}`);
//});
//}

// Schedule the task to run every 5 minutes
//cron.schedule('*/14 * * * *', () => {
//  console.log('Sending keep-alive request to server...');
// keepServerAwaike();
//});

// Google Drive API setup

const serverUrl = 'https://right-66q6.onrender.com'

const keepAlive = () => {
    axios.get(serverUrl)
        .then(response => {
            console.log(`server response with status:${response.status}`)
        })
        .catch(error => {
            console.log(`error keeping server alive:${error.message}`)
        })
}

const oauth2Client = new google.auth.OAuth2(
    '299799989715-9j5t32aoriem1chgjkd1d91vleh9njni.apps.googleusercontent.com',
    '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',
    'https://developers.google.com/oauthplayground'
);

oauth2Client.setCredentials({ refresh_token: '1//04SleHQlO68aLCgYIARAAGAQSNwF-L9IrZKYFd3YWazjkliZA_Z3tO98_P1q76Eb-_zLAugY-fN2A6M0kHNABfJL9OEnrB90YC3c' });

const drive = google.drive({ version: 'v3', auth: oauth2Client });


//function keepServerAwaike() {
//axios.get('https://mymongoose.onrender.com', (res) => {
// console.log(`Status Code: ${res.statusCode}`);
//}).on('error', (e) => {
//console.error(`Error: ${e.message}`);
//});
//}

//Schedule the task to run every 5 minutes
cron.schedule('*/14 * * * *', () => {
    console.log('Sending keep-alive request to server...');
    keepAlive();
});

console.log('Keep-alive script started.');



const app = express()
const PORT = process.env.PORT || 8000

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//const uid = function Generateuniquid() { return ('0000' + (Math.random() * (100000 - 101) + 101) | 0).slice(-5); }



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'secretKey', resave: false, saveUninitialized: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

mongoose.set('strictQuery', false);
const connectDB = async() => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}


app.use('/public', express.static(__dirname + '/public'));

const uuidfh = customAlphabet('123456890',5);

async function uploadImageToGoogleDrive(file) {
    const bufferStream = new stream.PassThrough();
    bufferStream.end(file.buffer);
    const uuid = uuidfh() + '.jpg';
    const fileMetadata = {
        name: uuid,
        //name: file.originalname,
        parents: ["10KpoRo-jHT62ko_7BNH9khxA2S_6GY42"],
    };

    const media = {
        mimeType: file.mimetype,
        body: bufferStream
    };

    const response = await drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id,webViewLink,name'
    });

    return response.data
}


  var accountan = path.join(process.cwd(),'./ju.json')
  var accounts = JSON.parse(fs.readFileSync(accountan,'utf-8'));
  //var accounts = JSON.parse(fs.readFileSync('./data.json','utf-8'));
  
  //app.get('/detail', function(req, res, next) {
    //const data = accounts;
    //res.json(data)
  //});

const userSchema = new mongoose.Schema({
  pin: { type: String, required: true, unique: true },
  used: { type: Boolean, default: false },
  formData: { type: Object, default: null },
        Aname: {
        Name: { type: String, uppercase: true },
        Mname: { type: String, uppercase: true },
        Surname: { type: String, uppercase: true }
    },
    State: { type: String, uppercase: true },
    LocalGovt: { type: String, uppercase: true },
    Sex: { type: String, uppercase: true },
    Bloodgroup: { type: String, uppercase: true },
    Gender: { type: String, uppercase: true },
    Bloodgroup: { type: String, uppercase: true },
    PhoneNo: { type: String, uppercase: true },
    EmergencyNo: { type: String, uppercase: true },
    RegNo: { type: String, uppercase: true, unique: true },
    Validity: { type: String, uppercase: true },
    Residence: { type: String, uppercase: true },
    picturepath: { type: String },
    imgurl: { type: String },
    imgurli: { type: String },
});

const Userben = mongoose.model('Userben', userSchema);

app.get('/qr/:id', async (req, res) => {
 const {id} = req.params;
  const user = await Userben.findById(id);

  if (!user) return res.send('Invalid PIN');
  if (user.used) return res.send('This PIN has already been used.');

  req.session.userId = user._id;
  res.redirect('/form');
});

app.get('/form', (req, res) => {
  if (req.session.userId);
  res.render('index');
});

//app.post('/form', async (req, res) => {
  //const { field1, field2 } = req.body;
  //await User.findByIdAndUpdate(req.session.userId, {
   // formData: { field1, field2 },
    //used: true
  //});
  //req.session.destroy();
  //res.send('Form submitted successfully.');
//});

//UPDATE ROUT
app.post('/edit', async (req, res) => {
  const id = req.session.userId
  //const {id} = req.params;
  try{
      const Pathoo = await uploadImageToGoogleDrive(req.file);
       const imagePath = 'image/' + Pathoo.name;
       const urli =  Pathoo.webViewLink;
       const urlii =  'https://lh3.googleusercontent.com/d/' + Pathoo.id + '=s400?authuser=0'; 
    const founduser = await Userben.findById(id);
    if (!founduser){
      return res.status(404).send('no user found')
    }
    
    founduser.Aname.Name = req.body.Name,
    founduser.Aname.Mname = req.body.Mname,
    founduser.Aname.Surname = req.body.Surname,
    founduser.Gender = req.body.Sex,
    founduser.Bloodgroup= req.body.Bloodgroup,
    founduser.PhoneNumber= req.body.PhoneNo,
    founduser.EmergencyNo= req.body.EmergencyNo,
    founduser.Validity= req.body.Validity,
    founduser.State= req.body.State,
    founduser.LocalGovt= req.body.LocalGovt,
    founduser.picturepath = imagePath,
    founduser.imgurli = urlii,  
    founduser.imgurl = urli,   
    founduser.RegNo = req.body.RegNo, 
    founduser.used = true        
  
  await founduser.save();
  req.session.destroy();
  //res.redirect('/' + req.params.id)
   res.redirect(`sample.html`)
  } catch (err){
  res.status(500).send('error occured');
  }
  });

connectDB().then(() => {
   app.listen(PORT, () => {
      console.log("listening for requests");
    })
});



    //app.listen(PORT, () => {
       // console.log("listening for requests");
    //});
