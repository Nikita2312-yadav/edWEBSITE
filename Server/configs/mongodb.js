import mongoose from "mongoose";

// Connect to the MongoDB ddatabase

const connectDB = async ()=> {
    mongoose.connection.on('connected', ()=> console.log('Database Connectesd'))
     await mongoose.connect(`${process.env.MONGODB_URI}/lms`)
}
export default connectDB;