import {resend} from "@/lib/resend"
import VerificationEmail from "../../emails/VerificatiomEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email : string,
    username : string,
    verifyCode : string
) : Promise<ApiResponse>{
    try{
        const { data, error } = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Mystery Message verification code',
            react : VerificationEmail({username, otp: verifyCode})
          });

        return {success : true , message : "Verification emails send successfully"} 
    }catch(emailError){
        console.error("Error sending verification emails", emailError)
        return {success : false , message : "Failed to send verification email"}
    }
}