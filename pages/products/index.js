import Link from "next/link";
import Layout from "../../components/Layout";
import {RiAddLine, RiEditLine} from 'react-icons/ri'
import { useEffect, useState } from "react";
import axios from "axios";

export default function Products() {
    const [products, setProducts] = useState([]) 
 
    useEffect(() => {
        axios.get('/api/products').then(res => setProducts(res.data))
    },[])
    
    return (
        <Layout>
            <Link href="products/new" className="flex items-center w-fit p-2 mb-2 gap-1 text-secondary-color hover:text-[#E2B43E]  hover:cursor-pointer">
            <RiAddLine size="2em" />
            Add new product
            </Link>
            <div className="flex flex-wrap gap-4 pl-4 lg:pl-0 lg:ml-2">
            {
                products.map(item => (
                    <div key={item._id} className="w-full lg:w-[31.75%] md:w-[48%] bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                    <a href="#">
                        <img className="rounded-t-lg" src={item.images[0] || "astronaut.jpg"} alt="product image" />
                    </a>
                    <div className="px-5 pb-5 flex flex-col">
                        <a href="#">
                            <h5 className="text-xl text-center font-semibold tracking-tight text-secondary-color ">{item.title}</h5>
                        </a>
                        <div className="flex items-center mt-2.5 mb-5">
                            <h6 className="text-md text-white">{item.description}</h6>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                            <span className="text-3xl font-bold text-gray-900 dark:text-white">{item.price + " $"}</span>
                            </div>
                            <div className="flex flex-row gap-2">
                            <Link href={'products/edit/'+item._id} className="flex flex-row items-center text-white bg-success-color hover:bg-secondary-color ease-in-out focus:ring-1 focus:outline-none focus:ring-secondary-color font-medium rounded-lg text-sm px-4 py-2.5 text-center cursor-pointer">
                                <RiEditLine /> Edit
                            </Link>
                            </div>
                        </div>
                    </div>
                </div>
                ))
            }
            </div>
        </Layout>
    )
}