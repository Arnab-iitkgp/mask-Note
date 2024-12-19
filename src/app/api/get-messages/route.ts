import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  const user: User = session?.user;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      { status: 401 }
    );
  }

//   const userId = user._id; //it is in string will throw error in aggregation pipeline..so use below
  const userId = new mongoose.Types.ObjectId(user._id)
  // const sr = await UserModel.findOne({_id:user._id})
  // console.log(sr);
  try {
    //aggregation pipeline - lec8 -ts 29:00
    const user = await UserModel.aggregate([
         {$match:{_id:userId}},
         {$unwind : '$messages'},
         {$sort:{'messages.createdAt':-1}},
         {$group:{_id:'$_id',messages:{$push:'$messages'}}}
    ])
    if(!user ||user.length ===0){
        return Response.json(
            {
              success: false,
              message: "User not found",
            },
            { status: 401 }
          );
    }

    // chek return value of aggregation pipeline like here user-- user[0].messages give all the messages
    return Response.json(
        {
          success: true,
          messages: user[0].messages,
        },
        { status: 200 }
      );
  } catch (error) {
    return Response.json(
        {
          success: false,
          message: "Error in extracting messages",
        },
        { status: 401 }
      );
  }
}
