// === FILE: app.js ===
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

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

app.post('/login', async (req, res) => {
  const { pin } = req.body;
  const user = await User.findOne({ pin });

  if (!user) return res.send('Invalid PIN');
  if (user.used) return res.send('This PIN has already been used.');

  req.session.userId = user._id;
  res.redirect('/form');
});

app.get('/form', (req, res) => {
  if (!req.session.userId) return res.redirect('/login');
  res.render('form');
});

app.post('/form', async (req, res) => {
  const { field1, field2 } = req.body;
  await User.findByIdAndUpdate(req.session.userId, {
    formData: { field1, field2 },
    used: true
  });
  req.session.destroy();
  res.send('Form submitted successfully.');
});

// Admin route to view all PINs
app.get('/admin/pins', async (req, res) => {
  const users = await User.find();
  res.render('pins', { users });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));












