import mongoose from "mongoose";

const connectDB=()=>{
    console.log('MongoDB URI:', process.env.MONGODB_URI || 'undefined');

    mongoose.connect(process.env.MONGODB_URI)
    .then(()=>{
        console.log("MongoDB Connected");
    }).catch((err)=>{
    console.log(err);
    })
}
export default connectDB;