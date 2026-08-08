import Link from 'next/link'
import React from 'react'
import NavbarRoute from './NavbarRoute'
import { NAVBAR_HEIGHT } from '@/constants/layout'

const Navbar = () => {
  return (
    <div 
      className='fixed w-full flex bg-background items-center px-6 py-3 border-b z-1000 border-[#E2E2E226]'
      style={{height: `${NAVBAR_HEIGHT.desktop}px`}}
    >
        <div className='flex flex-1 justify-start'>
          <Link href="/" className='text-accent-soft text-3xl font-bold tracking-tight'>ALEXANDRE_MILLET</Link>
        </div>
        <div className='flex flex-1 justify-center font-mono items-center gap-10 text-sm tracking-[0.28px] text-foreground font-medium'>
            <NavbarRoute href="/#skills" title="COMPETENCES" />
            <NavbarRoute href="/#work" title="PROJETS" />
            <NavbarRoute href="/#bio" title="PROFIL" />
            <NavbarRoute href="/#contact" title="CONTACT" />
        </div>
        <div className='flex flex-1 justify-end'>
          <a
            href='/alexandre-millet-fullstack-developer-resume-fr.pdf'
            download='Alexandre-Millet-CV.pdf'
            className='bg-accent text-[#521300] px-6 py-2 text-sm tracking-wide font-bold transition-[filter] duration-200 hover:brightness-110'
          >
            CV
          </a>
        </div>
    </div>
  )
}

export default Navbar
