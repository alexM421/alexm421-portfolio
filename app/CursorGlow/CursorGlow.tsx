'use client'

import { useEffect, useRef } from 'react'

const CursorGlow = () => {
  const glowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const glow = glowRef.current
    const container = glow?.parentElement
    if (!glow || !container) return

    const isFinePointer = window.matchMedia('(pointer: fine)').matches
    if (!isFinePointer) {
      glow.style.display = 'none'
      return
    }

    let targetX = 0
    let targetY = 0
    let currentX = 0
    let currentY = 0
    let frameId = 0
    let visible = false

    const onMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      targetX = event.clientX - rect.left
      targetY = event.clientY - rect.top
      if (!visible) {
        visible = true
        glow.style.opacity = '1'
      }
    }

    const onLeave = () => {
      visible = false
      glow.style.opacity = '0'
    }

    const animate = () => {
      currentX += (targetX - currentX) * 0.14
      currentY += (targetY - currentY) * 0.14
      glow.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`
      frameId = requestAnimationFrame(animate)
    }

    container.addEventListener('mousemove', onMove, { passive: true })
    container.addEventListener('mouseleave', onLeave)
    frameId = requestAnimationFrame(animate)

    return () => {
      container.removeEventListener('mousemove', onMove)
      container.removeEventListener('mouseleave', onLeave)
      cancelAnimationFrame(frameId)
    }
  }, [])

  return (
    <div
      ref={glowRef}
      aria-hidden
      className='pointer-events-none absolute top-0 left-0 z-0 size-[40rem] rounded-full opacity-0 blur-3xl transition-opacity duration-500'
      style={{
        background:
          'radial-gradient(circle, color-mix(in srgb, var(--accent) 8%, transparent) 0%, transparent 70%)',
      }}
    />
  )
}

export default CursorGlow
