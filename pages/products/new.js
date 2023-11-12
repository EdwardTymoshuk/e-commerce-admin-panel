import GoBackButton from "../../components/GoBackButton"
import Layout from "../../components/Layout"
import ProductForm from "../../components/ProductForm"

export default function NewProduct() {

    return (
        <Layout>
            <div className="flex flex-row min-h-[34px]">
            <GoBackButton />
            </div>
            <ProductForm />
        </Layout>
    )
}