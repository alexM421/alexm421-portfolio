import Link from 'next/link'
import React from 'react'
import NavbarRoute from './NavbarRoute'
import { NAVBAR_HEIGHT } from '@/constants/layout'

const Navbar = () => {
  return (
    <div 
      className='fixed w-full flex bg-background justify-between items-center px-6 py-3 border-b z-10 border-[#E2E2E226]'
      style={{height: `${NAVBAR_HEIGHT}px`}}
    >
        <Link href="/" className='text-accent-soft text-3xl font-bold tracking-tight'>ALEXANDRE_MILLET</Link>
        <div className='font-mono items-center flex gap-10 text-sm tracking-[0.28px] text-foreground font-medium'>
            <NavbarRoute href="/#bio" title="BIO" />
            <NavbarRoute href="/#skills" title="SKILLS" />
            <NavbarRoute href="/#work" title="WORK" />
            <NavbarRoute href="/#contact" title="CONTACT" />
        </div>
        <button className='bg-accent text-[#521300] px-6 py-2 text-sm tracking-wide font-bold'>RESUME</button>
    </div>
  )
}

export default Navbar