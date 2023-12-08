import { useRouter } from "next/router"
import Layout from "../../../components/Layout"
import { useEffect, useState } from "react"
import axios from "axios"
import ProductForm from "../../../components/ProductForm"
import GoBackButton from "../../../components/GoBackButton"

// EditProduct component
const EditProduct = () => {
    // State variable to store product information
    const [productInfo, setProductInfo] = useState(null)

    // Next.js router
    const router = useRouter()

    // Fetch product information from the server when the component mounts or the route changes
    useEffect(() => {
        // Check if the router is ready
        if (router.isReady) {
            const id = router.query.editProduct[0]
            if (!id) {
                return
            }
            // Fetch product information based on the ID
            axios.get('/api/products/?id=' + id).then((res) => {
                setProductInfo(res.data)
            })
        }
    }, [router.isReady]) // Re-run the effect when the router is ready

    // Render component
    return (
        <Layout>
            <GoBackButton />
            {productInfo && <ProductForm {...productInfo} />}
        </Layout>
    )
}
export default EditProduct