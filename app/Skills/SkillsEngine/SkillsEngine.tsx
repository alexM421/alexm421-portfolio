"use client"

import Matter from 'matter-js'
import { useEffect } from 'react'
import { skillsData } from '../useSkillsData'
import { setupEngine, setupWalls, setupBoxesSpawn, setupMouse, setupTextLabels, startSimulation } from './skillsEngineUtils'

const SkillsEngine = ({
  skillsData,
  onSkillAbsorbed,
}: {
  skillsData: skillsData
  onSkillAbsorbed?: (brickLabel: string) => void
}) => {
  const { skills, vortexData } = skillsData
  const { container, width, height } = skills
  const { coordinates, vortexRadius } = vortexData

  useEffect(() => {
    const { engine, render } = setupEngine(container, width, height)

    setupWalls(width, height, engine)
    const clearMouseEffects = setupMouse(render, engine)
    const stopSpawn = setupBoxesSpawn(
      coordinates,
      vortexRadius,
      engine,
      render,
      onSkillAbsorbed,
    )
    const clearLabelEffects = setupTextLabels(render, engine)
    const stopSimulation = startSimulation(render, engine)

    return () => {
      stopSpawn()
      clearMouseEffects()
      clearLabelEffects()
      stopSimulation()
      Matter.Engine.clear(engine)
      render.canvas.remove()
    }
  }, [coordinates, skills, vortexRadius, width, height, container, onSkillAbsorbed])

  return null
}

export default SkillsEngine
