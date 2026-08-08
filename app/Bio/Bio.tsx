import Image from 'next/image'
import React from 'react'
import RocketIcon from './RocketIcon'
import TerminalIcon from './TerminalIcon'

const Bio = () => {
  return (
    <div id='bio' className='flex flex-col lg:flex-row bg-background-soft gap-8 lg:gap-10 p-6 md:p-10'>
        <div className='flex flex-col gap-8 lg:gap-10 flex-3 lg:pl-5'>
            <div className='flex flex-col sm:flex-row gap-4 items-start sm:items-center'>
                <div className='relative p-2 hover:scale-102 group transition-all duration-300'>
                    <span aria-hidden className='pointer-events-none absolute left-0 bottom-0 w-0.5 h-10 bg-accent' />
                    <span aria-hidden className='pointer-events-none absolute left-0 bottom-0 h-0.5 w-10 bg-accent' />
                    <Image 
                        className='grayscale group-hover:grayscale-0 transition-[filter] duration-300 border border-foreground-muted rounded-sm w-32 h-32 sm:w-40 sm:h-40'
                        src={'/alex_photo.jpg'}
                        alt={'Profile Picture'}
                        width={160}
                        height={160}
                        sizes='(max-width: 640px) 128px, 160px'
                        quality={90}
                    />
                </div>
                <div className='flex flex-col gap-2'>
                    <p className='font-mono tracking-widest text-accent font-medium'>PROFILE</p>
                    <p className='text-foreground font-semibold font-sans text-2xl md:text-3xl'>Building robust<br/>digital solutions.</p>
                </div>
            </div>
            <div className='flex flex-col gap-4'>
                <p className='text-foreground-muted font-medium font-sans'>Après un parcours en classe préparatoire CPGE, je me suis orienté vers le développement web en autodidacte afin de transformer mon intérêt pour la programmation en véritable projet professionnel.</p>
                <p className='text-foreground-muted font-medium font-sans'>Au fil de ma formation, j&apos;ai développé mes compétences grâce à des plateformes comme Scrimba et Frontend Mentor, en réalisant de nombreux projets personnels en Front-End et Full-Stack. J&apos;y ai notamment utilisé des technologies telles que React, Next.js, Node.js, Express, TypeScript, PostgreSQL et Supabase, tout en approfondissant les bonnes pratiques de développement, de conception d&apos;interfaces et d&apos;architecture d&apos;applications.</p>
                <p className='text-foreground-muted font-medium font-sans'>Aujourd&apos;hui, je poursuis un Bachelor Développement Web à l&apos;EEMI en alternance afin de consolider mon expérience en entreprise et de contribuer à des projets concrets. Curieux, rigoureux et toujours désireux d&apos;apprendre, je souhaite continuer à développer mes compétences aux côtés d&apos;une équipe passionnée.</p>
            </div>
        </div>
        <div className='flex flex-col sm:flex-row lg:flex-col gap-4 flex-2'>
            <div className='group flex flex-col gap-4 flex-1 relative p-4 justify-center pl-6 rounded-lg border border-[rgba(255,255,255,0.1)] bg-[#35353550] hover:border-[#FF4F0080] transition-all duration-300 min-h-32'>
                <div className='flex flex-col gap-1'>
                    <p className='text-accent text-4xl font-medium font-sans'>30+</p>
                    <p className='text-foreground-muted text-sm font-extrabold tracking-tight font-mono opacity-80'>PROJECTS BUILT</p>
                </div>
                <RocketIcon className='absolute bottom-6 right-6 text-accent/20 transition-colors duration-300 group-hover:text-accent'/>
            </div>
            <div className='group flex flex-col gap-4 flex-1 relative p-4 pl-6 justify-center rounded-lg border border-[rgba(255,255,255,0.1)] bg-[#35353550] hover:border-[#FF4F0080] transition-all duration-300 min-h-32'>
                <div className='flex flex-col gap-1'>
                    <p className='text-accent text-4xl font-medium font-sans'>2y+</p>
                    <p className='text-foreground-muted text-sm font-extrabold tracking-tight font-mono opacity-80'>LEARNING CODE</p>
                </div>
                <TerminalIcon className='absolute bottom-6 right-6 text-accent/20 transition-colors duration-300 group-hover:text-accent'/>
            </div>
        </div>
    </div>
  )
}

export default Bio
