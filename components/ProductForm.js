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
    title: productTitle || '',           // Product title
    price: productPrice || '',           // Product price
    category: productCategory || '',     // Product category
    properties: productProperties || [], // Product properties
    description: productDescription || '',// Product description
    images: productImages || [],         // Product images
  })
  const [formErrors, setFormErrors] = useState({})   // Form validation errors
  const [goToProducts, setGoToProducts] = useState(false)   // Flag to redirect to products
  const [toggle, setToggle] = useState(false)   // Toggle for deletion confirmation
  const [isUploading, setIsUploading] = useState(false)   // Flag for image uploading
  const [categories, setCategories] = useState([])   // List of categories
  const [isSaving, setIsSaving] = useState(false)   // Flag for saving/loading state
  const [isClient, setIsClient] = useState(false)   // Flag to check if on client side

  const { title, price, category, properties, description, images } = formData

  const router = useRouter()

  // Handle category change with error handling
  const handleCategoryChange = (categoryId) => {
    try {
      if (categoryId) {
        axios.get(`/api/categories/?id=${categoryId}`).then((res) => {
          // Update form data with selected category and its properties
          setFormData({
            ...formData,
            category: categoryId,
            properties: res.data.properties
          })
        })
      } else {
        // Reset form data if no category selected
        setFormData({
          ...formData,
          category: '',
          properties: [],
        })
      } 
    } catch (error) {
      console.error("An error occurred while fetching data:", error)
    }
  }

  // Fetch categories on component mount
  useEffect(() => {
    axios.get('/api/categories').then((res) => {
      setCategories(res.data);
  
      // Set form data based on product category and properties
      const selectedCategory = res.data.find(category => category._id === productCategory)
      const properties = selectedCategory ? selectedCategory.properties : []
      setFormData((prevFormData) => ({
        ...prevFormData,
        category: productCategory,
        properties: productProperties || properties || [],
      }))
    })
  }, [productCategory, productProperties])

  // Set client state to true on component mount
  useEffect(() => {
    setIsClient(true)
  }, [])

  // If not a client, return null
  if (!isClient) return null

  const ReactQuill = require("react-quill")
  require("react-quill/dist/quill.snow.css")

  // Validate form input
  const validateForm = () => {
    const errors = {}

    if (!title) {
      errors.title = 'Product name is required.'
    } else if (title.length < 3 || title.length > 100) {
      errors.title = 'Product name must be between 3 and 100 characters.'
    }

    if (price <= 0) {
      errors.price = 'Price must be a positive number.'
    }

    if (!category) {
      errors.category = 'Category is required.'
    }

    setFormErrors(errors)

    return Object.keys(errors).length === 0
  }

  // Save or update product
  const saveProduct = async (e) => {
    e.preventDefault()
    const isFormValid = validateForm()

    if (!isFormValid) {
      return
    }
    const data = {
      title,
      description,
      price,
      images,
      category,
      properties
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

  // Delete product
  const deleteProduct = async (e) => {
    try {
      await axios.delete(`/api/products?id=${_id}`)
      setGoToProducts(true)
      toast.success('Product was successfully deleted!')
    } catch (err) {
      toast.error('Oops, something went wrong: ', err)
    }
  }

  // Redirect to products if go-to-products is true
  goToProducts && router.push('/products')

  // Upload images
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

  // Update order of uploaded images
  const uploadImagesOrder = (newImages) => {
    setFormData({ ...formData, images: newImages })
  }

  // Update property value
  const updateProperty = (propertyName, value) => {
    setFormData((prevFormData) => {
      const updatedProperties = prevFormData.properties.map((property) => {
        if (property.name === propertyName) {
          return { ...property, value }
        }
        return property
      })
  
      return {
        ...prevFormData,
        properties: updatedProperties,
      }
    })
  }

  return (
    <>
      <label htmlFor="name">Product name:</label>
      <input
        type="text"
        id="name"
        value={title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        placeholder="Product name"
      />
      {formErrors.title && <div className="text-danger-color">{formErrors.title}</div>}

      <label htmlFor="price">Price in $:</label>
      <input
        type="number"
        id="price"
        value={price}
        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
        placeholder="Product price"
      />
      {formErrors.price && <div className="text-danger-color">{formErrors.price}</div>}

      <label htmlFor="category">Category:</label>
      <select
        name="category"
        id="category"
        value={category}
        className="h-10"
        onChange={(e) =>
          handleCategoryChange(e.target.value)
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
      {properties.length > 0 &&
  properties.map((item) => (
    <div key={item._id} className="flex gap-1">
      <label htmlFor={item.name}>{item.name}</label>
      <select
        id={item.name}
        value={item.value}
        onChange={(e) => updateProperty(item.name, e.target.value)}
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
        onChange={(value) => setFormData({ ...formData, description: value })}
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
          className="bg-success-color hover:bg-success-lighter-color"
        />
        {_id && (
          <button
            onClick={() => setToggle(true)}
            className="bg-danger-color hover:bg-danger-lighter-color"
          >
            <RiDeleteBin2Line />Delete
          </button>
        )}
        {toggle && <Toggle deleteItem={deleteProduct} setToggle={setToggle} itemId={_id} />}
      </div>
    </>
  )
}
