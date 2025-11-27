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
  age: z.string().min(1, "Umur harap diisi"),
  unit: z.string().min(1, "Unit harap diisi"),
  varieties: z.string().min(1, "Varietas harap diisi"),
});

export const updateProductSchema = createProductSchema.partial();
