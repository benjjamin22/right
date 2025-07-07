// === FILE: generatePins.js ===
const mongoose = require('mongoose');
//const User = require('./models/User');
const { customAlphabet } = require('nanoid');

const nanoid = customAlphabet('1234567890', 4); // 4-digit numeric PIN

mongoose.set('strictQuery', false);
 mongoose.connect('mongodb+srv://Mydatabase:prototype22@database.tswsylv.mongodb.net/database?retryWrites=true&w=majority');
    //console.log(`MongoDB Connected: ${conn.connection.host}`);
 

const userSchema = new mongoose.Schema({
  pin: {
    type: String,
    unique: true,
    required: true
  },
  used: {
    type: Boolean,
    default: false
  },
  formData: {
    type: Object,
    default: null
  }
});

const User = mongoose.model('User', userSchema);


async function generatePins() {
  const pins = new Set();
  while (pins.size < 5) {
    pins.add(nanoid());
  }
  const pinArray = Array.from(pins).map(pin => ({ pin }));
  await User.insertMany(pinArray);
  console.log('200 PINs generated and saved.');
  mongoose.disconnect();
}

generatePins();