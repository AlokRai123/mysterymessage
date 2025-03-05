import {resend} from '@/lib/resend'
import VerificationEmail from '../../emails/VerificationEmail'
import { ApiResponse } from '@/types/ApiResponse'

export async function sendVerificationMail(
    email : string,
    username : string,
    verifyCode : string
) :Promise<ApiResponse>{

    try {
        await resend.emails.send({
            from: '<onboarding@resend.dev>',
            to: email,
            subject: 'Mystry message || verification',
            react : VerificationEmail({username, otp : verifyCode}),
          });
        return {success :true,message : 'Verification email send Successfully'}
    } catch (emailError) {
      console.error("Error send Verification email",emailError)
      return {success : false,message : 'Failed to send verification email'}
    }
}