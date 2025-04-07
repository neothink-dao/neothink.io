"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import Image from "next/image"
import { cn } from "@/lib/utils"

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()
  const [step, setStep] = useState(1)
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [personalInfo, setPersonalInfo] = useState({
    fullName: "",
    bio: "",
    interests: [] as string[]
  })
  const [isLoading, setIsLoading] = useState(false)

  // Platform options
  const platforms = [
    {
      id: "ascenders",
      name: "Ascenders",
      description: "Prosperity and wealth creation",
      icon: "/icons/ascenders.svg",
      color: "bg-amber-500"
    },
    {
      id: "neothinkers",
      name: "Neothinkers",
      description: "Happiness and integrated thinking",
      icon: "/icons/neothinkers.svg",
      color: "bg-blue-500"
    },
    {
      id: "immortals",
      name: "Immortals",
      description: "Health and longevity",
      icon: "/icons/immortals.svg",
      color: "bg-green-500"
    }
  ]

  // Interest options
  const interests = [
    "Business", "Finance", "Health", "Longevity", "Philosophy",
    "Personal Development", "Technology", "Creativity", "Community"
  ]

  const handleSelectPlatform = (platformId: string) => {
    setSelectedPlatforms(prev => {
      if (prev.includes(platformId)) {
        return prev.filter(id => id !== platformId)
      } else {
        return [...prev, platformId]
      }
    })
  }

  const handleSelectInterest = (interest: string) => {
    setPersonalInfo(prev => {
      const currentInterests = prev.interests
      if (currentInterests.includes(interest)) {
        return {
          ...prev,
          interests: currentInterests.filter(i => i !== interest)
        }
      } else {
        return {
          ...prev,
          interests: [...currentInterests, interest]
        }
      }
    })
  }

  const handleNextStep = () => {
    setStep(prev => prev + 1)
  }

  const handlePrevStep = () => {
    setStep(prev => prev - 1)
  }

  const handleCompleteOnboarding = async () => {
    setIsLoading(true)
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error("User not found")
      }
      
      // Update user profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: personalInfo.fullName,
          bio: personalInfo.bio,
          interests: personalInfo.interests,
          platforms: selectedPlatforms,
          onboarding_completed: true
        })
        .eq('id', user.id)
      
      if (profileError) {
        throw profileError
      }
      
      // Redirect to dashboard
      router.push("/dashboard")
      
    } catch (error) {
      console.error("Error completing onboarding:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium",
              step >= 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
            )}>
              1
            </div>
            <div className={cn(
              "mx-2 h-1 w-16",
              step >= 2 ? "bg-blue-600" : "bg-gray-200"
            )} />
            <div className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium",
              step >= 2 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
            )}>
              2
            </div>
            <div className={cn(
              "mx-2 h-1 w-16",
              step >= 3 ? "bg-blue-600" : "bg-gray-200"
            )} />
            <div className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium",
              step >= 3 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
            )}>
              3
            </div>
          </div>
          <button
            onClick={() => router.push("/dashboard")}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Skip
          </button>
        </div>
        <div className="mt-2 flex justify-between text-sm text-gray-600">
          <span>Choose Platforms</span>
          <span>Personal Info</span>
          <span>Complete</span>
        </div>
      </div>

      {/* Step 1: Choose Platforms */}
      {step === 1 && (
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-2xl font-bold">Choose Your Platforms</h2>
          <p className="mb-6 text-gray-600">
            Select the platforms you'd like to participate in. You can change this later.
          </p>
          
          <div className="grid gap-4 md:grid-cols-3">
            {platforms.map((platform) => (
              <div
                key={platform.id}
                onClick={() => handleSelectPlatform(platform.id)}
                className={cn(
                  "flex cursor-pointer flex-col items-center rounded-lg border p-4 transition-all",
                  selectedPlatforms.includes(platform.id)
                    ? `border-2 border-${platform.color} shadow-md`
                    : "border-gray-200 hover:border-gray-300"
                )}
              >
                <div className={`mb-3 rounded-full ${platform.color} p-3`}>
                  <Image
                    src={platform.icon}
                    alt={platform.name}
                    width={32}
                    height={32}
                    className="h-6 w-6 text-white"
                  />
                </div>
                <h3 className="text-lg font-semibold">{platform.name}</h3>
                <p className="mt-1 text-center text-sm text-gray-600">{platform.description}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleNextStep}
              disabled={selectedPlatforms.length === 0}
              className={cn(
                "rounded-lg px-6 py-2 font-medium text-white",
                selectedPlatforms.length > 0
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-300 cursor-not-allowed"
              )}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Personal Information */}
      {step === 2 && (
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-2xl font-bold">Personal Information</h2>
          <p className="mb-6 text-gray-600">
            Tell us a bit about yourself so we can personalize your experience.
          </p>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="fullName" className="mb-1 block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={personalInfo.fullName}
                onChange={(e) => setPersonalInfo({...personalInfo, fullName: e.target.value})}
                className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter your full name"
              />
            </div>
            
            <div>
              <label htmlFor="bio" className="mb-1 block text-sm font-medium text-gray-700">
                Short Bio
              </label>
              <textarea
                id="bio"
                value={personalInfo.bio}
                onChange={(e) => setPersonalInfo({...personalInfo, bio: e.target.value})}
                className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Tell us a bit about yourself"
                rows={3}
              />
            </div>
            
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Interests
              </label>
              <div className="flex flex-wrap gap-2">
                {interests.map((interest) => (
                  <button
                    key={interest}
                    onClick={() => handleSelectInterest(interest)}
                    className={cn(
                      "rounded-full px-3 py-1 text-sm transition-colors",
                      personalInfo.interests?.includes(interest)
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    )}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex justify-between">
            <button
              onClick={handlePrevStep}
              className="rounded-lg border border-gray-300 px-6 py-2 font-medium text-gray-700 hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={handleNextStep}
              className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Completion */}
      {step === 3 && (
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h2 className="mb-2 text-2xl font-bold">You're All Set!</h2>
            <p className="mb-8 max-w-md text-gray-600">
              Thank you for completing your onboarding! We've personalized your experience based on your selections.
            </p>
            
            <div className="mb-8 w-full max-w-md">
              <h3 className="mb-2 text-sm font-medium text-gray-700">Selected Platforms</h3>
              <div className="flex flex-wrap gap-2">
                {selectedPlatforms.map((platformId) => {
                  const platform = platforms.find(p => p.id === platformId)
                  return (
                    <div
                      key={platformId}
                      className={`rounded-full ${platform?.color} px-3 py-1 text-sm text-white`}
                    >
                      {platform?.name}
                    </div>
                  )
                })}
              </div>
            </div>
            
            <button
              onClick={handleCompleteOnboarding}
              disabled={isLoading}
              className="rounded-lg bg-blue-600 px-8 py-3 font-medium text-white hover:bg-blue-700"
            >
              {isLoading ? "Saving..." : "Go to Dashboard"}
            </button>
          </div>
        </div>
      )}
    </div>
  )
} 