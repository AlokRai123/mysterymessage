import {z} from 'zod'

export const usernameValidation = z
     .string()
     .min(2,"Username must be atleast 2 character")
     .max(20,"Username must be more than 2 character")
     .regex(/^[a-zA-Z0-9_]+$/,"Username must be special character")


export const signUpSchema = z.object({
    username : usernameValidation,
    email : z.string().email({message : 'Invalid mail address'}),
    password : z.string().min(6,{message : "provide be at least 6 character"})
})