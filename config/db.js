import mongoose from "mongoose";

async function dbConnect() {
  try {
    await mongoose.connect("mongodb://localhost:27017/Knowledge_Vault_DB");
    console.log("Connection successful");
  } catch (error) {
    console.error(error);
    console.log("Connection failed!!");
  }
}

dbConnect();
