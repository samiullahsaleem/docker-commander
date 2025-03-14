"use client"

import { useState, useEffect, useRef } from "react"
import { ArrowRight, CheckCircle, HelpCircle, Award } from "lucide-react"

interface ChallengesProps {
  progress: {
    completedChallenges: number[]
    unlockedModules: number[]
    currentModule: number
    currentLesson: number
    totalChallenges: number
  }
  onChallengeCompleted: (challengeIndex: number) => void
  currentModule: number
}

export function Challenges({ progress, onChallengeCompleted, currentModule }: ChallengesProps) {
  // Expanded challenges data structure with unique challenges for each lesson
  const allChallenges: { [key: string]: { title: string; description: string; hint: string; command: string; completed: boolean; }[] } = {
    // Module 0: Docker Basics
    "0-0": [
      // Introduction to Docker
      {
        title: "Check Docker Version",
        description: "Use the terminal to check your Docker version",
        hint: "Try using the &apos;docker --version&apos; command",
        command: "docker --version",
        completed: false,
      },
      {
        title: "View Docker Info",
        description: "Display system-wide Docker information",
        hint: "The &apos;docker info&apos; command shows detailed information about your Docker installation",
        command: "docker info",
        completed: false,
      },
    ],
    "0-1": [
      // Docker Architecture
      {
        title: "Run Hello World",
        description: "Run the hello-world container to test your Docker installation",
        hint: "Use &apos;docker run hello-world&apos; to run the container",
        command: "docker run hello-world",
        completed: false,
      },
      {
        title: "List Docker Components",
        description: "Check Docker system information to see its components",
        hint: "Use &apos;docker info&apos; to see system-wide information",
        command: "docker info",
        completed: false,
      },
    ],
    "0-2": [
      // Installing Docker
      {
        title: "Verify Installation",
        description: "Verify Docker is properly installed",
        hint: "Use &apos;docker --version&apos; to check the installed version",
        command: "docker --version",
        completed: false,
      },
      {
        title: "Check Docker Compose",
        description: "Verify Docker Compose is installed",
        hint: "Use &apos;docker-compose --version&apos; to check the installed version",
        command: "docker-compose --version",
        completed: false,
      },
    ],
    "0-3": [
      // Docker CLI Basics
      {
        title: "List Docker Commands",
        description: "See available Docker commands",
        hint: "Type &apos;help&apos; to see available commands",
        command: "help",
        completed: false,
      },
      {
        title: "Run Hello World Container",
        description: "Run the hello-world container",
        hint: "Use &apos;docker run hello-world&apos; to run the container",
        command: "docker run hello-world",
        completed: false,
      },
    ],

    // Module 1: Working with Containers
    "1-0": [
      // Running Containers
      {
        title: "Run a Container",
        description: "Run a basic container",
        hint: "Use &apos;docker run hello-world&apos; to run a container",
        command: "docker run hello-world",
        completed: false,
      },
      {
        title: "Run Container in Background",
        description: "Run a container in detached mode",
        hint: "Use &apos;docker run -d nginx&apos; to run a container in the background",
        command: "docker run -d",
        completed: false,
      },
    ],
    "1-1": [
      // Container Lifecycle
      {
        title: "List Running Containers",
        description: "List all running Docker containers",
        hint: "The &apos;docker ps&apos; command shows running containers",
        command: "docker ps",
        completed: false,
      },
      {
        title: "List All Containers",
        description: "List all containers, including stopped ones",
        hint: "Use &apos;docker ps -a&apos; to see all containers",
        command: "docker ps -a",
        completed: false,
      },
    ],
    "1-2": [
      // Container Networking
      {
        title: "Run Container with Port Mapping",
        description: "Run a container and map a port",
        hint: "Use &apos;docker run -p 8080:80 nginx&apos; to map port 8080 to container port 80",
        command: "docker run -p",
        completed: false,
      },
      {
        title: "List Networks",
        description: "List Docker networks",
        hint: "Use &apos;docker network ls&apos; to list all networks",
        command: "docker network ls",
        completed: false,
      },
    ],
    "1-3": [
      // Container Storage
      {
        title: "List Volumes",
        description: "List Docker volumes",
        hint: "Use &apos;docker volume ls&apos; to list all volumes",
        command: "docker volume ls",
        completed: false,
      },
      {
        title: "Run Container with Named Volume",
        description: "Run a container with a named volume",
        hint: "Use &apos;docker run -v my-volume:/path nginx&apos; to mount a volume",
        command: "docker run -v",
        completed: false,
      },
    ],

    // Module 2: Managing Images
    "2-0": [
      // Pulling Images
      {
        title: "List Docker Images",
        description: "List all Docker images on your system",
        hint: "The &apos;docker images&apos; command shows all available images",
        command: "docker images",
        completed: false,
      },
      {
        title: "Pull an Image",
        description: "Download a Docker image from Docker Hub",
        hint: "Use &apos;docker pull ubuntu&apos; to download an image",
        command: "docker pull",
        completed: false,
      },
    ],
    "2-1": [
      // Building Images
      {
        title: "Build an Image",
        description: "Build an image from a Dockerfile",
        hint: "Use &apos;docker build -t myimage .&apos; to build an image",
        command: "docker build",
        completed: false,
      },
      {
        title: "Tag an Image",
        description: "Tag an image with a new name",
        hint: "Use &apos;docker tag nginx mynginx&apos; to create a new tag",
        command: "docker tag",
        completed: false,
      },
    ],
    "2-2": [
      // Dockerfile Syntax
      {
        title: "Remove an Image",
        description: "Remove a Docker image from your system",
        hint: "Use &apos;docker rmi nginx&apos; to remove an image",
        command: "docker rmi",
        completed: false,
      },
      {
        title: "List Image History",
        description: "View the history of an image",
        hint: "Use &apos;docker history nginx&apos; to see image layers",
        command: "docker history",
        completed: false,
      },
    ],
    "2-3": [
      // Image Optimization
      {
        title: "Check Image Size",
        description: "Check the size of Docker images",
        hint: "Use &apos;docker images&apos; to see image sizes",
        command: "docker images",
        completed: false,
      },
      {
        title: "System Disk Usage",
        description: "Check Docker disk usage",
        hint: "Use &apos;docker system df&apos; to see disk usage",
        command: "docker system df",
        completed: false,
      },
    ],

    // Module 3: Docker Compose
    "3-0": [
      // Compose File Syntax
      {
        title: "Check Compose Version",
        description: "Check your Docker Compose version",
        hint: "Use &apos;docker-compose --version&apos; to see the installed version",
        command: "docker-compose --version",
        completed: false,
      },
      {
        title: "Start Compose Services",
        description: "Start services defined in a docker-compose.yml file",
        hint: "Use &apos;docker-compose up&apos; to start all services",
        command: "docker-compose up",
        completed: false,
      },
    ],
    "3-1": [
      // Multi-container Apps
      {
        title: "List Compose Services",
        description: "List services started with Docker Compose",
        hint: "Use &apos;docker-compose ps&apos; to list services",
        command: "docker-compose ps",
        completed: false,
      },
      {
        title: "Stop Compose Services",
        description: "Stop and remove services started with docker-compose",
        hint: "Use &apos;docker-compose down&apos; to stop and remove containers",
        command: "docker-compose down",
        completed: false,
      },
    ],
    "3-2": [
      // Environment Variables
      {
        title: "View Compose Logs",
        description: "View logs from Docker Compose services",
        hint: "Use &apos;docker-compose logs&apos; to see service logs",
        command: "docker-compose logs",
        completed: false,
      },
      {
        title: "Restart Compose Services",
        description: "Restart services defined in docker-compose.yml",
        hint: "Use &apos;docker-compose restart&apos; to restart services",
        command: "docker-compose restart",
        completed: false,
      },
    ],
    "3-3": [
      // Compose Networks
      {
        title: "List Networks",
        description: "List Docker networks",
        hint: "Use &apos;docker network ls&apos; to list all networks",
        command: "docker network ls",
        completed: false,
      },
      {
        title: "Inspect Network",
        description: "Inspect a Docker network",
        hint: "Use &apos;docker network inspect bridge&apos; to inspect the default bridge network",
        command: "docker network inspect",
        completed: false,
      },
    ],
  }

  const [currentChallenge, setCurrentChallenge] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [challenges, setChallenges] = useState<any[]>([])
  const [showSuccess, setShowSuccess] = useState(false)
  const prevModuleRef = useRef(progress.currentModule)
  const prevLessonRef = useRef(progress.currentLesson)
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize challenges on first render
  useEffect(() => {
    if (!isInitialized) {
      loadChallenges()
      setIsInitialized(true)
    }
  }, [])

  // Update challenges when module or lesson changes
  useEffect(() => {
    const moduleChanged = prevModuleRef.current !== progress.currentModule
    const lessonChanged = prevLessonRef.current !== progress.currentLesson

    if (moduleChanged || lessonChanged) {
      loadChallenges()
      prevModuleRef.current = progress.currentModule
      prevLessonRef.current = progress.currentLesson
    }
  }, [progress.currentModule, progress.currentLesson])

  // Function to load challenges based on current module and lesson
  const loadChallenges = () => {
    const challengeKey = `${progress.currentModule}-${progress.currentLesson}`
    const moduleChallenges = allChallenges[challengeKey as keyof typeof allChallenges] || []

    if (moduleChallenges.length > 0) {
      const baseIndex = progress.currentModule * 12 + progress.currentLesson * 3

      const updatedChallenges = moduleChallenges.map((challenge, index) => ({
        ...challenge,
        completed: progress.completedChallenges.includes(baseIndex + index),
      }))

      setChallenges(updatedChallenges)
      setCurrentChallenge(0)
      setShowHint(false)
    } else {
      setChallenges([])
    }
  }

  // Listen for terminal commands to auto-complete challenges
  useEffect(() => {
    const checkCommand = (event: any) => {
      const command = event.detail?.command

      if (!command || challenges.length === 0) return

      const currentChallengeObj = challenges[currentChallenge]
      const baseIndex = progress.currentModule * 12 + progress.currentLesson * 3
      const globalChallengeIndex = baseIndex + currentChallenge

      if (command.startsWith(currentChallengeObj.command)) {
        if (!progress.completedChallenges.includes(globalChallengeIndex)) {
          onChallengeCompleted(globalChallengeIndex)

          // Show success message
          setShowSuccess(true)
          setTimeout(() => {
            setShowSuccess(false)
          }, 3000)

          // Update local challenge state
          const updatedChallenges = [...challenges]
          updatedChallenges[currentChallenge] = {
            ...updatedChallenges[currentChallenge],
            completed: true,
          }
          setChallenges(updatedChallenges)
        }
      }
    }

    if (typeof window !== "undefined") {
      window.addEventListener("commandExecuted", checkCommand)
      return () => {
        window.removeEventListener("commandExecuted", checkCommand)
      }
    }
  }, [challenges, currentChallenge, onChallengeCompleted])

  // Function to execute a command in the terminal
  const executeCommand = (command: string) => {
    if (typeof window !== "undefined") {
      const event = new CustomEvent("runDockerCommand", {
        detail: { command },
      })
      window.dispatchEvent(event)
    }
  }

  // If no challenges are available for this section, show a message
  if (challenges.length === 0) {
    return (
      <div className="rounded-lg border border-slate-700 bg-slate-800 p-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold">Challenges</h3>
          <span className="text-sm text-slate-400">No challenges available</span>
        </div>
        <div className="rounded-lg bg-slate-700 p-4 text-center">
          <p className="text-slate-300">No challenges available for this section.</p>
          <p className="mt-2 text-sm text-slate-400">Try selecting a different section from the learning path.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-slate-700 bg-slate-800 p-4" id="challenges-section">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold">
          Challenges for {`Module ${progress.currentModule + 1}, Lesson ${progress.currentLesson + 1}`}
        </h3>
        <span className="text-sm text-slate-400">
          {challenges.filter((c) => c.completed).length}/{challenges.length} Completed
        </span>
      </div>
      {showSuccess && (
        <div className="mb-4 rounded-lg bg-green-500/20 p-3 text-green-300">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            <p className="font-medium">Challenge completed!</p>
          </div>
          <p className="text-sm">Great job! You&apos;ve completed the challenge.</p>
        </div>
      )}

      <div className="rounded-lg bg-slate-700 p-4">
        <div className="mb-2 flex items-center justify-between">
          <h4 className="text-lg font-medium">{challenges[currentChallenge]?.title}</h4>
          {challenges[currentChallenge]?.completed && <CheckCircle className="h-5 w-5 text-green-400" />}
        </div>
        <p className="mb-4 text-sm text-slate-300">{challenges[currentChallenge]?.description}</p>

        <div className="mb-4 flex flex-col gap-4">
          <button
            className="flex items-center gap-1 text-sm bg-blue-500/20 px-3 py-1 rounded-md text-blue-300 hover:bg-blue-500/30 w-fit"
            onClick={() => setShowHint(!showHint)}
          >
            <HelpCircle className="h-4 w-4" />
            {showHint ? "Hide Hint" : "Show Hint"}
          </button>

          {showHint && (
            <div className="rounded bg-slate-600 p-3 text-sm border-l-4 border-yellow-400">
              <p className="font-medium text-yellow-300">Hint:</p>
              <p className="text-slate-200">
                {challenges[currentChallenge]?.hint || "No hint available for this challenge."}
              </p>
              <button
                className="mt-2 bg-blue-600 px-3 py-1 rounded text-white text-xs hover:bg-blue-700"
                onClick={() => {
                  if (challenges[currentChallenge]?.command) {
                    executeCommand(challenges[currentChallenge].command)
                  }
                }}
              >
                Try This Command
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex gap-2">
            {currentChallenge > 0 && (
              <button
                className="rounded border border-slate-600 px-3 py-1 text-sm hover:bg-slate-600"
                onClick={() => {
                  setCurrentChallenge(currentChallenge - 1)
                  setShowHint(false)
                }}
              >
                Previous
              </button>
            )}

            {currentChallenge < challenges.length - 1 && (
              <button
                className="flex items-center gap-1 rounded bg-blue-600 px-3 py-1 text-sm hover:bg-blue-700"
                onClick={() => {
                  setCurrentChallenge(currentChallenge + 1)
                  setShowHint(false)
                }}
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

