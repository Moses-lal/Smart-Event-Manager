import mongoose from "mongoose";



const connectdb = async () => {
    try {
       const result = await mongoose.connect(process.env.MONGO_URI) 
       console.log("mongodb is connected on ", result.connection.host)

    } catch (error) {
        console.log("mongo DB Connection error ",error);
        process.exit(1);
    }
}


export default connectdb;