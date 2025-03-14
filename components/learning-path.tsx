"use client"

import React, { useState, useEffect } from "react"
import { CheckCircle, Circle } from "lucide-react"

interface LearningPathProps {
  progress: {
    completedChallenges: number[]
    unlockedModules: number[]
    currentModule: number
    currentLesson: number
    totalChallenges: number
  }
  onModuleChange: (moduleIndex: number, lessonIndex?: number) => void
}

export function LearningPath({ progress, onModuleChange }: LearningPathProps) {
  const modules = [
    {
      title: "Docker Basics",
      completed:
        progress.completedChallenges.includes(0) &&
        progress.completedChallenges.includes(1) &&
        progress.completedChallenges.includes(2),
      lessons: [
        {
          title: "Introduction to Docker",
          description: "Learn what Docker is and why it's useful for developers and operations teams.",
          challengeId: 0,
        },
        {
          title: "Docker Architecture",
          description: "Understand the client-server architecture of Docker and how containers work.",
          challengeId: 1,
        },
        {
          title: "Installing Docker",
          description: "Learn how to install Docker on different operating systems.",
          challengeId: 2,
        },
        {
          title: "Docker CLI Basics",
          description: "Get familiar with the basic Docker command line interface commands.",
          challengeId: 3,
        },
      ],
    },
    {
      title: "Working with Containers",
      completed:
        progress.completedChallenges.includes(3) &&
        progress.completedChallenges.includes(4) &&
        progress.completedChallenges.includes(5),
      lessons: [
        {
          title: "Running Containers",
          description: "Learn how to run containers from images and understand container lifecycle.",
          challengeId: 4,
        },
        {
          title: "Container Lifecycle",
          description: "Understand how to start, stop, restart, and remove containers.",
          challengeId: 5,
        },
        {
          title: "Container Networking",
          description: "Learn how containers communicate with each other and the outside world.",
          challengeId: 6,
        },
        {
          title: "Container Storage",
          description: "Understand how to persist data with Docker volumes and bind mounts.",
          challengeId: 7,
        },
      ],
    },
    {
      title: "Managing Images",
      completed:
        progress.completedChallenges.includes(6) &&
        progress.completedChallenges.includes(7) &&
        progress.completedChallenges.includes(8),
      lessons: [
        {
          title: "Pulling Images",
          description: "Learn how to download Docker images from registries like Docker Hub.",
          challengeId: 8,
        },
        {
          title: "Building Images",
          description: "Understand how to create your own Docker images with Dockerfiles.",
          challengeId: 9,
        },
        {
          title: "Dockerfile Syntax",
          description: "Learn the syntax and best practices for writing Dockerfiles.",
          challengeId: 10,
        },
        {
          title: "Image Optimization",
          description: "Discover techniques to make your Docker images smaller and more efficient.",
          challengeId: 11,
        },
      ],
    },
    {
      title: "Docker Compose",
      completed:
        progress.completedChallenges.includes(9) &&
        progress.completedChallenges.includes(10) &&
        progress.completedChallenges.includes(11),
      lessons: [
        {
          title: "Compose File Syntax",
          description: "Learn the structure and syntax of docker-compose.yml files.",
          challengeId: 12,
        },
        {
          title: "Multi-container Apps",
          description: "Understand how to define and run multi-container applications.",
          challengeId: 13,
        },
        {
          title: "Environment Variables",
          description: "Learn how to use environment variables in Docker Compose.",
          challengeId: 14,
        },
        {
          title: "Compose Networks",
          description: "Understand networking between containers in Docker Compose.",
          challengeId: 15,
        },
      ],
    },
  ]

  const [expandedModule, setExpandedModule] = useState<number | null>(progress.currentModule)
  const [selectedLesson, setSelectedLesson] = useState<{ moduleIndex: number; lessonIndex: number }>({
    moduleIndex: progress.currentModule,
    lessonIndex: progress.currentLesson,
  })

  // Update expanded module when progress changes
  useEffect(() => {
    setExpandedModule(progress.currentModule)
    setSelectedLesson({
      moduleIndex: progress.currentModule,
      lessonIndex: progress.currentLesson,
    })
  }, [progress.currentModule, progress.currentLesson])

  const toggleModule = (index: number) => {
    if (expandedModule === index) {
      setExpandedModule(null)
    } else {
      setExpandedModule(index)
      onModuleChange(index)
    }
  }

  const startLesson = (moduleIndex: number, lessonIndex: number) => {
    setSelectedLesson({ moduleIndex, lessonIndex })
    onModuleChange(moduleIndex, lessonIndex)
  }

  const isModuleCompleted = (module: { lessons: { challengeId: number }[] }) => {
    return module.lessons.every((lesson: { challengeId: number }) => progress.completedChallenges.includes(lesson.challengeId))
  }

  return (
    <div id="learning-path" className="rounded-lg border border-slate-700 bg-slate-800 p-4">
      <h3 className="mb-4 text-lg font-bold">Learning Path</h3>

      <div className="space-y-3">
        {modules.map((module, index) => (
          <div key={index} className="rounded-lg border border-slate-600">
            <button
              className={`flex w-full items-center justify-between rounded-t-lg p-3 text-left ${
                progress.currentModule === index
                  ? "bg-blue-600"
                  : "bg-slate-700 hover:bg-slate-600"
              }`}
              onClick={() => toggleModule(index)}
            >
              <div className="flex items-center gap-3">
                {isModuleCompleted(module) ? (
                  <CheckCircle className="h-5 w-5 text-green-400" />
                ) : (
                  <Circle className="h-5 w-5 text-slate-400" />
                )}
                <span>{module.title}</span>
              </div>
              <span className="text-xs font-medium">{expandedModule === index ? "Collapse" : "Expand"}</span>
            </button>

            {expandedModule === index && (
              <div className="p-2">
                {module.lessons.map((lesson, lessonIndex) => (
                  <button
                    key={lessonIndex}
                    className={`flex w-full items-center gap-2 rounded p-2 text-left text-sm ${
                      selectedLesson.moduleIndex === index && selectedLesson.lessonIndex === lessonIndex
                        ? "bg-blue-500/20 text-blue-300"
                        : "hover:bg-slate-700"
                    }`}
                    onClick={() => startLesson(index, lessonIndex)}
                  >
                    {selectedLesson.moduleIndex === index && selectedLesson.lessonIndex === lessonIndex ? (
                      <CheckCircle className="h-3 w-3 text-blue-400" />
                    ) : (
                      <Circle className="h-3 w-3 text-slate-400" />
                    )}
                    {lesson.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

