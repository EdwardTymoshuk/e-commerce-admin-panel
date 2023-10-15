import Link from "next/link";
import Layout from "../../components/Layout";
import { RiAddLine } from 'react-icons/ri'
import { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "../../components/Pagination";
import { BiSortDown, BiSortUp, BiSearch } from "react-icons/bi";

export default function Products() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [sortDirection, setSortDirection] = useState('asc');
  const [sortColumn, setSortColumn] = useState('title');
  const [searchText, setSearchText] = useState("")
  const [searchToggle, setSearchToggle] = useState(false)

  const productsPerPage = 10

  useEffect(() => {
    axios.get('/api/products').then(res => setProducts(res.data))
  }, [])
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
      <Link href="products/new" className="flex items-center w-fit p-2 mb-2 gap-1 text-secondary-color hover:text-[#E2B43E]  hover:cursor-pointer">
        <RiAddLine size="2em" />
        Add new product
      </Link>
      <div className="flex flex-row-reverse gap-1">
        <input 
        className={`leading-8 border-0 border-b outline-none focus-visible:border-b border-text-color focus-visible:border-secondary-color hover:border-secondary-color placeholder:text-text-color focus-visible:placeholder:opacity-0 ${
          searchToggle ? 'search-visible' : 'search-hidden'
        }`}
          type="text"
          placeholder="Search..."
          value={searchText}
          onChange={handleSearchTextChange}
          onBlur={() => !searchText  && setSearchToggle(false)} />
      <button 
            className={!searchToggle ? 'opacity-100 transition-opacity duration-500 hover:text-secondary-color hover:transition-colors ' : 'opacity-0'}
            onClick={() => setSearchToggle(true)
            }><BiSearch size={24} /></button>
      </div>
      </div>
      <table className="basic mt-2">
        <thead>
          <tr>
            <th className="cursor-pointer" onClick={() => handleSort('title')}>
              <div className="inline-flex items-center">Product name {sortColumn === "title" && sortDirection === "asc" ? <BiSortDown /> : <BiSortUp />}</div>
            </th>
            <th className="cursor-pointer" onClick={() => handleSort('category')}>
              <div className="inline-flex items-center">Category {sortColumn === "category" && sortDirection === "asc" ? <BiSortDown /> : <BiSortUp />}</div>
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {productsToDisplay.length > 0 && productsToDisplay.map(product => (
            <tr key={product._id}>
              <td>{product.title}</td>
              <td className="italic">{categories.length > 0 && (
                getCategoryName(product.category)
              )}</td>
              <td>
                <Link className="btn-default" href={'/products/edit/' + product._id}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>
                  Edit
                </Link>
                <Link className="btn-red" href={'/products/delete/' + product._id}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                  Delete
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {totalPages !== 1 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />}
    </Layout>
  )
}