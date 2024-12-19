import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request:Request) {
    await dbConnect();
    try {
        const {username,code}= await request.json()
        const decodedUsername = decodeURIComponent(username)
        const user = await UserModel.findOne({username:decodedUsername})

        if(!user){
            return Response.json({
                success:false,
                message:"no user found"
            },{status:500})
        }

      const  isCodeVerified = user.verifyCode ===code
      const isCodeNotExpired = new Date(user.verifyCodeExpiry)>new Date()

      if(isCodeNotExpired && isCodeVerified){
        user.isVerified = true,
        await user.save()
        return Response.json({
            success:true,
            message:"verification Successfull"
        },{status:200})
      }
      else if(!isCodeNotExpired){
        return Response.json({
            success:false,
            message:"Verification code Expired, Please signup again to get a new code"
        },{status:400})
      }
      else {
        return Response.json({
            success:false,
            message:"code is incorrect"
        },{status:400})
      }
    } catch (error) {
        console.error("Error verifyng User ",error)
        return Response.json({
            success:false,
            message:"Error verifying user"
        },{status:500})
    }
}