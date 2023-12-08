import { mongooseConnect } from "../../lib/mongoose"
import { Order } from "../../models/Order"

export default async function handler(req, res) {
  try {
    // Connect to MongoDB before processing the request
    await mongooseConnect()

    // Fetch orders and sort them by createdAt in descending order
    const orders = await Order.find().sort({ createdAt: -1 })

    // Return the orders in the response
    res.json(orders)
  } catch (error) {
    console.error('Error while fetching orders:', error)
    // Return an error response with a 500 status code
    res.status(500).json({ error: 'Internal server error' })
  }
}