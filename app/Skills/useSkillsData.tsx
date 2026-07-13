import React, { useEffect, useState } from 'react'

export type skillsData = {
    skills: {
        container: HTMLDivElement,
        width: number,
        height: number
    },
    vortexData: {
        coordinates: {
            vortexCenterY: number,
            vortexLCenterX: number,
            vortexRCenterX: number
        },
        vortexRadius: number
    }
}

export type VortexCoordinates = skillsData['vortexData']['coordinates']
export type VortexData = skillsData['vortexData']
export type SkillsLayout = skillsData['skills']


const useSkillsData = (skillsRef: React.RefObject<HTMLDivElement | null>) => {
  
    const [skillsData, setSkillsData] = useState<skillsData | null>()

    useEffect(() => {
        const container = skillsRef.current
        if (!container) return    

        setSkillsData({
            skills: {
                container: container,
                width: container.clientWidth,
                height: container.clientHeight,
            },
            vortexData: {
                coordinates: {
                    vortexCenterY: container.clientHeight/2,
                    vortexLCenterX: container.clientWidth/4,
                    vortexRCenterX:  3*container.clientWidth/4,
                  },
                vortexRadius: 100
            }
        })

    }, [skillsRef])

    return skillsData
}

export default useSkillsData