import React from 'react'

const Skills = () => {
  return (
    <div className='flex flex-col p-10 w-full bg-background-soft gap-16'>
        <div className='flex flex-col gap-2'>
            <p className='font-mono text-accent'>SKILLS</p>
            <h1 className='font-sans text-foreground-muted text-4xl'>Technical Stack</h1>
        </div>
        <div className='flex flex-col gap-10'>
            <div></div>
            {/*progress bar*/}
            <div className='w-full h-1 rounded-full bg-white/5 z-0'>
                <div className='w-40 h-1 rounded-full bg-accent '></div>
            </div>
        </div>
    </div>
  )
}

export default Skills