import Link from 'next/link'
import React from 'react'

const NavbarRoute = ({ href, title }: { href: string, title: string}) => {
  return (
    <Link 
        href={href}
        className='hover:text-accent-soft hover:pb-1 transition-all relative'
    >
      <div className='after:absolute after:transition-all after:w-0 hover:after:w-full after:h-0.5 after:bg-accent-soft after:bottom-0 after:left-0'>
        {title}
      </div>
    </Link> 
  )
}

export default NavbarRoute