import React, { useEffect, useRef } from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'

interface MathDisplayProps {
  latex: string
  displayMode?: boolean
  className?: string
}

export const MathDisplay: React.FC<MathDisplayProps> = ({
  latex,
  displayMode = false,
  className = '',
}) => {
  const containerRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (containerRef.current && latex) {
      try {
        katex.render(latex, containerRef.current, {
          displayMode,
          throwOnError: false,
        })
      } catch (err) {
        if (containerRef.current) {
          containerRef.current.textContent = latex
        }
      }
    }
  }, [latex, displayMode])

  return <span ref={containerRef} className={`inline-block ${className}`} />
}
