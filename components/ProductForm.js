import { useState } from "react"
import axios from "axios"
import { useRouter } from "next/router"
import { RiDeleteBin2Line, RiSave3Line, RiUpload2Line } from "react-icons/ri"
import Toggle from "./Toggle"
import toast from "react-hot-toast"
import { PuffLoader } from "react-spinners"
import { ReactSortable } from "react-sortablejs"

export default function ProductForm({
    _id,
    title: productTitle,
    description: productDescription,
    price: productPrice,
    images: productImages
}) {
    const [title, setTitle] = useState(productTitle || '')
    const [description, setDescription] = useState(productDescription || '')
    const [price, setPrice] = useState(productPrice || '')
    const [images, setImages] = useState(productImages || []);
    const [goToProducts, setGoToProducts] = useState(false)
    const [toggle, setToggle] = useState(false)
    const [isUploading, setIsUploading] = useState(false);

    const router = useRouter()

    const saveProduct = async (e) => {
        e.preventDefault()
        const data = { title, description, price, images }
        if (_id) {
            try {
                await axios.put('/api/products', { ...data, _id })
                toast.success('Product was successfully edited!')
            } catch (err) {
                toast.error('Oops, something went wrong: ', err)
            }
        } else {
            try {
                await axios.post('/api/products', data)
                toast.success('New product was successfully added!')
            } catch (err) {
                toast.error('Oops, something went wrong: ', err)
            }
        }
        setGoToProducts(true)
    }

    const deleteProduct = async (e) => {
        e.preventDefault()
        try {
            await axios.delete(`/api/products?id=${_id}`)
            setGoToProducts(true)
            toast.success('Product was successfully deleted!')
        } catch (err) {
            toast.error('Oops, something went wrong: ', err)
        }
    }
    !!goToProducts && router.push('/products')

    const uploadImages = async (e) => {
        const files = e.target?.files
        if (files?.length > 0) {
            setIsUploading(true)
            const data = new FormData()
            for (const file of files) {
                data.append('file', file)
            }
            const res = await axios.post('/api/upload', data)
            setImages(oldImages => {
                return [...oldImages, ...res.data.links]
            })
            setIsUploading(false)
        }
    }

    const uploadImagesOrder = (images) => {
        setImages(images)
    }
    return (
        <>
            <label htmlFor="name">Product name</label>
            <input type="text" id="name" value={title} onChange={e => setTitle(e.target.value)} placeholder="Product name"></input>
            <label htmlFor="file">Images</label>
            <div className="flex flex-wrap gap-2 items-center">
                <ReactSortable list={images} setList={uploadImagesOrder} className="flex flex-wrap gap-2">
                    {!!images?.length && images.map(link => (
                        <div key={link}>
                            <img src={link} className="h-24" />
                        </div>
                    ))}
                </ReactSortable>
                {isUploading && (
                    <div className="h-24 flex items-center">
                        <PuffLoader color="var(--color-secondary)" />
                    </div>
                )}
                <label className="flex justify-center items-center text-md flex-col w-24 h-24 bg-gray-300 text-gray-400 text-center cursor-pointer">
                    <RiUpload2Line size="24pt" />
                    <div>Upload</div>
                    <input id="file" type="file" multiple onChange={uploadImages} className="hidden" />
                </label>
            </div>
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