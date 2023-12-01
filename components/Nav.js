import Link from 'next/link'
import { useRouter } from 'next/router'
import { BiLogOut } from 'react-icons/bi'
import { signOut } from 'next-auth/react'
import Logo from './Logo'

const links = [
    { href: '/', label: 'Dashboard' },
    { href: '/orders', label: 'Orders' },
    { href: '/products', label: 'Products' },
    { href: '/categories', label: 'Categories' },
    { href: '/settings', label: 'Settings' },
]

export default function Nav({ show }) {
    const inactiveLink = "flex items-center p-2 gap-1 transition-all"
    const activeLink = `${inactiveLink} text-secondary-color font-bold`
    const router = useRouter()
    const { pathname } = router


    const logout = async () => {
        await router.push('/')
        await signOut()
    }

    return (
        <aside className={(show ? "left-0" : "-left-full") + " p-5 items-center bg-primary-color fixed md:static min-h-screen z-50 w-full md:w-auto transition-all"}>
            <div className='pb-10 lg:w-max'>
                <Logo size={36} />
            </div>
            <nav>
                {links.map(({ href, label }) => (
                    <Link key={href} href={href} className={pathname === (href) ? activeLink : inactiveLink && pathname.includes(href) && label !== "Dashboard" ? activeLink : inactiveLink}>
                        {label}
                    </Link>
                ))}
                <div className='pt-10'>
                    <button onClick={logout} className={`${inactiveLink} btn-no-bg text-danger-color hover:text-danger-lighter-color`}>
                        <BiLogOut />
                        Logout
                    </button>
                </div>
            </nav>
        </aside>
    )
}