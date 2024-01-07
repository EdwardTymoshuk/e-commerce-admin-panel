import Link from "next/link"
import { IoCaretBack } from "react-icons/io5"

/**
 * Page404 component for rendering a custom 404 page.
 *
 * @returns {JSX.Element} - Page404 component.
 */
const Page404 = () => {
    return (
        <div className="flex items-center justify-center h-screen bg-[url('/404-page-bg.svg')]">
            <div className="text-center">
                <h1 className="text-4xl text-secondary-color">404 | Page not found</h1>
                <d iv className="flex flex-col gap-8 items-center">
                    <h2 className="text-2xl text-white">Oops! It looks like you're lost.</h2>
                    <button>
                        <Link href="/" className="text-white flex items-center">
                             <IoCaretBack /> Back home
                        </Link>
                    </button>
                </d>
            </div>
        </div>
    )
}

export default Page404
