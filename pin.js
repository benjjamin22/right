// generatePins.js
const mongoose = require('mongoose');
const { customAlphabet } = require('nanoid');
//const User = require('./models/User'); // make sure this path is correct

const nanoid = customAlphabet('1234567890', 4); // only digits, 4-digit PIN

//mongoose.connect('mongodb://localhost:27017/pinLogin', {
  //useNewUrlParser: true,
  //useUnifiedTopology: true,
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

// models/User.js
const userSchema = new mongoose.Schema({
  pin: { type: String, required: true, unique: true },
  used: { type: Boolean, default: false },
  formData: { type: Object, default: null },
});

const Userben = mongoose.model('Userben', userSchema);

async function generatePins() {
  const pins = new Set();

  // Generate 200 unique PINs
  while (pins.size < 5) {
    pins.add(nanoid());
  }

  const pinObjects = Array.from(pins).map(pin => ({ pin }));

  try {
    await Userben.insertMany(pinObjects);
    console.log('✅ 200 unique PINs generated and stored in MongoDB.');
  } catch (err) {
    console.error('❌ Error saving to DB:', err);
  } finally {
    mongoose.disconnect();
  }
}

generatePins();
connectDB();



