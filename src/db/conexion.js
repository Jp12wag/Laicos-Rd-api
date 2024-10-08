require('dotenv').config();
const mongoose = require('mongoose');
//MONGODB_URI
//
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.base_Uri, {
    //  useNewUrlParser: true,
      //useUnifiedTopology: true,
    });
    
    console.log('Base de datos mongoDB connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;