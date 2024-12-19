import { z } from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .min(10, { message: "must be atleast 10 char long" })
    .max(300, { message: "mudt be atmost 300 char" }),
});
