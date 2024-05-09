import axios from "axios"
import { useEffect, useState } from "react"
import { BiSortDown, BiSortUp } from "react-icons/bi"
import Layout from "../../components/Layout"
import PageHeader from "../../components/PageHeader"
import Pagination from "../../components/Pagination"
import { LoadingSpinner } from "../../components/Spinner"
import { useSpinner } from "../../context/SpinnerContext"

// Define status filter buttons
const filterButtons = [
  { name: "all", label: "All" },
  { name: "success", label: "Successed" },
  { name: "failed", label: "Failed" },
]

// OrdersPage component
const OrdersPage = () => {
  // State variables
  const [orders, setOrders] = useState([])
  const [sortDirection, setSortDirection] = useState('desc')
  const [sortColumn, setSortColumn] = useState('createdAt')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const ordersPerPage = 10

  // Spinner context
  const { isLoading, showSpinner, hideSpinner } = useSpinner()

  // Fetch orders data from an API on component mount
  useEffect(() => {
    showSpinner()
    axios.get('/api/orders')
      .then(res => {
        setOrders(res.data)
      })
      .catch((error) => {
        console.error(error)
      })
      .finally(() => {
        hideSpinner()
      })
  }, [])

  // Handle sorting of columns
  const handleSort = (column) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  // Handle filtering by status
  const handleStatusFilter = (status) => {
    setSelectedStatus(status)
    setCurrentPage(1)
  }

  // Sort and filter orders
  const sortedOrders = [...orders].sort((a, b) => {
    const valueA = a[sortColumn]
    const valueB = b[sortColumn]

    if (sortColumn === 'total') {
      const numA = parseFloat(a.line_items?.reduce((acc, item) => acc + (item.price_data.unit_amount / 100 * item.quantity), 0))
      const numB = parseFloat(b.line_items?.reduce((acc, item) => acc + (item.price_data.unit_amount / 100 * item.quantity), 0))

      if (sortDirection === 'asc') {
        return numA > numB ? 1 : -1
      } else {
        return numA < numB ? 1 : -1
      }
    } else {
      if (sortDirection === 'asc') {
        return valueA > valueB ? 1 : -1
      } else {
        return valueA < valueB ? 1 : -1
      }
    }
  })

  const filteredOrders = sortedOrders.filter((order) => {
    if (selectedStatus === 'all') {
      return true
    }
    return (
      order.paid === (selectedStatus === 'success')
    )
  })

  // Pagination
  const startIndex = (currentPage - 1) * ordersPerPage
  const endIndex = startIndex + ordersPerPage
  const ordersToDisplay = filteredOrders.slice(startIndex, endIndex)
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage)

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
  }

  // Render component
  return (
    <Layout>
      <PageHeader>Orders</PageHeader>
      {/* Status filter buttons */}
      <div className="flex flex-row justify-center md:justify-start gap-2 w-full py-2">
        {filterButtons.map(({ name, label }) => (
          <button
            key={name}
            onClick={() => handleStatusFilter(name)}
            className={`btn-no-bg status-filter-button
              text-${name === 'success' ? 'success' : name === 'failed' ? 'danger' : 'dark-text'}-color 
              hover:text-${name === 'success' ? 'success-lighter' : name === 'failed' ? 'danger-lighter' : 'dark-text'}-color
              ${selectedStatus === `${name}` ? 'selected' : ''}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Orders table */}
      {isLoading && <LoadingSpinner />}
      <table className="basic text-left table-auto w-full break-words">
        <thead>
          <tr>
            <th className="cursor-pointer" onClick={() => handleSort('createdAt')}>
              <div className="inline-flex items-center">Date {sortColumn === "createdAt" && sortDirection === "asc" ? <BiSortDown /> : <BiSortUp />}</div>
            </th>
            <th className="cursor-pointer" onClick={() => handleSort('paid')}>
              <div className="inline-flex items-center">Status {sortColumn === "paid" && sortDirection === "asc" ? <BiSortDown /> : <BiSortUp />}</div>
            </th>
            <th>Recipient</th>
            <th>Products</th>
            <th>Quantity</th>
            <th className="cursor-pointer" onClick={() => handleSort('total')}>
              <div className="inline-flex items-center">Total {sortColumn === "total" && sortDirection === "asc" ? <BiSortDown /> : <BiSortUp />}</div>
            </th>
          </tr>
        </thead>
        <tbody>
          {ordersToDisplay.length > 0 && ordersToDisplay.map(({ createdAt, _id, name, email, city, postalCode, country, streetAddress, line_items, paid }) => (
            <tr className="border-b-[1px] border-text-color last:border-none" key={createdAt}>
              <td>{createdAt?.split('T')[0]} <br />
                {createdAt?.split('T')[1].split('.')[0]}
              </td>
              <td>{!!paid ? <span className="text-success-color">Successed</span> : <span className="text-danger-color">Failed</span>}</td>
              <td className="text-center">
                {name} <br />
                {email} <br />
                {streetAddress} <br />
                {city} {postalCode} <br />
                {country} <br />
                <br />
              </td>
              <td>
                {line_items?.map((item, index) => (
                  <p key={index}>
                    {item.price_data?.product_data.name} <br />
                  </p>
                ))}
              </td>
              <td>
                {line_items?.map((item, index) => (
                  <p key={index}>
                    {item.quantity} <br />
                  </p>
                ))}
              </td>
              <td>
                <p>
                  {line_items?.reduce((acc, item) => acc + (item.price_data.unit_amount / 100 * item.quantity), 0)}$
                </p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Render pagination if there is more than one page */}
      {totalPages !== 1 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />}
    </Layout>
  )
}

export default OrdersPage