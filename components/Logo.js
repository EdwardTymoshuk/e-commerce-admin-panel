import Link from "next/link"
import { GiPlanetConquest } from "react-icons/gi"

const Logo = ({size}) => {
    return (
        <Link href="/" className="flex gap-2 items-center text-secondary-color">
        <GiPlanetConquest size={size} color="var(--color-logo)"/>
        <div className="flex">
        E-commerce Admin Panel
        </div>
    </Link>
    )
}

export default Logo