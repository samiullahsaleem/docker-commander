"use client"

import { useState, useEffect } from "react"
import { Terminal } from "@/components/terminal"
import { LearningPath } from "@/components/learning-path"
import { Challenges } from "@/components/challenges"
import { CommandExplanation } from "@/components/command-explanation"
import { Onboarding } from "@/components/onboarding"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { Container, LayoutDashboard, TerminalIcon } from "lucide-react"

export default function DockerLearningGame() {
  // App state
  const [activeView, setActiveView] = useState<"welcome" | "learning">("welcome")
  const [progress, setProgress] = useLocalStorage("docker-quest-progress", {
    completedChallenges: [] as number[],
    unlockedModules: [0] as number[],
    currentModule: 0,
    currentLesson: 0,
    totalChallenges: 48, // Updated for more challenges
  })

  // Terminal state
  const [lastCommand, setLastCommand] = useState("")
  const [commandExplanation, setCommandExplanation] = useState<{
    command: string
    explanation: string
    examples: string[]
  } | null>(null)

  // Docker state
  const [dockerState, setDockerState] = useState({
    containers: [] as any[],
    images: [
      { id: "9c7a54a9a43c", repository: "hello-world", tag: "latest", size: "13.3kB", created: "3 months ago" },
      { id: "a6bd71f48f68", repository: "nginx", tag: "latest", size: "187MB", created: "3 months ago" },
    ] as any[],
  })

  // Check for pending commands from the commands page
  useEffect(() => {
    const pendingCommand = localStorage.getItem("pendingCommand")
    if (pendingCommand) {
      // Clear the pending command
      localStorage.removeItem("pendingCommand")

      // Wait for the terminal to be ready
      setTimeout(() => {
        const event = new CustomEvent("runDockerCommand", {
          detail: { command: pendingCommand },
        })
        window.dispatchEvent(event)
      }, 500)
    }
  }, [])

  // Handle command execution
  const handleCommandExecuted = (command: string, output: string, success: boolean, state: any) => {
    setLastCommand(command)

    // Update Docker state
    if (state) {
      setDockerState(state)
    }

    // Notify challenges component about command execution
    const event = new CustomEvent("commandExecuted", {
      detail: { command, output, success },
    })
    window.dispatchEvent(event)

    // Find explanation for the command
    const baseCommand =
      command.split(" ")[0] === "docker" ? command.split(" ").slice(0, 2).join(" ") : command.split(" ")[0]

    import("@/lib/command-explanations").then((module) => {
      const explanation = module.commandExplanations.find((exp) => command.startsWith(exp.command))

      if (explanation) {
        setCommandExplanation(explanation)
      }
    })
  }

  // Handle challenge completion
  const handleChallengeCompleted = (challengeIndex: number) => {
    if (!progress.completedChallenges.includes(challengeIndex)) {
      const newProgress = {
        ...progress,
        completedChallenges: [...progress.completedChallenges, challengeIndex],
      }

      // Unlock next module if all challenges in current module are completed
      const moduleIndex = Math.floor(challengeIndex / 12)
      const nextModuleIndex = moduleIndex + 1

      if (
        moduleIndex < 3 && // Only for modules 0-2
        !newProgress.unlockedModules.includes(nextModuleIndex) &&
        // Check if all challenges in the module are completed
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].every((i) =>
          newProgress.completedChallenges.includes(moduleIndex * 12 + i),
        )
      ) {
        newProgress.unlockedModules = [...newProgress.unlockedModules, nextModuleIndex]
      }

      setProgress(newProgress)
    }
  }

  // Reset progress
  const handleResetProgress = () => {
    if (confirm("Are you sure you want to reset all progress? This cannot be undone.")) {
      setProgress({
        completedChallenges: [],
        unlockedModules: [0],
        currentModule: 0,
        currentLesson: 0,
        totalChallenges: 48,
      })
    }
  }

  // Update current module/lesson
  const handleModuleChange = (moduleIndex: number, lessonIndex = 0) => {
    setProgress({
      ...progress,
      currentModule: moduleIndex,
      currentLesson: lessonIndex,
    })
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-white">
      <header className="border-b border-slate-700 bg-slate-800 px-6 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-blue-400"
            >
              <path d="M4 5h16a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" />
              <path d="M4 13h16a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1Z" />
              <path d="M6 5v16" />
            </svg>
            <h1 className="text-xl font-bold">Docker Command Quest</h1>
          </div>

          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-4">
              <Link href="/" className="text-slate-300 hover:text-white flex items-center gap-1">
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
              <Link href="/workflow" className="text-slate-300 hover:text-white flex items-center gap-1">
                <Container className="h-4 w-4" />
                <span>Workflow</span>
              </Link>
              <Link href="/commands" className="text-slate-300 hover:text-white flex items-center gap-1">
                <TerminalIcon className="h-4 w-4" />
                <span>Commands</span>
              </Link>
            </nav>

            <span className="text-sm text-slate-300">
              Progress: {progress.completedChallenges.length}/{progress.totalChallenges} Challenges
            </span>
            <button
              className="rounded bg-blue-600 px-3 py-1 text-sm font-medium hover:bg-blue-700"
              onClick={handleResetProgress}
            >
              Reset Progress
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto flex-grow px-4 py-8">
        {activeView === "welcome" ? (
          <Onboarding onGetStarted={() => setActiveView("learning")} />
        ) : (
          <>
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="col-span-2 space-y-8">
                <Terminal onCommandExecuted={handleCommandExecuted} initialDockerState={dockerState} />
                {commandExplanation && (
                  <CommandExplanation
                    command={commandExplanation.command}
                    explanation={commandExplanation.explanation}
                    examples={commandExplanation.examples}
                    onClose={() => setCommandExplanation(null)}
                  />
                )}
              </div>
              <div className="space-y-8">
                <LearningPath progress={progress} onModuleChange={handleModuleChange} />
                <Challenges
                  progress={progress}
                  onChallengeCompleted={handleChallengeCompleted}
                  currentModule={progress.currentModule}
                />
              </div>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}

