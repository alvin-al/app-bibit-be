import { Router } from "express";
import type { Response, Request } from "express";
import z from "zod";
import { prisma } from "../../lib/prisma.js";

const router: ReturnType<typeof Router> = Router();

//create products
export const createProducts = async (req: Request, res: Response) => {
  try {
    //create products schema
    const newProductSchema = z.object({
      name: z.string().min(1, "Nama harus diisi"),
      description: z.string(),
      price: z.number().min(1, "Harga harus diisi"),
      stock: z.number().min(0, "Stok tidak boleh kurang dari 0"),
      imageUrl: z.string().optional(),
    });

    //parsing body
    const { name, description, price, stock, imageUrl } =
      newProductSchema.parse(req.body);

    //get user id
    const userId = req.user!.userId;

    //save products to DB
    const newProducts = await prisma.product.create({
      data: {
        name: name,
        description: description,
        price: price,
        stock: stock,
        imageUrl: imageUrl ?? null,
        seller: { connect: { id: userId } },
      },
    });

    //return success to frontend
    res.status(201).json({
      message: "Create product success",
      data: newProducts,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Input tidak valid",
        errors: error,
      });
    }

    console.error("Error saat input produk baru: ", error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

//get all products
export const getMyProducts = async (req: Request, res: Response) => {
  try {
    //get user id
    const userId = req.user!.userId;
    //find product with user id
    const product = await prisma.product.findMany({
      where: { sellerId: userId },
    });
    //return to frontend
    return res.status(200).json({
      message: "Success get products",
      data: product,
    });
  } catch (error) {
    console.error("Error get all product: ", error);
    return res.status(500).json({ message: "Server error" });
  }
};
