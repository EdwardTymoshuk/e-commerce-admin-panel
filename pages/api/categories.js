import { mongooseConnect } from "../../lib/mongoose"
import { Category } from "../../models/Category"
import { isAdminRequest } from "./auth/[...nextauth]"

export default async function handler(req, res) {
  // Connect to MongoDB before processing the request
  await mongooseConnect()
  
  // Ensure that the request is coming from an admin
  await isAdminRequest(req, res)

  const { method, body, query } = req

  if (method === "GET") {
    try {
      if (query.id) {
        // Retrieve a single category by ID and populate the "parentCategory" field
        const categoryId = query.id
        const category = await Category.findById(categoryId).populate("parentCategory")
        res.status(200).json(category)
      } else {
        // Retrieve all categories and populate the "parentCategory" field
        const categories = await Category.find().populate("parentCategory")
        res.status(200).json(categories)
      }
    } catch (err) {
      console.error("Error while getting categories:", err)
      res.status(500).json({ error: "Internal server error" })
    }
  }

  if (method === "POST") {
    const { name, parentCategory, properties } = body
    try {
      // Create a new category
      const category = await Category.create({ name, parentCategory, properties })
      res.status(200).json({ message: "Category was successfully added.", category })
    } catch (err) {
      console.error("Error while adding a new category:", err)
      res.status(500).json({ error: "Internal server error" })
    }
  }

  if (method === "PUT") {
    const { name, parentCategory, properties, _id } = body
    try {
      // Update an existing category by ID
      const category = await Category.updateOne({ _id }, { name, parentCategory, properties })
      res.status(200).json({ message: "Category was successfully edited.", category })
    } catch (err) {
      console.error("Error while editing a category:", err)
      res.status(500).json({ error: "Internal server error" })
    }
  }

  if (method === "DELETE") {
    try {
      // Delete a category by ID
      const category = await Category.deleteOne({ _id: query._id })
      res.status(200).json(category)
    } catch (err) {
      console.error("Error while deleting a category:", err)
      res.status(500).json({ error: "Internal server error" })
    }
  }
}