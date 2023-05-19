import { useState } from "react"
import Layout from "../../components/Layout"
import axios from "axios"

export default function NewProduct() {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState('')

    const addProduct = async (e) => {
        e.preventDefault()
        const data = {title, description, price}
        await axios.post('/api/products', data)
    }

    return (
        <Layout>
            <form onSubmit={addProduct}>
            <label htmlFor="name">Product name</label>
            <input type="text" id="name" value={title} onChange={e => setTitle(e.target.value)} placeholder="Product name"></input>
            <label htmlFor="description">Description</label>
            <textarea type="text" id="description" value={description} onChange={e => setDescription(e.target.value)} placeholder="Product description"></textarea>
            <label htmlFor="price">Price in $</label>
            <input type="number" id="price" value={price} onChange={e => setPrice(e.target.value)} placeholder="Product price"></input>
            <button type="submit" className="bg-success-color py-2 px-6 mt-2 rounded-md">Save</button>
            </form>
        </Layout>
    )
}