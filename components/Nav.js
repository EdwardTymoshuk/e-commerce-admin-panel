import Link from 'next/link'
import { useRouter } from 'next/router'
import { GiPlanetConquest, GiEarthAfricaEurope, GiGalaxy, GiSolarSystem, GiAutoRepair} from 'react-icons/gi'
export default function Nav() {

const inactiveLink = "flex items-center p-2 gap-1"
const activeLink = inactiveLink + " bg-secondary-color"

const {pathname} = useRouter()

    return (
        <aside className="items-center bg-primary-color w-fit min-h-screen">
            <Link href="/" className="flex p-2 gap-2 items-center text-secondary-color">
                <GiPlanetConquest className="text-[56pt]" color="var(--color-logo)"/>
                E-commerce Admin Panel
            </Link>
            <nav>
                <Link href="/" className={pathname==="/" ? activeLink : inactiveLink}>
                <GiEarthAfricaEurope />
                    Dashboard
                </Link>
                <Link href="/orders" className={pathname.includes("/orders") ? activeLink : inactiveLink}>
                <GiSolarSystem />
                    Orders
                </Link>
                <Link href="/products" className={pathname.includes("/products") ? activeLink : inactiveLink}>
                <GiGalaxy />
                    Products
                </Link>
                <Link href="/settings" className={pathname.includes("/settings") ? activeLink : inactiveLink}>
                <GiAutoRepair />
                    Settings
                </Link>
            </nav>
        </aside>
    )
}