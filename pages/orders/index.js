import { useEffect, useState, memo } from "react"
import { BiSortUp, BiSortDown } from 'react-icons/bi'
import Layout from "../../components/Layout"
import axios from "axios"

const OrdersPage = () => {
  const [ orders, setOrders ] = useState([])
  const [sortDirection, setSortDirection] = useState('desc')
  const [sortColumn, setSortColumn] = useState('createdAt')
  const [selectedStatus, setSelectedStatus] = useState('all')

  useEffect(() => {
    axios.get('/api/orders').then(res => {
      setOrders(res.data)
    })
  }, [])

  const handleSort = (column) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  }

  const handleStatusFilter = (status) => {
    setSelectedStatus(status);
  }

  const sortedOrders = [...orders].sort((a, b) => {
    const valueA = a[sortColumn]
    const valueB = b[sortColumn]

    if (sortColumn === 'total') {
      const numA = parseFloat(a.line_items?.reduce((acc, item) => acc + (item.price_data.unit_amount/100 * item.quantity), 0))
      const numB = parseFloat(b.line_items?.reduce((acc, item) => acc + (item.price_data.unit_amount/100 * item.quantity), 0))
  
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
    return order.paid === (selectedStatus === 'success')
  })

  return (
    <Layout>
      <h1 className="page-header">Orders</h1>
      <div className="flex flex-row justify-center md:justify-start gap-2 w-full py-2">
  <button
    onClick={() => handleStatusFilter('all')}
    className={`status-filter-button text-dark-text-color ${selectedStatus === 'all' ? 'selected' : ''}`}
  >
    All
  </button>
  <button
    onClick={() => handleStatusFilter('success')}
    className={`status-filter-button text-success-color ${selectedStatus === 'success' ? 'selected' : ''}`}
  >
    Successed
  </button>
  <button
    onClick={() => handleStatusFilter('failed')}
    className={`status-filter-button text-danger-color ${selectedStatus === 'failed' ? 'selected' : ''}`}
  >
    Failed
  </button>
</div>
      <table className="basic text-left table-auto w-full break-words">
        <thead>
          <tr>
            <th className="cursor-pointer" onClick={() => handleSort('createdAt')}><div className="inline-flex items-center">Date {sortColumn === "createdAt" && sortDirection === "asc" ? <BiSortDown /> : <BiSortUp />}</div></th>
            <th className="cursor-pointer" onClick={() => handleSort('paid')}><div className="inline-flex items-center">Status {sortColumn === "paid" && sortDirection === "asc" ? <BiSortDown /> : <BiSortUp />}</div></th> 
            <th >Recipient</th>
            <th >Products</th>
            <th >Quantity</th>
            <th className="cursor-pointer" onClick={() => handleSort('total')}><div className="inline-flex items-center">Total {sortColumn === "total" && sortDirection === "asc" ? <BiSortDown /> : <BiSortUp />}</div></th>
          </tr>
        </thead>
        <tbody>
        {filteredOrders.length > 0 && filteredOrders.map(({createdAt, name, email, city, postalCode, country, streetAddress, line_items, paid}) => (
          <tr className="border-b-[1px] border-text-color last:border-none" key={createdAt}>
            <td>{createdAt?.split('T')[0]} <br />
                {createdAt?.split('T')[1].split('.')[0]}
            </td>
            <td>{!!paid ? <span className="text-success-color">Successed</span> : <span className="text-danger-color">Failed</span>}</td>
            <td >
            {name} <br />
            {email} <br />
            {streetAddress} <br />
            {city} {postalCode} <br />
            {country} <br />
            <br />
            </td>
            <td >
              {line_items?.map(item => (
                <>
                {item.price_data?.product_data.name} <br />
                </>
              ))}
            </td>
            <td >
            {line_items?.map(item => (
                <>
              {item.quantity} <br />
              </>
             ))}
            </td>
            <td>
        {
          <>
          {line_items?.reduce((acc, item) => acc + (item.price_data.unit_amount/100 * item.quantity), 0)}$
          </>
        }
            </td>
          </tr>
        ))}
        </tbody>
      </table> 
    </Layout>
  )
}

export default OrdersPage
