"use client"

import React, { useRef} from 'react'
import SkillsEngine from './SkillsEngine/SkillsEngine'
import SkillsVortex from './SkillsVortex/SkillsVortex'
import useSkillsData from './useSkillsData'

const Skills = () => {

  const skillsRef = useRef<HTMLDivElement | null>(null)

  const skillsData = useSkillsData(skillsRef)

  return (
    <div className='relative flex flex-col p-10 w-full h-100 bg-background-soft gap-16' ref={skillsRef}>
        <div className='relative z-10 flex flex-col gap-2'>
            <p className='font-mono text-accent'>SKILLS</p>
            <h1 className='font-sans text-foreground-muted text-4xl'>Technical Stack</h1>
        </div>
        {skillsData && 
          <>
            <SkillsEngine skillsData={skillsData}/>
            <SkillsVortex skillsData={skillsData}/>
          </>
        }
    </div>
  )
}

export default Skills