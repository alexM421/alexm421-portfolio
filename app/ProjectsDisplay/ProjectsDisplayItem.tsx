import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export type ProjectsDisplayItemType = {
    reversed: boolean,
    img: {
        src: string,
        alt: string
    },
    category: string,
    title: string,
    itemDesc: string,
    links: {
        live: string,
        code: string
    },
    priority?: boolean
}

const ProjectsDisplayItem = ({ 
    reversed,
    img,
    category,
    title,
    itemDesc,
    links,
    priority = false,
}: ProjectsDisplayItemType) => {

    const { src, alt } = img

    return (
        <div 
            className={`group relative z-10 flex flex-col lg:flex-row p-4 border rounded-xl border-[rgba(255,255,255,0.05)] gap-8 lg:gap-20 items-stretch lg:items-center hover:border-accent transition-all duration-300 lg:hover:scale-102 ${
              reversed ? 'lg:flex-row-reverse' : ''
            }`}
        >
            <div className='relative aspect-[16/10] max-h-64 sm:max-h-80 lg:max-h-96 xl:max-h-[28rem] w-full lg:flex-3 min-w-0 overflow-hidden rounded-sm border border-[rgba(255,255,255,0.1)] bg-[#0a0a0a]'>
                <div className='absolute inset-0 transition-transform duration-300 ease-out group-hover:scale-105'>
                    <Image
                        className='object-contain object-center grayscale transition-[filter,opacity] duration-300 ease-out group-hover:grayscale-0'
                        src={src}
                        alt={alt}
                        fill
                        sizes='(max-width: 1024px) 100vw, 60vw'
                        quality={90}
                        priority={priority}
                    />
                </div>
            </div>
            <div className={`flex flex-col gap-4 w-full lg:flex-2 ${reversed ? 'lg:ml-2.5' : 'lg:mr-2.5'}`}>
                <p className='text-accent font-medium font-mono'>{category}</p>
                <p className='font-sans text-2xl md:text-3xl font-semibold text-white tracking-tight transition-colors duration-300 group-hover:text-accent'>{title}</p>
                <p className='font-sans text-base md:text-lg text-foreground-muted'>{itemDesc}</p>
                <div className='flex gap-3 items-center pt-2'>
                    <Link
                        href={links.live}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='bg-accent text-[#521300] px-5 py-2.5 text-sm font-mono font-bold tracking-wide transition-[filter] duration-200 hover:brightness-110'
                    >
                        LIVE
                    </Link>
                    <Link
                        href={links.code}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='border border-[rgba(255,255,255,0.15)] text-foreground px-5 py-2.5 text-sm font-mono font-medium tracking-wide transition-colors duration-200 hover:border-accent hover:text-accent'
                    >
                        CODE
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default ProjectsDisplayItem
