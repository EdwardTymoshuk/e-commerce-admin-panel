import { Product } from "../../models/product";
import { mongooseConnect } from "../../lib/mongoose";

export default async function handler(req, res) {
    await mongooseConnect()
    const { method, body, query } = req

    if (method === "POST") {
        const { title, description, price, images } = body
        const product = await Product.create({ title, description, price, images })
        res.json(product)
    }

    if (method === "GET") {
        if (query?.id) {
            res.json(await Product.findOne({ _id: query.id }))
        } else {
            res.json(await Product.find())
        }
    }

    if (method === "PUT") {
        const { title, description, price, images, _id } = body
        await Product.updateOne({ _id }, { title, description, price, images })
        res.json(true)
    }
    if (method === "DELETE") {
        if (query?.id) {
            try {
                await Product.deleteOne({ _id: query.id })
                res.json(true)
            } catch (err) {
                console.error('Error whilist deleting product:', err);
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }
}