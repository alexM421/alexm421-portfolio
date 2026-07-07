"use client"

import React, { useRef} from 'react'
import SkillsEngine from './SkillsEngine'

const Skills = () => {

  const skillsDivRef = useRef<HTMLDivElement | null>(null)

  return (
    <div className='relative flex flex-col p-10 w-full h-100 bg-background-soft gap-16' ref={skillsDivRef}>
        <div className='relative z-10 flex flex-col gap-2'>
            <p className='font-mono text-accent'>SKILLS</p>
            <h1 className='font-sans text-foreground-muted text-4xl'>Technical Stack</h1>
        </div>
        {/* <SkillsCanvas containerRef={skillsDivRef}/> */}
        <SkillsEngine skillsRef={skillsDivRef}/>
    </div>
  )
}

export default Skills