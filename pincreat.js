// === FILE: app.js ===
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
const { google } = require('googleapis');
const fs = require('fs');
const stream = require("stream");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'secret-key', resave: false, saveUninitialized: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// DB Connection
//mongoose.connect('mongodb://localhost:27017/pinLogin', {
  //useNewUrlParser: true,
  //useUnifiedTopology: true
//});

const oauth2Client = new google.auth.OAuth2(
    '299799989715-9j5t32aoriem1chgjkd1d91vleh9njni.apps.googleusercontent.com',
    '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',
    'https://developers.google.com/oauthplayground'
);

oauth2Client.setCredentials({ refresh_token: '1//04SleHQlO68aLCgYIARAAGAQSNwF-L9IrZKYFd3YWazjkliZA_Z3tO98_P1q76Eb-_zLAugY-fN2A6M0kHNABfJL9OEnrB90YC3c' });

const drive = google.drive({ version: 'v3', auth: oauth2Client });

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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

mongoose.set('strictQuery', false);
const connectDB = async() => {
    try {
        const conn = await mongoose.connect('mongodb+srv://Mydatabase:prototype22@database.tswsylv.mongodb.net/database?retryWrites=true&w=majority');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

connectDB();

const User = require('./models/User');

// Routes
app.get('/', (req, res) => res.redirect('/login'));

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/qr/:pin', async (req, res) => {
 const {pin} = req.params;
  const user = await User.findOne({ pin });

  if (!user) return res.send('Invalid PIN');
  if (user.used) return res.send('This PIN has already been used.');

  req.session.userId = user._id;
  res.redirect('/form');
});

app.get('/form', (req, res) => {
  if (!req.session.userId) return res.send('This PIN has already been used.');
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

// Admin route to view all PINs
app.get('/admin/pins', async (req, res) => {
  const users = await User.find();
  res.render('pins', { users });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));












