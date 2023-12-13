import axios from "axios"
import { useEffect, useState } from "react"
import InfoBlock from "./InfoBlock"
import InfoBlocksWraper from "./InfoBlocksWraper"
import PageHeader from "./PageHeader"

const Dashboard = () => {
    // State variables for various data points
    const [productCount, setProductCount] = useState(null)
    const [ordersCount, setOrdersCount] = useState(null)
    const [successedOrdersCount, setSuccessedOrdersCount] = useState(null)
    const [failedOrdersCount, setFailedOrdersCount] = useState(null)
    const [soldProductsCount, setSoldProductsCount] = useState(null)
    const [soldAmount, setSoldAmount] = useState(null)
    const [largestOrder, setLargestOrder] = useState(null)
    const [bestSellingProduct, setBestSellingProduct] = useState({} || '')

    // Calculate average order amount
    const averageOrder = soldAmount / successedOrdersCount

    // Helper function to format currency
    const formatCurrency = (amount) => amount?.toLocaleString("en-US", { style: "currency", currency: "USD" })

    // Fetch data on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch product count
                const productsResponse = await axios.get('/api/products', { params: { count: true } })
                setProductCount(productsResponse.data.count)

                // Fetch total orders count
                const ordersResponse = await axios.get('/api/orders', { params: { count: true } })
                setOrdersCount(ordersResponse.data.count)

                // Fetch successful orders data
                const successedOrdersResponse = await axios.get('/api/orders', { params: { successed: true } })
                let count = 0
                let amount = 0
                let largestOrderAmount = 0
                const productSales = {}

                // Process successful orders data
                setSuccessedOrdersCount(successedOrdersResponse.data.length)
                successedOrdersResponse.data?.forEach(order => {
                    let orderTotalAmount = 0

                    order.line_items.forEach(item => {
                        // Calculate sold products count and total sold amount
                        count += item.quantity
                        const itemAmount = item.quantity * item.price_data.unit_amount / 100
                        amount += itemAmount
                        orderTotalAmount += itemAmount

                        // Track product sales
                        const pruductName = item.price_data.product_data.name
                        productSales[pruductName] = (productSales[pruductName] || 0) + item.quantity
                    })

                    // Determine the largest order amount
                    if (orderTotalAmount > largestOrderAmount) {
                        largestOrderAmount = orderTotalAmount
                    }
                })

                // Determine the best-selling product
                const bestseller = Object.keys(productSales).reduce((a, b) => productSales[a] > productSales[b] ? a : b, '')
                setBestSellingProduct({ name: bestseller, quantity: productSales[bestseller] })

                // Set the state with fetched data
                setSoldProductsCount(count)
                setSoldAmount(amount)
                setLargestOrder(largestOrderAmount)
            } catch (error) {
                // Handle errors during data fetching
                console.error('Error fetching data:', error)
            }
        }

        // Call the fetchData function
        fetchData()
    }, [])  // Run the effect only on component mount

    // Fetch failed orders count
    useEffect(() => {
        const fetchFailedOrders = async () => {
            try {
                const failedOrdersResponse = await axios.get('/api/orders', { params: { failed: true } })
                setFailedOrdersCount(failedOrdersResponse.data.length)
            } catch (error) {
                // Handle errors during failed orders fetching
                console.error('Error fetching failed orders:', error)
            }
        }

        // Call the fetchFailedOrders function
        fetchFailedOrders()
    }, [])  // Run the effect only on component mount

    // Render the dashboard component
    return (
        <div className="dashboard flex flex-row flex-wrap gap-4 w-full">
        <PageHeader>Dashboard</PageHeader>
            {/* Display information blocks about best-selling products and total products sold */}
            <InfoBlocksWraper>
                <InfoBlock className="w-2/3">
                    <h3>Bestseller</h3>
                    <div className="flex flex-row">
                        {/* Display best-selling product name */}
                        <div className="w-2/3 text-sm italic pt-10 text-center">
                            <h4>Name</h4>
                            <p>{bestSellingProduct.name}</p>
                        </div>
                        {/* Display the quantity of best-selling product */}
                        <div className="w-1/3 text-sm italic pt-10 text-center">
                            <h4>Number of sales</h4>
                            <p className="md:text-4xl lg:text-6xl">{bestSellingProduct.quantity}</p>
                        </div>
                    </div>
                </InfoBlock>
                {/* Display products count and total sold products */}
                <InfoBlock className="w-1/3">
                    <h3>Products</h3>
                    <div className="flex flex-row gap-2">
                        {/* Display total products count */}
                        <div className="w-1/2 text-sm italic pt-10 text-center">
                            <h4>Total</h4>
                            <p>{productCount}</p>
                        </div>
                        {/* Display total sold products count */}
                        <div className="w-1/2 text-sm italic pt-10 text-center">
                            <h4>Sold</h4>
                            <p>{soldProductsCount}</p>
                        </div>
                    </div>
                </InfoBlock>
            </InfoBlocksWraper>
            {/* Display information blocks about total orders, successful orders, and income */}
            <InfoBlocksWraper>
                <InfoBlock className="w-1/2">
                    <h3>Orders</h3>
                    <div className="flex flex-col pt-10 h-full justify-center">
                        {/* Display total orders count */}
                        <div className="text-sm italic">
                            <h4>All</h4>
                            <p>{ordersCount}</p>
                        </div>
                        {/* Display successful orders count */}
                        <div className="text-sm italic">
                            <h4>Successful</h4>
                            <p>{successedOrdersCount}</p>
                        </div>
                        {/* Display failed orders count */}
                        <div className="text-sm italic">
                            <h4>Failed</h4>
                            <p>{failedOrdersCount}</p>
                        </div>
                    </div>
                </InfoBlock>
                {/* Display information about total income, largest order, and average order */}
                <InfoBlock className="w-1/2">
                    <h3>Income</h3>
                    <div className="flex flex-col pt-10 h-full justify-center">
                        {/* Display total income */}
                        <div className="text-sm italic">
                            <h4>Total</h4>
                            <p>{formatCurrency(soldAmount)}</p>
                        </div>
                        {/* Display the amount of the largest order */}
                        <div className="text-sm italic">
                            <h4>Largest order</h4>
                            <p>{formatCurrency(largestOrder)}</p>
                        </div>
                        {/* Display average order amount */}
                        <div className="text-sm italic">
                            <h4>Average order</h4>
                            <p>{formatCurrency(averageOrder)}</p>
                        </div>
                    </div>
                </InfoBlock>
            </InfoBlocksWraper>
        </div>
    )
}

export default Dashboard