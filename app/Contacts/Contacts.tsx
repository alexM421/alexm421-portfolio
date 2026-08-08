import Link from 'next/link'
import React from 'react'
import CursorGlow from '../CursorGlow/CursorGlow'

const Contacts = () => {
  return (
    <div id='contact' className='relative overflow-hidden bg-black flex flex-col px-64 py-10 gap-6 justify-center text-center'>
        <CursorGlow/>
        <p className='text-sm  text-accent font-mono tracking-wide'>CONNECT</p>
        <p className='font-sans text-6xl text-white'>technical discussion</p>
        <p className='text-foreground-muted font-sans'>Ouvert aux opportunités et aux échanges autour du développement web, du fullstack et de nouveaux projets.</p>
        <a 
            href='mailto:alexandremillet421@gmail.com'
            target='_blank'
            className='text-[#521300] self-center bg-accent px-12 py-6 font-mono tracking-[3.2px] text-xl font-bold transition-all duration-300 hover:brightness-110 hover:-translate-y-1 hover:shadow-[0_12px_40px_-12px_var(--accent)]'
        >INITIATE CONTACT</a>
        <div className='flex gap-8 items-center justify-center'>
            <div className='flex-1 flex justify-end'>
                <Link 
                    href='https://github.com/alexM421' target='_blank'
                    className='tracking-widest font-mono text-foreground-muted opacity-60 hover:opacity-100 hover:text-accent-soft transition-all duration-150'
                >GITHUB</Link>
            </div>
            <div className='flex'>
                <Link 
                    href='https://www.linkedin.com/in/alexandre-millet-42137233b/' target='_blank'
                    className='tracking-widest font-mono text-foreground-muted opacity-60 hover:opacity-100 hover:text-accent-soft transition-all duration-150'
                >LINKEDIN</Link>
            </div>
            <div className='flex-1 flex justify-start'>
                <Link 
                    href='https://www.frontendmentor.io/profile/alexM421' target='_blank'
                    className='tracking-widest font-mono text-foreground-muted opacity-60 hover:opacity-100 hover:text-accent-soft transition-all duration-150'
                >FMENTOR</Link>
            </div>
        </div>
    </div>
  )
}

export default Contacts