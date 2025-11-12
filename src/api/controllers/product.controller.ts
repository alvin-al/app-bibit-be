import { Router } from "express";
import type { Response, Request } from "express";
import z from "zod";
import { prisma } from "../../lib/prisma.js";
import {
  createProductSchema,
  updateProductSchema,
} from "../schema/product.schema.js";

const router: ReturnType<typeof Router> = Router();

//create products
export const createProducts = async (req: Request, res: Response) => {
  try {
    //parsing body
    const { name, description, price, stock, imageUrl } =
      createProductSchema.parse(req.body);

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
        message: "Input not valid",
        errors: error,
      });
    }

    console.error("Error while adding new product: ", error);
    return res.status(500).json({ message: "An error occurred on the server" });
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

//get one products
export const getSelectedProduct = async (req: Request, res: Response) => {
  try {
    //get user id
    const userId = req.user!.userId;
    const { id: productId } = req.params;

    //find product with user id
    const product = await prisma.product.findFirst({
      where: { sellerId: userId, id: productId! },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    //return to frontend
    return res.status(200).json({
      message: "Success get products",
      data: product,
    });
  } catch (error) {
    console.error("Error get selected product: ", error);
    return res.status(500).json({ message: "Server error" });
  }
};

//update products
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const validatedData = updateProductSchema.parse(req.body);

    //get product & user id
    const { id: productId } = req.params;
    const userId = req.user?.userId;

    //find id product & id seller
    const product = await prisma.product.findFirst({
      where: { id: productId!, sellerId: userId! },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    //Delete undefined data
    const cleanData = Object.fromEntries(
      Object.entries(validatedData).filter(([_, value]) => value !== undefined)
    );

    //replace old data
    const updatedDataProduct = await prisma.product.update({
      where: { id: product.id },
      data: cleanData,
    });

    return res.status(200).json({
      message: "Edit data success",
      data: updatedDataProduct,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Data not valid",
        errors: error,
      });
    }

    console.error("Error editing product: ", error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

//delete products
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    //get id & user product
    const user = req.user!.userId;
    const { id: productId } = req.params;

    //find product
    const selectedProduct = await prisma.product.findFirst({
      where: { id: productId!, sellerId: user },
    });

    if (!selectedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    //delete product
    const deleteSelectedProduct = await prisma.product.delete({
      where: { id: selectedProduct.id },
    });

    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting product: ", error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};
