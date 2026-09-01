// client/src/components/home/Carousel.jsx

import { useEffect, useState } from 'react'

// crossfading image carousel, autoplays and pauses on hover
export function Carousel({ images, intervalMs = 5000, className = 'carousel' }) {
  const [index, setIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  // autoplay
  useEffect(() => {
    if (isPaused || images.length < 2) return
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % images.length)
    }, intervalMs)
    return () => clearInterval(timer)
  }, [isPaused, images.length, intervalMs])

  return (
    <div
      className={className}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {images.map((image, imageIndex) => (
        <img
          key={image.src}
          src={image.src}
          alt={image.alt}
          className="carousel-slide"
          style={{ opacity: imageIndex === index ? 1 : 0 }}
        />
      ))}

      <div className="carousel-dots">
        {images.map((image, dotIndex) => (
          <button
            key={image.src}
            type="button"
            className={dotIndex === index ? 'carousel-dot is-active' : 'carousel-dot'}
            aria-label={`Show slide ${dotIndex + 1}`}
            onClick={() => setIndex(dotIndex)}
          />
        ))}
      </div>
    </div>
  )
}
