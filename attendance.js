const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: { type: Date, default: () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }},
  timeIn: Date,
  timeOut: Date,
});

attendanceSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);

app.get('/scan/:userId', async (req, res) => {
  const userId = req.params.userId;
  const now = new Date();

  // Set today's date at midnight (for filtering)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Look for today’s attendance
  let attendance = await Attendance.findOne({ user: userId, date: today });

  if (!attendance) {
    // ✅ No record today → mark entry
    await Attendance.create({
      user: userId,
      date: today,
      timeIn: now
    });
    return res.send(`✅ Entry recorded at ${now.toLocaleTimeString()}`);
  }

  // If already exited → block until next day
  if (attendance.timeOut) {
    return res.send('⛔ Entry and exit already recorded today. Come back tomorrow.');
  }

  // ✅ Exit allowed
  attendance.timeOut = now;
  await attendance.save();
  res.send(`✅ Exit recorded at ${now.toLocaleTimeString()}`);
});

// app.js
const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User');
const app = express();

mongoose.connect('mongodb://localhost:27017/your_db_name', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use(express.urlencoded({ extended: true }));

// Show user list
app.get('/', async (req, res) => {
  const users = await User.find();
  res.render('index', { users });
});

// Delete route
app.post('/delete-user', async (req, res) => {
  const userId = req.body.id;
  try {
    await User.findByIdAndDelete(userId);
    res.redirect('/');
  } catch (error) {
    res.status(500).send('Error deleting user');
  }
});

app.set('view engine', 'ejs');
app.listen(3000, () => console.log('Server running on http://localhost:3000'));


//<!-- views/index.ejs -->
//<% users.forEach(user => { %>
  //<form action="/delete-user" method="POST">
    //<input type="hidden" name="id" value="<%= user._id %>">
    //</input><p><%= user.name %> - <%= user.email %></p>
    //<button type="submit">Delete</button>
  //</form>
//<% }) %>


// === FILE: generatePins.js ===
const mongoose = require('mongoose');
const User = require('./models/User');
const { customAlphabet } = require('nanoid');

const nanoid = customAlphabet('1234567890', 4); // 4-digit numeric PIN

mongoose.connect('mongodb://localhost:27017/pinLogin');

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

async function generatePins() {
  const pins = new Set();
  while (pins.size < 200) {
    pins.add(nanoid());
  }
  const pinArray = Array.from(pins).map(pin => ({ pin }));
  await User.insertMany(pinArray);
  console.log('200 PINs generated and saved.');
  mongoose.disconnect();
}

generatePins();




