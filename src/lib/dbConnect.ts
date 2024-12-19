import { promises } from "dns";
import mongoose from "mongoose";
type ConnectionObject = {
  isConnnected?: number;
};
const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> { /////////// doubt what void means?
  if (connection.isConnnected) {
    console.log("Already db connected");
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "", {});
    //    console.log(db);
    connection.isConnnected = db.connections[0].readyState;
    console.log("db connected");
  } catch (error) {
    console.log("connection failed ",error);
    process.exit(1);
  } 
}
export default dbConnect