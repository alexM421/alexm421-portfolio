'use client'

import Link from 'next/link'
import React, { useState } from 'react'
import NavbarRoute from './NavbarRoute'
import { NAVBAR_HEIGHT } from '@/constants/layout'

const Navbar = () => {
  const [open, setOpen] = useState(false)

  return (
    <div 
      className='fixed w-full flex bg-background items-center px-4 md:px-6 py-3 border-b z-1000 border-[#E2E2E226]'
      style={{height: `${NAVBAR_HEIGHT.desktop}px`}}
    >
        <div className='flex flex-1 justify-start min-w-0'>
          <Link href="/" className='text-accent-soft text-lg sm:text-2xl md:text-3xl font-bold tracking-tight truncate'>
            ALEXANDRE_MILLET
          </Link>
        </div>

        <div className='hidden lg:flex flex-1 justify-center font-mono items-center gap-10 text-sm tracking-[0.28px] text-foreground font-medium'>
            <NavbarRoute href="/#skills" title="COMPETENCES" />
            <NavbarRoute href="/#work" title="PROJETS" />
            <NavbarRoute href="/#bio" title="PROFIL" />
            <NavbarRoute href="/#contact" title="CONTACT" />
        </div>

        <div className='flex flex-1 justify-end items-center gap-3'>
          <a
            href='/alexandre-millet-fullstack-developer-resume-fr.pdf'
            download='Alexandre-Millet-CV.pdf'
            className='bg-accent text-[#521300] px-4 md:px-6 py-2 text-sm tracking-wide font-bold transition-[filter] duration-200 hover:brightness-110'
          >
            CV
          </a>
          <button
            type='button'
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            className='lg:hidden flex flex-col justify-center gap-1.5 p-2 text-foreground'
            onClick={() => setOpen((prev) => !prev)}
          >
            <span className={`block h-0.5 w-5 bg-current transition-transform ${open ? 'translate-y-2 rotate-45' : ''}`} />
            <span className={`block h-0.5 w-5 bg-current transition-opacity ${open ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 w-5 bg-current transition-transform ${open ? '-translate-y-2 -rotate-45' : ''}`} />
          </button>
        </div>

        {open && (
          <div className='absolute top-full left-0 w-full bg-background border-b border-[#E2E2E226] flex flex-col gap-4 px-6 py-6 font-mono text-sm tracking-[0.28px] text-foreground lg:hidden'>
            <NavbarRoute href="/#skills" title="COMPETENCES" onClick={() => setOpen(false)} />
            <NavbarRoute href="/#work" title="PROJETS" onClick={() => setOpen(false)} />
            <NavbarRoute href="/#bio" title="PROFIL" onClick={() => setOpen(false)} />
            <NavbarRoute href="/#contact" title="CONTACT" onClick={() => setOpen(false)} />
          </div>
        )}
    </div>
  )
}

export default Navbar
