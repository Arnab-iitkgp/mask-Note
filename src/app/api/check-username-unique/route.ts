 import dbConnect from "@/lib/dbConnect";
 import UserModel from "@/model/User";
 import {z} from "zod"
 import { userNameValidation } from "@/schemas/signUpSchema";

 const UserQuerySchema = z.object({
    username:userNameValidation
 })

 export async function GET(request:Request) {
    //important check for production
    // if(request.method !=='GET'){
    //     return Response.json({
    //         success:false,
    //         message:"Method not allowed"
    //     },{status:503})
    // } //NO NEED in new version of NEXTJS
    console.log("connecting");
    await dbConnect();
    try {
        const {searchParams}= new URL(request.url)
        console.log('the searchparam : ',searchParams.get('username'));
        // the qp below here is not a variable but an OBJECT -> thats how it works KEEP IN MIND
        const queryParam = {
            username:searchParams.get('username')
        }
        console.log(queryParam)
        ;
        //validation with ZOD
        const result = UserQuerySchema.safeParse(queryParam);
        console.log(result); ///MUST CHECK 
        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || []/// very important as errors may contain all other errors but we want only those username errors
            return Response.json({
                success:false,
                message:"Invalid Query Parameters",
                errors: result.error.format()
            },{status:400})
        }

        const {username} = result.data // by obs in result console.log(result)

       const existingVerifiedUser = await UserModel.findOne({username,isVerified:true})
       if(existingVerifiedUser)return Response.json({
        success:false,
        message:"Username is already taken"
    },{status:400})

    return Response.json({
        success:true,
        message:"username is unique"
    },{status:200})

    } catch (error) {
        console.error("Error in username checking ", error)
        return Response.json({
            success:false,
            message:"error checking username"
        },{status:500})
    }
 }