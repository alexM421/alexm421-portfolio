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
            className='group relative z-10 flex p-4 border rounded-xl border-[rgba(255,255,255,0.05)] gap-20 items-center hover:border-accent transition-all duration-300 hover:scale-102'
            style={{ flexDirection: reversed? 'row-reverse':'row'}}
        >
            <div className='relative aspect-[16/10] max-h-80 lg:max-h-96 xl:max-h-[28rem] flex-3 min-w-0 overflow-hidden rounded-sm border border-[rgba(255,255,255,0.1)] bg-[#0a0a0a]'>
                <div className='absolute inset-0 transition-transform duration-300 ease-out group-hover:scale-105'>
                    <Image
                        className='object-contain object-center grayscale transition-[filter,opacity] duration-300 ease-out group-hover:grayscale-0'
                        src={src}
                        alt={alt}
                        fill
                        sizes='(max-width: 768px) 100vw, 60vw'
                        quality={90}
                        priority={priority}
                    />
                </div>
            </div>
            <div className='flex flex-col gap-4 flex-2' style={{ margin: reversed? '0px 0px 0px 10px':'0px 10px 0px 0px'}}>
                <p className='text-accent font-medium font-mono'>{category}</p>
                <p className='font-sans text-3xl font-semibold text-white tracking-tight transition-colors duration-300 group-hover:text-accent'>{title}</p>
                <p className='font-sans text-lg text-foreground-muted'>{itemDesc}</p>
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