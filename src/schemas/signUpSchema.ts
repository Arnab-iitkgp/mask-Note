import {z} from "zod"; 

export const userNameValidation= z.string().min(2,"must be 2 char or more")
export const signUpSchema = z.object({
    username:userNameValidation,
    email: z.string().email({message:"invalid email"}),
    password:z.string().min(6,{message:"minimum 6 character long required"})
})