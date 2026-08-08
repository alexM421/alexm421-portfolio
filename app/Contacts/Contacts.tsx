import Link from 'next/link'
import React from 'react'
import CursorGlow from '../CursorGlow/CursorGlow'

const Contacts = () => {
  return (
    <div id='contact' className='relative overflow-hidden bg-black flex flex-col px-6 md:px-16 lg:px-64 py-10 gap-6 justify-center text-center'>
        <CursorGlow/>
        <p className='text-sm text-accent font-mono tracking-wide'>CONNECT</p>
        <p className='font-sans text-3xl sm:text-5xl md:text-6xl text-white'>technical discussion</p>
        <p className='text-foreground-muted font-sans max-w-2xl mx-auto'>Ouvert aux opportunités et aux échanges autour du développement web, du fullstack et de nouveaux projets.</p>
        <a 
            href='mailto:alexandremillet421@gmail.com'
            target='_blank'
            className='text-[#521300] self-center bg-accent px-6 sm:px-12 py-4 sm:py-6 font-mono tracking-[2px] sm:tracking-[3.2px] text-base sm:text-xl font-bold transition-all duration-300 hover:brightness-110 hover:-translate-y-1 hover:shadow-[0_12px_40px_-12px_var(--accent)]'
        >INITIATE CONTACT</a>
        <div className='flex flex-wrap gap-6 sm:gap-8 items-center justify-center'>
            <Link 
                href='https://github.com/alexM421' target='_blank'
                className='tracking-widest font-mono text-foreground-muted opacity-60 hover:opacity-100 hover:text-accent-soft transition-all duration-150'
            >GITHUB</Link>
            <Link 
                href='https://www.linkedin.com/in/alexandre-millet-42137233b/' target='_blank'
                className='tracking-widest font-mono text-foreground-muted opacity-60 hover:opacity-100 hover:text-accent-soft transition-all duration-150'
            >LINKEDIN</Link>
            <Link 
                href='https://www.frontendmentor.io/profile/alexM421' target='_blank'
                className='tracking-widest font-mono text-foreground-muted opacity-60 hover:opacity-100 hover:text-accent-soft transition-all duration-150'
            >FMENTOR</Link>
        </div>
    </div>
  )
}

export default Contacts
