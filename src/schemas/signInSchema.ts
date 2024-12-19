import {z} from "zod"; 

export const signInSchemaa=z.object({
  identifier:z.string(),
  password:z.string()
})