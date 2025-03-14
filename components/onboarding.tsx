"use client"

import { useState } from "react"
import { ArrowRight, Container, Layers, GitBranch, Server } from "lucide-react"

interface OnboardingProps {
  onGetStarted: () => void
}

export function Onboarding({ onGetStarted }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    {
      title: "Welcome to Docker Command Quest!",
      description:
        "Learn Docker through interactive challenges and hands-on practice. This tool will help you understand Docker concepts and master essential commands.",
      image: <Container className="h-24 w-24 text-blue-400" />,
    },
    {
      title: "What is Docker?",
      description:
        "Docker is a platform that uses containerization to make it easier to create, deploy, and run applications. Containers allow developers to package up an application with all the parts it needs and ship it as one package.",
      image: <Layers className="h-24 w-24 text-blue-400" />,
    },
    {
      title: "Why Learn Docker?",
      description:
        "Docker has become an essential tool in modern software development. It ensures consistency across multiple development, testing, and production environments, simplifies configuration, and speeds up deployment.",
      image: <GitBranch className="h-24 w-24 text-blue-400" />,
    },
    {
      title: "How This Tool Works",
      description:
        "You'll learn through a combination of guided lessons, practical challenges, and a real Docker terminal simulator. Complete challenges to unlock new modules and track your progress as you become a Docker expert!",
      image: <Server className="h-24 w-24 text-blue-400" />,
    },
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onGetStarted()
    }
  }

  return (
    <div className="mx-auto max-w-3xl rounded-lg bg-slate-800 p-8 shadow-lg">
      <div className="mb-8 flex flex-col items-center justify-center">
        {steps[currentStep].image}
        <h2 className="mt-6 text-center text-3xl font-bold">{steps[currentStep].title}</h2>
        <p className="mt-4 text-center text-lg text-slate-300">{steps[currentStep].description}</p>
      </div>

      <div className="mb-8 flex justify-center">
        {steps.map((_, index) => (
          <button
            key={index}
            className={`mx-1 h-2 w-2 rounded-full ${index === currentStep ? "bg-blue-500" : "bg-slate-600"}`}
            onClick={() => setCurrentStep(index)}
          />
        ))}
      </div>

      <div className="flex justify-center">
        {currentStep > 0 && (
          <button
            className="mr-4 rounded border border-slate-600 px-6 py-2 font-medium hover:bg-slate-700"
            onClick={() => setCurrentStep(currentStep - 1)}
          >
            Back
          </button>
        )}

        <button
          className="flex items-center gap-2 rounded bg-blue-600 px-6 py-2 font-medium hover:bg-blue-700"
          onClick={handleNext}
        >
          {currentStep < steps.length - 1 ? "Next" : "Get Started"}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

