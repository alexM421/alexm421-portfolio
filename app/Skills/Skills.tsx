"use client"

import React, { useCallback, useRef, useState } from "react"
import SkillsEngine from "./SkillsEngine/SkillsEngine"
import SkillsVortex from "./SkillsVortex/SkillsVortex"
import useSkillsData from "./useSkillsData"
import SkillsCard, { SkillsCardType } from "./SkillsCard/SkillsCard"
import useMediaQuery from "../hooks/useMediaQuery"

const INITIAL_SKILLS_CARDS: SkillsCardType[] = [
  {
    icon: {
      src: "/frontend_icon.svg",
      alt: "Frontend icon",
    },
    number: 1,
    title: "FRONTEND",
    skills: [
      {
        name: "REACT / NEXT.JS",
        brickLabels: ["React", "Next.js"],
        revealed: false,
      },
      {
        name: "JAVASCRIPT / TYPESCRIPT",
        brickLabels: ["Javascript", "Typescript"],
        revealed: false,
      },
      {
        name: "TAILWIND CSS",
        brickLabels: ["TailwindCSS"],
        revealed: false,
      },
      {
        name: "HTML / CSS",
        brickLabels: ["HTML", "CSS"],
        revealed: false,
      },
    ],
  },
  {
    icon: {
      src: "/backend_icon.svg",
      alt: "Backend icon",
    },
    number: 2,
    title: "BACKEND",
    skills: [
      {
        name: "NODE.JS",
        brickLabels: ["Node"],
        revealed: false,
      },
      {
        name: "EXPRESS",
        brickLabels: ["Express"],
        revealed: false,
      },
      {
        name: "POSTGRESQL",
        brickLabels: ["PostgreSQL"],
        revealed: false,
      },
      {
        name: "TYPESCRIPT",
        brickLabels: ["Typescript"],
        revealed: false,
      },
    ],
  },
  {
    icon: {
      src: "/infra_icon.svg",
      alt: "Infrastructure icon",
    },
    number: 3,
    title: "INFRA",
    skills: [
      {
        name: "GIT",
        brickLabels: ["Git"],
        revealed: false,
      },
      {
        name: "DOCKER",
        brickLabels: ["Docker"],
        revealed: false,
      },
    ],
  },
]

const Skills = () => {
  const skillsRef = useRef<HTMLDivElement | null>(null)
  const [skillsCards, setSkillsCards] = useState(INITIAL_SKILLS_CARDS)
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  const revealSkill = useCallback((brickLabel: string) => {
    setSkillsCards((cards) =>
      cards.map((card) => ({
        ...card,
        skills: card.skills.map((skill) =>
          skill.brickLabels.includes(brickLabel)
            ? { ...skill, revealed: true }
            : skill,
        ),
      })),
    )
  }, [])

  const skillsData = useSkillsData(skillsRef)
  const showPhysics = isDesktop && !!skillsData

  const displayCards = skillsCards.map((card) => ({
    ...card,
    skills: card.skills.map((skill) => ({
      ...skill,
      revealed: isDesktop ? skill.revealed : true,
    })),
  }))

  return (
    <div
      id="skills"
      className="relative flex flex-col p-6 md:p-10 w-full bg-background-soft gap-8 lg:pr-80"
      ref={skillsRef}
    >
      <div className="relative z-10 flex flex-col gap-2">
        <p className="font-mono text-accent">SKILLS</p>
        <h1 className="font-sans text-foreground-muted text-3xl md:text-4xl">
          Stack Technique
        </h1>
      </div>
      {showPhysics && skillsData && (
        <>
          <SkillsEngine
            skillsData={skillsData}
            onSkillAbsorbed={revealSkill}
          />
          <SkillsVortex skillsData={skillsData} />
        </>
      )}
      <div className="relative z-[1] flex flex-col md:flex-row gap-4">
        {displayCards.map((skillsCard) => (
          <SkillsCard key={skillsCard.title} {...skillsCard} />
        ))}
      </div>
    </div>
  )
}

export default Skills
