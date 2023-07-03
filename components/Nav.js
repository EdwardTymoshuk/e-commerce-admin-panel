import Link from 'next/link'
import { useRouter } from 'next/router'
import { GiPlanetConquest, GiEarthAfricaEurope, GiGalaxy, GiSolarSystem, GiAutoRepair } from 'react-icons/gi'
import { BiCategoryAlt, BiLogOut } from 'react-icons/bi'
import { signOut } from 'next-auth/react'
import Logo from './Logo'

export default function Nav({show}) {
const inactiveLink = "flex items-center p-2 gap-1"
const activeLink = inactiveLink + " bg-secondary-color"

const router = useRouter()
const {pathname} = router

const logout = async () => {
    await router.push('/')
    await signOut()
}

    return (
        <aside className={(show ? "left-0" : "-left-full") + " items-center bg-primary-color fixed md:static h-full md:min-h-screen w-full md:w-auto transition-all"}>
            <div className='p-2 lg:w-max'>
            <Logo size={36}/>
            </div>
            <nav className="p-2">
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