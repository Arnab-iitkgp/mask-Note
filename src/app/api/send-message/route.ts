import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";

export async function POST(request:Request) {
    await dbConnect();
    const {username,content} = await request.json()
    try {
        const user = await UserModel.findOne({username})
        if(!user){
            return Response.json(
                {
                  success: false,
                  message: "user not found",
                },
                { status: 404 }
              );
        }
        
        if(!user.isAcceptingMessages){
            return Response.json(
                {
                  success: false,
                  message: "user is not accepting messages",
                },
                { status: 403 }
              );
        }
    const newMessage = {content,createdAt:new Date()}
    user.messages.push(newMessage as Message)
    await user.save();
     return Response.json(
        {
          success: 'true',
          message: "Message sent succesfully",
        },
        { status: 200 }
      );
    } catch (error) {
        console.log("Error sending messages ",error)
        return Response.json(
            {
              success: false,
              message: "Error in sending message",
            },
            { status: 401 }
          );
    }
}