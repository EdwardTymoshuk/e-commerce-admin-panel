import { mongooseConnect } from "../../lib/mongoose"
import { Category } from "../../models/Category"

export default async function handler(req, res) {
    await mongooseConnect()
    const { method, body, query } = req

    if(method === 'GET') {
        try {
            const categories = await Category.find().populate('parentCategory');
            res.status(200).json(categories);
        } catch (err) {
            console.error('Error whilist getting categories:', err)
            res.status(500).json({ err: 'Internal server error' })
        }
    }

    if (method === 'POST') {
        const { name, parentCategory, properties} = body
        try {
            const category = await Category.create({ name, parentCategory, properties })
            res.status(200).json(`Category was successfuly added.`, category) 
        } catch (err) {
            console.error('Error whilist adding a new category:', err)
            res.status(500).json({ err: 'Internal server error' })
        }

    }

    if (method === 'PUT') {
        const { name, parentCategory, properties, _id} = body
        try {
            const category = await Category.updateOne({_id}, { name, parentCategory, properties })
            res.status(200).json(`Category was successfuly edited.`, category) 
        } catch (err) {
            console.error('Error whilist editing a new category:', err)
            res.status(500).json({ err: 'Internal server error' })
        }

    }

    if(method === 'DELETE') {
        try {
            const category = await Category.deleteOne({_id: query._id})
            res.status(200).json(category);
        } catch (err) {
            console.error('Error whilist getting categories:', err)
            res.status(500).json({ err: 'Internal server error' })
        }
    }
}
