import React from 'react'

const Footer = () => {
  return (
    <div className='bg-black flex flex-col sm:flex-row gap-4 border-t border-[rgba(180,181,181,0.3)] justify-between px-6 py-8 md:py-10 items-start sm:items-center'>
        <p className='font-mono text-foreground font-medium text-base md:text-lg tracking-wide'>ALEXANDRE_MILLET</p>
        <div className='flex-col text-start sm:text-end'>
            <p className='font-mono text-foreground-muted text-xs tracking-widest'>BUILT WITH REACT · TYPESCRIPT</p>
            <p className='font-mono text-foreground-muted text-xs tracking-widest'>© 2026</p>
        </div>
    </div>
  )
}

export default Footer
