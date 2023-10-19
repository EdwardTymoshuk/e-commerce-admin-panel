import Link from "next/link";
import Layout from "../../components/Layout";
import { RiAddLine, RiDeleteBin2Line, RiEditLine } from 'react-icons/ri'
import { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "../../components/Pagination";
import { BiSortDown, BiSortUp, BiSearch } from "react-icons/bi";
import { MdSearch } from "react-icons/md";
import Toggle from "../../components/Toggle";
import { toast } from "react-hot-toast";

export default function Products() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [sortDirection, setSortDirection] = useState('asc');
  const [sortColumn, setSortColumn] = useState('title');
  const [searchText, setSearchText] = useState("")
  const [searchToggle, setSearchToggle] = useState(false)
  const [toggle, setToggle] = useState(false)
  const [ deletingProductId, setdeletingProductId ] = useState('')

  const productsPerPage = 20

  useEffect(() => {
    if (!products.length) {
      axios.get('/api/products').then(res => setProducts(res.data));
    }
  }, [products])
  useEffect(() => {
    axios.get('/api/categories').then(res => setCategories(res.data))
  }, [])

  const getCategoryName = (categoryId) => {
    const category = categories.find(category => category._id === categoryId)
    return category?.name || 'Unknown';
  }

  const handleSearchTextChange = (event) => {
    setSearchText(event.target.value)
    setCurrentPage(1)
  }

  const deleteProduct = async (_id) => {
    try {
        await axios.delete(`/api/products?id=${_id}`)
        toast.success('Product was successfully deleted!')
        setProducts((prevProducts) => prevProducts.filter(product => product._id !== _id))
        setToggle(false)
    } catch (err) {
        toast.error('Oops, something went wrong: ', err)
    }
}

  const filteredProducts = products.filter((product) => {
    const productName = product.title.toLowerCase();
    const categoryName = getCategoryName(product.category).toLowerCase();
    const search = searchText.toLowerCase();
    return productName.includes(search) || categoryName.includes(search);
  })
  const startIndex = (currentPage - 1) * productsPerPage
  const endIndex = startIndex + productsPerPage

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
  }

  const handleSort = (column) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  }

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortColumn === 'category') {
      const valueA = getCategoryName(a.category)
      const valueB = getCategoryName(b.category)

      if (sortDirection === 'asc') {
        return valueA.localeCompare(valueB) || a[sortColumn].localeCompare(b[sortColumn]);
      } else {
        return valueB.localeCompare(valueA) || b[sortColumn].localeCompare(a[sortColumn]);
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

  return (
    <Layout>
      <div className="flex row justify-between items-center">
      <button>
      <Link href="products/new" className="flex items-center w-fit p-2 mb-2 gap-1 text-dark-text-color hover:text-secondary-color hover:cursor-pointer">
        <RiAddLine className="text-2xl"  />
      </Link>
      </button>
      <div className="flex flex-row-reverse gap-1">
        <input 
        className={`leading-8 border-0 border-b outline-none focus-visible:border-b border-text-color focus-visible:border-secondary-color hover:border-secondary-color placeholder:text-text-color focus-visible:placeholder:opacity-0 ${
          searchToggle ? 'search-visible sm-plus:w-full' : 'search-hidden'
        }`}
          type="text"
          placeholder="Search..."
          value={searchText}
          onChange={handleSearchTextChange}
          onBlur={() => !searchText  && setSearchToggle(false)} />
      <button 
            className={!searchToggle ? 'opacity-100 transition-opacity duration-1000 hover:text-secondary-color hover:transition-colors' : 'opacity-0'}
            onClick={() => setSearchToggle(true)
            }><MdSearch className="text-2xl" /></button>
      </div>
      </div>
      <table className="basic mt-2">
        <thead>
          <tr>
            <th className="cursor-pointer" onClick={() => handleSort('title')}>
              <div className="inline-flex items-center text-sm md:text-base">Product name {sortColumn === "title" && sortDirection === "asc" ? <BiSortDown /> : <BiSortUp />}</div>
            </th>
            <th className="cursor-pointer" onClick={() => handleSort('category')}>
              <div className="inline-flex items-center text-sm md:text-base">Category {sortColumn === "category" && sortDirection === "asc" ? <BiSortDown /> : <BiSortUp />}</div>
            </th>
            <th className="hidden md:flex"></th>
          </tr>
        </thead>
        <tbody>
          {productsToDisplay.length > 0 && productsToDisplay.map(product => (
            <tr key={product._id}>
              <td><Link className="hover:text-secondary-color transition-all duration-250" href={'/products/edit/' + product._id}>{product.title}</Link></td>
              <td className="italic opacity-50 text-xs">{categories.length > 0 && (
                getCategoryName(product.category)
              )}</td>
              <td className="flex items-center md:items-end">
                <div className="flex flex-row">
                <button className="">
                <Link className="hover:text-success-color transition-all duration-250 px-2" href={'/products/edit/' + product._id}>
                <RiEditLine size={18}/>
                </Link>
                </button>
                <button className="px-2" onClick={() => (setdeletingProductId(product._id), setToggle(true))}>
                <RiDeleteBin2Line size={18} className="hover:text-danger-color transition-all duration-250"/>
                </button>
                </div>
              </td>
            </tr>
          ))}
           {!!toggle && <Toggle deleteProduct={deleteProduct} setToggle={setToggle} productId={deletingProductId}/>}
        </tbody>
      </table>
      {totalPages !== 1 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />}
    </Layout>
  )
}