import React from 'react'
import Image from 'next/image'

export type SkillItem = {
  name: string
  /** Matter brick labels that unlock this skill when absorbed */
  brickLabels: string[]
  revealed: boolean
}

export type SkillsCardType = {
  icon: {
    src: string
    alt: string
  }
  number: number
  title: string
  skills: SkillItem[]
}

const SkillsCard = ({ icon, number, title, skills }: SkillsCardType) => {
  return (
    <div className="flex flex-col gap-6 bg-[#1F1F1F] border-foreground p-6 flex-1">
      <div className="flex justify-between items-center">
        <Image
          src={icon.src}
          width={24}
          height={24}
          alt={icon.alt}
        />
        <p className="font-mono font-medium text-foreground opacity-55">{`MODULE_0${number}`}</p>
      </div>
      <p className="font-sans text-3xl font-semibold text-foreground">{title}</p>
      <div className="flex flex-col gap-6">
        {skills.map((skill) => (
          <div
            className={`flex flex-col gap-1 transition-opacity duration-500 ${
              skill.revealed ? 'opacity-100' : 'opacity-25'
            }`}
            key={skill.name}
          >
            <p className="text-accent-soft font-medium tracking-wider">{skill.name}</p>
            <div className="w-full h-1 bg-[#2A2A2A]" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default SkillsCard
