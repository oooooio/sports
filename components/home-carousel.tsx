"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const carouselImages = ["/images/carousel-1.jpg", "/images/carousel-2.jpg", "/images/carousel-3.jpg"]

export default function HomeCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselImages.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="carousel-container h-[600px] overflow-hidden relative">
      {carouselImages.map((image, index) => (
        <div
          key={index}
          className={`h-full w-full absolute inset-0 transition-opacity duration-500 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={image || "/placeholder.svg"}
            alt={`Carousel image ${index + 1}`}
            fill
            className="object-cover"
            priority={index === 0}
          />
        </div>
      ))}

      <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-2">
        {carouselImages.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full bg-white ${index === currentIndex ? "opacity-100" : "opacity-30"}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>

      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
        <div className="text-center px-6 max-w-3xl">
          <h1 className="text-5xl font-bold mb-6">Scottish Rugby Club</h1>
          <p className="text-xl mb-8">Passion, Team, Glory - Join us and experience the true spirit of rugby</p>
          <Link href="/register">
            <Button className="bg-white text-black rounded-[4px] px-8 py-3 text-lg font-semibold hover:bg-gray-200">
              Join Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
