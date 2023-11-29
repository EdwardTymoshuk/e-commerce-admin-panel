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
        <aside className={(show ? "left-0" : "-left-full") + " p-5 items-center bg-primary-color fixed md:static h-auto md:min-h-screen w-full md:max-w-min md:w-auto transition-all"}>
            <div className='pb-10 lg:w-max'>
                <Logo size={36} />
            </div>
            <nav className="">
                {links.map(({ href, label }) => (
                    <Link key={href} href={href} className={pathname === href ? activeLink : inactiveLink}>
                        {label}
                    </Link>
                ))}
                <div>
                    <button onClick={logout} className={`${inactiveLink} text-danger-color pt-10 flex hover:text-danger-lighter-color`}>
                        <BiLogOut />
                        Logout
                    </button>
                </div>
            </nav>
        </aside>
    )
}