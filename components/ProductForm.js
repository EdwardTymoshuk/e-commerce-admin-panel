import { useState } from "react"
import axios from "axios"
import { useRouter } from "next/router"
import { RiDeleteBin2Line, RiSave3Line } from "react-icons/ri"
import Toggle from "./Toggle"
import toast from 'react-hot-toast'

let toastProductId

export default function ProductForm({
    _id,
    title: productTitle,
    description: productDescription,
    price: productPrice
}) {
    const [title, setTitle] = useState(productTitle || '')
    const [description, setDescription] = useState(productDescription || '')
    const [price, setPrice] = useState(productPrice || '')
    const [goToProducts, setGoToProducts] = useState(false)
    const [toggle, setToggle] = useState(false)

    const router = useRouter()

    const saveProduct = async (e) => {
        e.preventDefault()
        const data = { title, description, price }
        if (_id) {
            try {
                await axios.put('/api/products', { ...data, _id })

            } catch {

            }     
        } else {
            await axios.post('/api/products', data)
        }
        setGoToProducts(true)
    }
    
    const deleteProduct = async (e) => {
        e.preventDefault()
        try {
            await axios.delete(`/api/products?id=${_id}`)
            setGoToProducts(true)
            toast.success('Product deleted successfully', {id: toastProductId})
        } catch (err) {
            toast.error('Error deleting product:', err)
        }
    }
    !!goToProducts && router.push('/products')
    return (
        <>
            <label htmlFor="name">Product name</label>
            <input type="text" id="name" value={title} onChange={e => setTitle(e.target.value)} placeholder="Product name"></input>
            <label htmlFor="description">Description</label>
            <textarea type="text" id="description" value={description} onChange={e => setDescription(e.target.value)} placeholder="Product description"></textarea>
            <label htmlFor="price">Price in $</label>
            <input type="number" id="price" value={price} onChange={e => setPrice(e.target.value)} placeholder="Product price"></input>
            <div className="flex justify-between py-4">
                <button type="submit" onClick={saveProduct} className="flex flex-row items-center text-white bg-success-color hover:bg-secondary-color ease-in-out focus:ring-1 focus:outline-none focus:ring-secondary-color font-medium rounded-lg text-sm px-4 py-2.5 text-center cursor-pointer">
                    <RiSave3Line />Save</button>
                {_id && <button onClick={() => setToggle(true)} className="flex flex-row items-center text-white bg-danger-color hover:bg-secondary-color ease-in-out focus:ring-1 focus:outline-none focus:ring-secondary-color font-medium rounded-lg text-sm px-4 py-2.5 text-center cursor-pointer">
                    <RiDeleteBin2Line />Delete</button>}
                {toggle && <Toggle deleteProduct={deleteProduct} setToggle={setToggle} />}
            </div>
        </>
    )
}