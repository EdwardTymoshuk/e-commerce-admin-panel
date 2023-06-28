import Link from 'next/link'
import { useRouter } from 'next/router'
import { GiPlanetConquest, GiEarthAfricaEurope, GiGalaxy, GiSolarSystem, GiAutoRepair } from 'react-icons/gi'
import { BiCategoryAlt, BiLogOut } from 'react-icons/bi'
import { signOut } from 'next-auth/react'

export default function Nav() {
const inactiveLink = "flex items-center p-2 gap-1"
const activeLink = inactiveLink + " bg-secondary-color"

const router = useRouter()
const {pathname} = router

const logout = async () => {
    await router.push('/')
    await signOut()
}

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
                <Link href="/categories" className={pathname.includes("/categories") ? activeLink : inactiveLink}>
                <BiCategoryAlt />
                    Categories
                </Link>
                <Link href="/settings" className={pathname.includes("/settings") ? activeLink : inactiveLink}>
                <GiAutoRepair />
                    Settings
                </Link>
                <button onClick={logout} className={`${inactiveLink} text-danger-color`}>
                    <BiLogOut />
                    Logout
                </button>
            </nav>
        </aside>
    )
}