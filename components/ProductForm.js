import { useEffect, useState } from "react"
import axios from "axios"
import { useRouter } from "next/router"
import { RiDeleteBin2Line, RiSave3Line, RiUpload2Line } from "react-icons/ri"
import Toggle from "./Toggle"
import toast from "react-hot-toast"
import { PuffLoader } from "react-spinners"
import { ReactSortable } from "react-sortablejs"
import { ButtonWithSpinner } from "./ButtonWithSpinner"

export default function ProductForm({
  _id,
  title: productTitle,
  description: productDescription,
  price: productPrice,
  images: productImages,
  category: productCategory,
  properties: productProperties
}) {
  const [formData, setFormData] = useState({
    title: productTitle || '',
    price: productPrice || '',
    category: productCategory || '',
  })
  const [formErrors, setFormErrors] = useState({})
  const [description, setDescription] = useState(productDescription || '')
  const [images, setImages] = useState(productImages || [])
  const [goToProducts, setGoToProducts] = useState(false)
  const [toggle, setToggle] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [categories, setCategories] = useState([])
  const [isSaving, setIsSaving] = useState(false)

  const router = useRouter()

  const productProps = []

  useEffect(() => {
    axios.get('/api/categories').then((res) => {
      setCategories(res.data)
    })
  }, [])

  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return null

  const ReactQuill = require("react-quill")
  require("react-quill/dist/quill.snow.css")

  const validateForm = () => {
    const errors = {}

    if (!formData.title) {
      errors.title = 'Product name is required.'
    } else if (formData.title.length < 3 || formData.title.length > 100) {
      errors.title = 'Product name must be between 3 and 100 characters.'
    }

    if (formData.price <= 0) {
      errors.price = 'Price must be a positive number.'
    }

    if (!formData.category) {
      errors.category = 'Category is required.'
    }

    setFormErrors(errors)

    return Object.keys(errors).length === 0
  }

  const saveProduct = async (e) => {
    e.preventDefault()
    const isFormValid = validateForm()

    if (!isFormValid) {
      return
    }

    const data = {
      title: formData.title,
      description,
      price: formData.price,
      images,
      category: formData.category,
    }

    if (_id) {
      try {
        setIsSaving(true)
        await axios.put('/api/products', { ...data, _id })
        toast.success('Product was successfully edited!')
      } catch (err) {
        toast.error('Oops, something went wrong: ', err)
      }
    } else {
      try {
        setIsSaving(true)
        await axios.post('/api/products', data)
        toast.success('New product was successfully added!')
      } catch (err) {
        toast.error('Oops, something went wrong: ', err)
      }
    }
    setIsSaving(true)
    setGoToProducts(true)
  }

  const deleteProduct = async (e) => {
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
      setImages((oldImages) => {
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
      <label htmlFor="name">Product name:</label>
      <input
        type="text"
        id="name"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        placeholder="Product name"
      />
      {formErrors.title && <div className="text-danger-color">{formErrors.title}</div>}

      <label htmlFor="price">Price in $:</label>
      <input
        type="number"
        id="price"
        value={formData.price}
        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
        placeholder="Product price"
      />
      {formErrors.price && <div className="text-danger-color">{formErrors.price}</div>}

      <label htmlFor="category">Category:</label>
      <select
        name="category"
        id="category"
        value={formData.category}
        className="h-10"
        onChange={(e) =>
          setFormData({ ...formData, category: e.target.value })
        }
      >
        <option value="">No category</option>
        {categories.length > 0 &&
          categories.map((item) => (
            <option key={item._id} value={item._id}>
              {item.name}
            </option>
          ))}
      </select>
      {formErrors.category && <div className="text-danger-color">{formErrors.category}</div>}
      
      {productProps.length > 0 &&
        productProps.map((item) => (
          <div key={item._id} className="flex gap-1">
            <label htmlFor="properties">{item.name}</label>
            <select
              id="properties"
              value={properties[item.name]}
              onChange={(e) =>
                setProductProp(item.name, e.target.value)
              }
            >
              {item.values.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
        ))}

      <label htmlFor="description">Description:</label>
      <ReactQuill
        theme="snow"
        value={description}
        onChange={setDescription}
        placeholder="Product description"
      />

      <div className="flex flex-wrap my-2 items-center">
        <ReactSortable
          list={images}
          setList={uploadImagesOrder}
          className="flex flex-wrap gap-2"
        >
          {!!images?.length &&
            images.map((link) => (
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
          <input
            id="file"
            type="file"
            multiple
            onChange={uploadImages}
            className="hidden"
          />
        </label>
      </div>

      <div className="flex justify-between py-2 max-h-fit">
        <ButtonWithSpinner
          type="submit"
          onClick={saveProduct}
          isLoading={isSaving}
          text="Save"
          size={20}
          color="#e9c46a"
          icon={<RiSave3Line />}
          className="flex flex-row items-center text-white bg-success-color hover:bg-success-lighter-color ease-in-out focus:ring-1 focus:outline-none focus:ring-secondary-color font-medium rounded-lg text-sm px-4 py-2.5 text-center"
        />
        {_id && (
          <button
            onClick={() => setToggle(true)}
            className="flex flex-row items-center text-white bg-danger-color hover:bg-danger-lighter-color ease-in-out focus:ring-1 focus:outline-none focus:ring-secondary-color font-medium rounded-lg text-sm px-4 py-2.5 text-center"
          >
            <RiDeleteBin2Line />Delete
          </button>
        )}
        {toggle && <Toggle deleteProduct={deleteProduct} setToggle={setToggle} />}
      </div>
    </>
  )
}
