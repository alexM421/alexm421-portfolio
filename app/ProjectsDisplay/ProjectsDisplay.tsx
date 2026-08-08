import React from 'react'
import CursorGlow from '../CursorGlow/CursorGlow'
import ProjectsDisplayItem, { ProjectsDisplayItemType } from './ProjectsDisplayItem'

const ProjectsDisplay = () => {

  const projects: ProjectsDisplayItemType[]  = [
    {
      reversed: true,
      img: {
          src: '/audio-e-commerce.jpg',
          alt: 'Audio e-commerce site photo'
      },
      category: 'E-COMMERCE / WEB',
      title: 'Audio E-Commerce Webapp',
      itemDesc: 'Site e-commerce audio responsive développé avec React, proposant des pages produits, un panier d\'achat et une expérience utilisateur fluide sur tous les appareils.',
      links: {
          live: 'https://adorable-pavlova-0b0386.netlify.app/',
          code: 'https://github.com/alexM421/fm-audio-e-commerce/tree/remake'
      }
    },
    {
      reversed: false,
      img: {
        src: '/personnal-finance-app.png',
        alt: 'Personnal finance app site photo'
      },
      category: 'FINANCE / WEBAPP',
      title: 'Personnal Finance App',
      itemDesc: 'Application de gestion des finances personnelles permettant de suivre ses revenus, ses dépenses et ses objectifs d\'épargne à travers un tableau de bord intuitif et une interface épurée.',
      links: {
        live: 'https://dreamy-cocada-535ced.netlify.app/overview',
        code: 'https://github.com/alexM421/fm-personal-finance-app-remake'
      }
    },
    {
      reversed: true,
      img: {
        src: '/flashcard-app.jpg',
        alt: 'Flashcard app site photo'
      },
      category: 'API / SUPABASE',
      title: 'Flashcard App',
      itemDesc: 'Application de flashcards responsive avec authentification anonyme. Les cartes sont stockées avec Supabase et accessibles via une API backend développée avec Express.',
      links: {
        live: 'https://bright-daifuku-350dd2.netlify.app/',
        code: 'https://github.com/alexM421/fm-flashcard-app'
      }
    }
  ]

  return (
    <div className='relative overflow-hidden flex bg-black justify-center' id='work'>
      <CursorGlow />
      <div className='relative z-10 flex flex-col p-10 py-20 w-full max-w-400'>
          <div className='flex flex-col mb-16'>
              <p className='text-accent font-medium font-mono tracking-wide'>SELECTED WORKS</p>
              <p className='text-foreground font-bold text-5xl'>PROJETS</p>
          </div>
          <div className='flex flex-col gap-64 justify-center'>
              {projects.map((project, index) => 
                  <ProjectsDisplayItem {...project} key={project.title} priority={index === 0} /> 
              )}
          </div>
      </div>
    </div>
  )
}

export default ProjectsDisplay
