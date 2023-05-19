import Link from "next/link";
import Layout from "../../components/Layout";
import {RiAddLine} from 'react-icons/ri'

export default function Products() {
    return (
        <Layout>
            <Link href="products/new" className="flex items-center w-fit p-2 gap-1 text-secondary-color hover:border-2 hover:border-secondary-color hover:m-[-2px] hover:rounded-2xl hover:ease-in hover:duration-75">
            <RiAddLine size="2em" color="var(--color-secondary)"/>
            Add new product
            </Link>
        </Layout>
    )
}