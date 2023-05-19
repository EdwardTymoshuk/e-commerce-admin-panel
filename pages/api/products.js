import { Product } from "../../models/product";
import { mongooseConnect } from "../../lib/mongoose";

export default async function handler(req, res) {
    await mongooseConnect()
    if (req.method === "POST") {
         const {title, description, price} = req.body
         const product = await Product.create({title, description, price})
         res.json(product)
    }
}