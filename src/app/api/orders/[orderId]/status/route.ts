import z from "zod";

const updateStatusSchemas = z.object({
  status: z.enum([
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ]),
});
