import Link from "next/link"
import Layout from "../../components/Layout"
import { RiAddLine, RiDeleteBin2Line, RiEditLine } from 'react-icons/ri'
import { useEffect, useState } from "react"
import axios from "axios"
import Pagination from "../../components/Pagination"
import { BiSortDown, BiSortUp, BiSearch } from "react-icons/bi"
import { MdSearch } from "react-icons/md"
import Toggle from "../../components/Toggle"
import { toast } from "react-hot-toast"
import { useSpinner } from "../../context/SpinnerContext"
import { LoadingSpinner, CircleSpinner } from "../../components/Spinner"
import { useRouter } from "next/router"
import ButtonWithSpinner from "../../components/ButtonWithSpinner"
import PageHeader from "../../components/PageHeader"

// Products component
const Products = () => {
  // State variables
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [sortDirection, setSortDirection] = useState('asc')
  const [sortColumn, setSortColumn] = useState('title')
  const [searchText, setSearchText] = useState("")
  const [searchToggle, setSearchToggle] = useState(false)
  const [toggle, setToggle] = useState(false)
  const [deletingProductId, setdeletingProductId] = useState('')
  const [isAddingProduct, setIsAddingProduct] = useState(false)
  const [editingProductId, setEditingProductId] = useState(null)

  const router = useRouter()

  const productsPerPage = 20

  // Spinner context
  const { isLoading, showSpinner, hideSpinner } = useSpinner()

  // Fetch products and categories data from the server when the component mounts
  useEffect(() => {
    showSpinner()
    // Fetch products
    axios.get('/api/products')
      .then((res) => {
        setProducts(res.data)
      })
      .catch((error) => {
        console.error(error)
      })
      .finally(() => {
        hideSpinner()
      })

    // Fetch categories
    axios.get('/api/categories')
      .then((res) => {
        setCategories(res.data)
      })
      .catch((error) => {
        console.error(error)
      })
  }, [])

  // Helper function to get category name based on category ID
  const getCategoryName = (categoryId) => {
    const category = categories.find(category => category._id === categoryId)
    return category?.name || 'Unknown'
  }

  // Handle navigation to the "Add Product" page
  const handleAddProduct = async () => {
    setIsAddingProduct(true)
    try {
      await router.push('/products/new')
    } catch (error) {
      console.error(error)
    } finally {
      setIsAddingProduct(false)
    }
  }

  // Handle navigation to the "Edit Product" page
  const handleEditProduct = async (productId) => {
    setEditingProductId(productId)
    try {
      await router.push(`/products/edit/${productId}`)
    } catch (error) {
      console.error(error)
    } finally {
      setEditingProductId(null)
    }
  }

  // Handle search input change
  const handleSearchTextChange = (e) => {
    setSearchText(e.target.value)
    setCurrentPage(1)
  }

  // Handle product deletion
  const deleteProduct = async (_id) => {
    try {
      await axios.delete(`/api/products?id=${_id}`)
      toast.success('Product was successfully deleted!')
      const isLastOnPage = (productsToDisplay.length === 1)
      if (isLastOnPage && currentPage > 1) {
        setCurrentPage((prevPage) => prevPage - 1)
      }
      setProducts((prevProducts) => prevProducts.filter(product => product._id !== _id))
      setToggle(false)
    } catch (err) {
      toast.error('Oops, something went wrong: ', err)
    }
  }

  // Filter products based on search criteria
  const filteredProducts = products?.filter((product) => {
    const productName = product.title.toLowerCase()
    const categoryName = getCategoryName(product.category).toLowerCase()
    const search = searchText.toLowerCase()
    return productName.includes(search) || categoryName.includes(search)
  })

  const startIndex = (currentPage - 1) * productsPerPage
  const endIndex = startIndex + productsPerPage

  // Handle pagination
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
  }

  // Handle sorting of columns
  const handleSort = (column) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  // Sort products based on the selected column
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortColumn === 'category') {
      const valueA = getCategoryName(a.category)
      const valueB = getCategoryName(b.category)

      if (sortDirection === 'asc') {
        return valueA.localeCompare(valueB) || a[sortColumn].localeCompare(b[sortColumn])
      } else {
        return valueB.localeCompare(valueA) || b[sortColumn].localeCompare(a[sortColumn])
      }
    } else {
      const valueA = a[sortColumn]
      const valueB = b[sortColumn]

      if (sortDirection === 'asc') {
        return valueA > valueB ? 1 : -1
      } else {
        return valueA < valueB ? 1 : -1
      }
    }
  })

  const productsToDisplay = sortedProducts.slice(startIndex, endIndex)
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage)

  // Render component
  return (
    <Layout>
      <PageHeader>Products</PageHeader>
      {/* Header section */}
      <header className="flex row justify-between items-center">
        {/* Add Product button */}
        <div className="flex flex-row min-h-[34px]">
          <button onClick={handleAddProduct} disabled={isAddingProduct} className="btn-no-bg btn-dark-text">
            <Link href="products/new" className="">
              {isAddingProduct ? <CircleSpinner size={24} color="#e9c46a" /> : <RiAddLine className="text-2xl" />}
            </Link>
          </button>
        </div>

        {/* Search input and icon */}
        <div className="flex flex-row-reverse gap-1">
          <input
            className={`leading-8 border-0 border-b outline-none focus-visible:border-b border-dark-text-color focus-visible:border-secondary-color hover:border-secondary-color placeholder:text-text-color focus-visible:placeholder:opacity-0 ${searchToggle ? 'search-visible sm-plus:w-full' : 'search-hidden'
              }`}
            type="text"
            placeholder="Search..."
            value={searchText}
            onChange={handleSearchTextChange}
            onBlur={() => !searchText && setSearchToggle(false)} />
          <button
            className={!searchToggle ? 'btn-no-bg btn-dark-text opacity-100' : 'opacity-0'}
            onClick={() => setSearchToggle(true)
            }><MdSearch className="text-2xl" /></button>
        </div>
      </header>

      {/* Loading spinner */}
      {isLoading && <LoadingSpinner />}

      {/* Products table */}
      <table className="basic mt-2">
        <thead>
          <tr>
            {/* Product name column */}
            <th className="cursor-pointer" onClick={() => handleSort('title')}>
              <div className="inline-flex items-center text-sm md:text-base">Product name {sortColumn === "title" && sortDirection === "asc" ? <BiSortDown /> : <BiSortUp />}</div>
            </th>

            {/* Category column */}
            <th className="cursor-pointer" onClick={() => handleSort('category')}>
              <div className="inline-flex items-center text-sm md:text-base">Category {sortColumn === "category" && sortDirection === "asc" ? <BiSortDown /> : <BiSortUp />}</div>
            </th>

            {/* Actions column */}
            <th className="hidden md:flex"></th>
          </tr>
        </thead>
        <tbody>
          {/* Render each product row */}
          {productsToDisplay.length > 0 && productsToDisplay.map(product => (
            <tr key={product._id}>
              {/* Product name */}
              <td><Link className="hover:text-secondary-color transition-all duration-250" href={'/products/edit/' + product._id}>{product.title}</Link></td>

              {/* Category */}
              <td className="italic opacity-50 text-xs">
                {categories.length > 0 && (
                  getCategoryName(product.category)
                )}
              </td>

              {/* Actions */}
              <td className="flex items-center md:items-end">
                <div className="flex flex-row">
                  {/* Edit Product button */}
                  <ButtonWithSpinner
                    className="btn-no-bg btn-dark-text hover:text-success-color duration-250"
                    isLoading={editingProductId === product._id}
                    onClick={() => handleEditProduct(product._id)}
                    icon={<RiEditLine size={18} />}
                    size={16}
                    color={"#2A9D8F"}
                    text=""
                  />

                  {/* Delete Product button */}
                  <button className="btn-no-bg btn-dark-text hover:text-danger-color duration-250" onClick={() => (setdeletingProductId(product._id), setToggle(true))}>
                    <RiDeleteBin2Line size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}

          {/* Toggle for confirming product deletion */}
          {!!toggle && <Toggle deleteItem={deleteProduct} setToggle={setToggle} itemId={deletingProductId} />}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages !== 1 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />}
    </Layout>
  )
}

export default Products