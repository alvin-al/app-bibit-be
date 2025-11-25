import z from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1, "Nama harus diisi"),
  description: z.string().optional(),
  price: z.number().min(1, "Harga harus diisi"),
  stock: z
    .number()
    .min(0, "Stok tidak boleh kurang dari 0")
    .optional()
    .default(0),
  imageUrl: z.string().optional(),
  age: z.string().nullable().optional(),
  unit: z.string().optional().default("Pcs"),
  specifications: z.record(z.string(), z.any()).nullable().optional(),
});

export const updateProductSchema = createProductSchema.partial();
