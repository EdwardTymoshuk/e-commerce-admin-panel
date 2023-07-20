import { useEffect, useState } from "react"
import Layout from "../../components/Layout"
import axios from "axios"

const OrdersPage = () => {
  const [ orders, setOrders ] = useState([])
  useEffect(() => {
    axios.get('/api/orders').then(res => {
      setOrders(res.data)
    })
  }, [])
  return (
    <Layout>
      <h1>Orders</h1>
      <table className="basic text-left table-fixed w-full">
        <thead className="border-b-[1px] border-text-color">
          <tr className="text-dark-text-color">
            <th>Date</th>
            <th>Recipient</th>
            <th>Products</th>
            <th className="text-center">Quantity</th>
            <th>Total $</th>
          </tr>
        </thead>
        <tbody>
        {orders.length > 0 && orders.map(({createdAt, name, email, city, postalCode, country, streetAddress, line_items}) => (
          <tr className="border-b-[1px] border-text-color">
            <td>{createdAt?.split('T')[0]} <br />
                {createdAt?.split('T')[1].split('.')[0]}
            </td>
            <td>
            {name} <br />
            {email} <br />
            {streetAddress} <br />
            {city} {postalCode} <br />
            {country} <br />
            <br />
            </td>
            <td>
              {line_items?.map(item => (
                <>
                {item.price_data?.product_data.name} <br />
                </>
              ))}
            </td>
            <td className="text-center">
            {line_items?.map(item => (
                <>
              {item.quantity} <br />
              </>
             ))}
            </td>
            <td>
            {line_items?.map(item => (
                <>
              {item.price_data.unit_amount}$ <br />
              </>
             ))}
            </td>
          </tr>
        ))}
        </tbody>
      </table> 
    </Layout>
  )
}

export default OrdersPage
