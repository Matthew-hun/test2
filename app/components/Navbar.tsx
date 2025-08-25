import React from 'react'
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
} from "@/components/ui/navigation-menu"
import Link from 'next/link'

const menus: { title: string, href: string }[] = [
    {
        title: "Game",
        href: "/",
    },
    {
        title: "Players",
        href: "/pages/players",
    },
    {
        title: "Statistics",
        href: "/pages/statistics",
    }
]

const Navbar = () => {
    return (
        <div className='w-full h-10 flex justify-center items-center'>
            <ul className='flex gap-4 text-white'>
                {menus.map((menu, menuIdx) => {
                    return (<Link href={menu.href} key={menuIdx}><li>{menu.title}</li></Link>)
                })}
            </ul>
        </div>
    )
}

export default Navbar
