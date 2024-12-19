import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerficationEmail";

export async function POST(request: Request) {
    await dbConnect()
    try {
     const{username,password,email}=   await request.json()
     const existingUserVerifiedByUserName =  await UserModel.findOne({
        username,
        isVerified:true
     })
     if(existingUserVerifiedByUserName){
        return Response.json({
            success:false,
            message:"Username is already taken"

        },{
            status:400
        })
     }
     const existingUserByEmail = await UserModel.findOne({
        email
     })
     const verifyCode = Math.floor(100000+Math.random()*900000).toString()
     if(existingUserByEmail){
        //true
        if(existingUserByEmail.isVerified){
            return Response.json({
                success:false,
                message:"User already exist with this email"
            },{status:400})
        }
        else{
            const hashedPassword  = await bcrypt.hash(password,10)
            existingUserByEmail.password=hashedPassword
            existingUserByEmail.verifyCode= verifyCode
            existingUserByEmail.verifyCodeExpiry = new Date(Date.now()+3600000)
            await existingUserByEmail.save()
        }
     }
     else{
        const hashedPassword = await bcrypt.hash(password,10)
        const expiryDate= new Date()
        expiryDate.setHours(expiryDate.getHours()+1)
        const newUser = new UserModel({
            username,
                email,
                password:hashedPassword,
                verifyCode,
                verifyCodeExpiry:expiryDate,
                isVerified:false,
                isAcceptingMessages:true,
                messages:[]
        })
        await newUser.save()
     }

     /// send verif email
      const emailResponse = await sendVerificationEmail(email,username,verifyCode)
      if(!emailResponse.success){
            return Response.json({
                success:false,
                message:emailResponse.message
            },{status:500})
      }
      return Response.json({
        success:true,
        message:"User Registered Succesfully. Please Verify your Email"
      },{status:201})
    } catch (error) {
        console.error("Error registering user ",error)
        return Response.json({
            success:false,
            message:"Error in registering the user "

        },{
            status:500// as per your convenience and understanding
        })
    }
}
