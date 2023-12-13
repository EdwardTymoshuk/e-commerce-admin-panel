import { mongooseConnect } from "../../lib/mongoose"
import { Order } from "../../models/Order"

export default async function handler(req, res) {
  try {
    // Connect to MongoDB before processing the request
    await mongooseConnect()

    if (req.method === "GET") {
      if (req.query?.count) {
        // Retrieve the count of all products
        const count = await Order.countDocuments()
        res.json({ count })
      } else if (req.query?.successed) {
        // Fetch successful (Paid: true) orders and sort them by createdAt in descending order
        const orders = await Order.find({ paid: true }).sort({ createdAt: -1 })
        // Return the successful orders in the response
        res.json(orders)
      } else if (req.query?.failed) {
        // Fetch successful (Paid: true) orders and sort them by createdAt in descending order
        const orders = await Order.find({ paid: false }).sort({ createdAt: -1 })
        // Return the successful orders in the response
        res.json(orders)
      } else {
        // Fetch orders and sort them by createdAt in descending order
        const orders = await Order.find().sort({ createdAt: -1 })
        // Return the orders in the response
        res.json(orders)
      }
    }
  } catch (error) {
    console.error('Error processing order request:', error);
    // Return an error response with a 500 status code
    res.status(500).json({ error: 'Internal server error' })
  }
}
