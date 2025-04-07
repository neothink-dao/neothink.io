"use client"

import Link from "next/link"
import Image from "next/image"

interface DashboardPlatformsProps {
  platforms: string[]
}

export function DashboardPlatforms({ platforms }: DashboardPlatformsProps) {
  const platformsData = [
    {
      id: "ascenders",
      name: "Ascenders",
      description: "Prosperity and wealth creation",
      url: "https://joinascenders.org",
      icon: "/icons/ascenders.svg",
      color: "bg-amber-500"
    },
    {
      id: "neothinkers",
      name: "Neothinkers",
      description: "Happiness and integrated thinking",
      url: "https://joinneothinkers.org",
      icon: "/icons/neothinkers.svg",
      color: "bg-blue-500"
    },
    {
      id: "immortals",
      name: "Immortals",
      description: "Health and longevity",
      url: "https://joinimmortals.org",
      icon: "/icons/immortals.svg",
      color: "bg-green-500"
    }
  ]
  
  // Filter platforms based on user access
  const availablePlatforms = platformsData.filter(platform => 
    platforms.includes(platform.id)
  )
  
  // Platforms the user doesn't have access to
  const unavailablePlatforms = platformsData.filter(platform => 
    !platforms.includes(platform.id)
  )

  if (platforms.length === 0) {
    return (
      <div className="rounded-lg bg-gray-50 p-6 text-center">
        <h3 className="mb-2 text-lg font-medium">No Platforms Selected</h3>
        <p className="mb-4 text-gray-600">
          You haven't selected any platforms yet. Visit your profile to add platforms.
        </p>
        <Link
          href="/settings/platforms"
          className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Select Platforms
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Available Platforms */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {availablePlatforms.map((platform) => (
          <Link 
            key={platform.id}
            href={platform.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center rounded-lg border bg-white p-4 transition-shadow hover:shadow-md"
          >
            <div className={`mr-4 rounded-full ${platform.color} p-3`}>
              <Image
                src={platform.icon}
                alt={platform.name}
                width={24}
                height={24}
                className="h-6 w-6"
              />
            </div>
            <div>
              <h3 className="font-medium">{platform.name}</h3>
              <p className="text-sm text-gray-600">{platform.description}</p>
            </div>
          </Link>
        ))}
      </div>
      
      {/* Unavailable Platforms */}
      {unavailablePlatforms.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-medium text-gray-500">Available Platforms</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {unavailablePlatforms.map((platform) => (
              <div 
                key={platform.id}
                className="flex items-center rounded-lg border border-dashed bg-gray-50 p-4"
              >
                <div className="mr-4 rounded-full bg-gray-200 p-3">
                  <Image
                    src={platform.icon}
                    alt={platform.name}
                    width={24}
                    height={24}
                    className="h-6 w-6 opacity-50"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-gray-600">{platform.name}</h3>
                  <p className="text-sm text-gray-500">{platform.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Link
              href="/settings/platforms"
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Add more platforms
            </Link>
          </div>
        </div>
      )}
    </div>
  )
} 