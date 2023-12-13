import { Product } from "../../models/Product"
import { mongooseConnect } from "../../lib/mongoose"
import { isAdminRequest } from "./auth/[...nextauth]"

export default async function handler(req, res) {
  try {
    // Connect to MongoDB before processing the request
    await mongooseConnect()

    // Ensure that the request is coming from an admin
    await isAdminRequest(req, res)

    const { method, body, query } = req

    if (method === "POST") {
      const { title, description, price, images, category, properties } = body
      // Create a new product
      const product = await Product.create({ title, description, price, images, category, properties })
      res.json(product)
    }

    if (method === "GET") {
      if (query?.id) {
        // Retrieve a single product by ID
        const product = await Product.findOne({ _id: query.id })
        res.json(product)
      } else if (query?.count) {
        // Retrieve the count of all products
        const count = await Product.countDocuments()
        res.json({ count })
      } else {
        // Retrieve all products
        const products = await Product.find()
        res.json(products)
      }
    }

    if (method === "PUT") {
      const { title, description, price, images, _id, category, properties } = body
      // Update an existing product by ID
      await Product.updateOne({ _id }, { title, description, price, images, category, properties })
      res.json(true)
    }

    if (method === "DELETE") {
      if (query?.id) {
        // Delete a product by ID
        await Product.deleteOne({ _id: query.id })
        res.json(true)
      }
    }
  } catch (error) {
    console.error('Error processing product request:', error)
    // Return an error response with a 500 status code
    res.status(500).json({ error: 'Internal server error' })
  }
}
