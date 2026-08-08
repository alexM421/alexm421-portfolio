/** Shared UI signal between SkillsEngine and SkillsVortex (no React re-render needed). */

let rightVortexShine = 0

export const setRightVortexShine = (value: number) => {
  rightVortexShine = Math.max(0, Math.min(1, value))
}

export const getRightVortexShine = () => rightVortexShine
