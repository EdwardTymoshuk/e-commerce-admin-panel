// Importing components from libraries and local paths
import GoBackButton from "../../components/GoBackButton"
import Layout from "../../components/Layout"
import ProductForm from "../../components/ProductForm"

// Component for creating a new product
export default function NewProduct() {
    return (
        // Main page layout
        <Layout>
            <div className="flex flex-row min-h-[34px]">
                <GoBackButton />
            </div>
            {/* Form for creating a new product */}
            <ProductForm />
        </Layout>
    )
}
