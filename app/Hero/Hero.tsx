import React from 'react'
import HeroCanvas from './HeroCanvas'
import HeroScan from './HeroScan'

const Hero = () => {
  return (
    <div className='@container relative h-screen w-screen overflow-hidden flex flex-col justify-center items-start gap-10 pl-8 grid-gradient'>
        <div className='flex flex-col gap-2'>
            <p className='font-mono font-medium text-xl text-accent'>AVAILABLE FOR HIRE</p>
            <h1 className='font-sans font-extrabold text-white text-8xl tracking-tight'>FULLSTACK<br/><span className='text-accent'>/</span> DEVELOPER</h1>
        </div>
        <div className='flex flex-row-reverse items-center gap-4'>
            <h3 className='font-mono font-medium text-accent-soft text-xl'>ENGINEERING ROBUST DIGITAL SOLUTIONS WITH MATHEMATICAL PRECISION.</h3>
            <div className='w-20 h-0.5 bg-accent'></div>
        </div>
        <HeroCanvas/>
        <HeroScan/>
    </div>
  )
}

export default Hero