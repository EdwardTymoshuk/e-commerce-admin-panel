import Image from "next/image"
import Link from "next/link"

const Page404 = () => {
    return (
        <div className="flex items-center justify-center h-screen bg-black">
            <div className="text-center">
                <h1 className="text-4xl text-secondary-color">404 | Page not found</h1>
                <div className="flex justify-center py-4">
                    <Image src="/astronaut.png" alt="astronaut" width={200} height={200} />
                </div>
                <div className="flex flex-col gap-2 items-center">
                    <h2 className="text-2xl text-white">Oops! It looks like you're lost.</h2>
                    <button className="bg-secondary-color">
                        <Link href="/" className="text-white">
                            Back Home
                        </Link>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Page404
