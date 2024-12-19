import {resend} from "@/lib/resend"

import VerificationEmail from "../../email/VerificationEmail"
import { ApiResponse } from "@/types/ApiResponse"


export async function sendVerificationEmail(email:string,username:string,verifyCode:string):Promise<ApiResponse> {
    try {
        const { data, error } = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: " SuggestMsg | Verification Code",
            react: VerificationEmail({username,otp:verifyCode}),
          });
        return{success:true,message:"verification email sent"}
        
    } catch (emailError) {
        console.error("Error sending Verification email ",emailError);
        return{success:false,message:"failed to send verification email"}
    }
}