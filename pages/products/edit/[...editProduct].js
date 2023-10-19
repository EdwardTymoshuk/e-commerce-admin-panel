import { useRouter } from "next/router";
import Layout from "../../../components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import ProductForm from "../../../components/ProductForm";
import GoBackButton from "../../../components/GoBackButton";

export default function EditProduct() {
    const [productInfo, setProductInfo] = useState(null)
    const router = useRouter()
    useEffect(() => {
        if (router.isReady) {
            const id = router.query.editProduct[0]
            if (!id) { return }
            axios.get('/api/products/?id=' + id).then(res => {
                setProductInfo(res.data)
            })
        }
    }, [router.isReady])
    return (
        <Layout>
            <GoBackButton />
            {productInfo && <ProductForm {...productInfo} />}
        </Layout>
    )
}