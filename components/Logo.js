import Link from "next/link"

const Logo = ({size}) => {
    return (
        <Link href="/" className="flex gap-2 items-center text-secondary-color">
        <span className="flex uppercase text-basic font-roboto py-2">
        E-commerce | Admin Panel
        </span>
    </Link>
    )
}

export default Logo