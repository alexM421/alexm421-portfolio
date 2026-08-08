import React from 'react'
import HeroCanvas from './HeroCanvas'
import HeroScan from './HeroScan'

const Hero = () => {
  return (
    <div className='@container relative h-screen w-full overflow-hidden flex flex-col justify-center items-start gap-6 md:gap-10 px-6 md:pl-8 grid-gradient'>
        <div className='flex flex-col gap-2'>
            <p className='font-mono font-medium text-sm md:text-xl text-accent'>AVAILABLE FOR HIRE</p>
            <h1 className='font-sans font-extrabold text-white text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight'>FULLSTACK<br/><span className='text-accent'>/</span> DEVELOPER</h1>
        </div>
        <div className='flex flex-row-reverse items-center gap-4 max-w-xl'>
            <h3 className='font-mono font-medium text-accent-soft text-sm md:text-xl'>ENGINEERING ROBUST DIGITAL SOLUTIONS WITH PRECISION AND PURPOSE.</h3>
            <div className='hidden sm:block w-20 h-0.5 shrink-0 bg-accent'></div>
        </div>
        <HeroCanvas/>
        <HeroScan/>
    </div>
  )
}

export default Hero
