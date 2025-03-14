"use client"

import { useState } from "react"
import { Search, Copy, Check, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { dockerCommands } from "@/lib/docker-commands"
import { Footer } from "@/components/footer"

export default function DockerCommandGuidePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null)

  // Get unique categories
  const categories = Array.from(new Set(dockerCommands.map((cmd) => cmd.category)))

  // Filter commands by search term and category
  const filteredCommands = dockerCommands.filter(
    (cmd) =>
      (cmd.command.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cmd.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (activeCategory === null || cmd.category === activeCategory),
  )

  const copyToClipboard = (command: string) => {
    // Copy to clipboard
    navigator.clipboard.writeText(command).catch((err) => {
      console.error("Could not copy text: ", err)
    })

    setCopiedCommand(command)
    setTimeout(() => setCopiedCommand(null), 2000)
  }

  const executeCommand = (command: string) => {
    // Store the command in localStorage so it can be executed when we return to the main page
    localStorage.setItem("pendingCommand", command)

    // Navigate back to main page
    window.location.href = "/"
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

          <Link href="/" className="text-slate-300 hover:text-white flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto flex-grow px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Docker Command Guide</h2>
          <p className="text-slate-300 mb-8">
            A comprehensive reference of Docker commands, their usage, and examples. Search for commands or filter by
            category to find what you need.
          </p>

          <div className="mb-4 flex items-center rounded-md border border-slate-600 bg-slate-700 px-3 py-2">
            <Search className="mr-2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search commands..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="mb-6 flex flex-wrap gap-2">
            <button
              className={`rounded-full px-3 py-1 text-xs ${activeCategory === null ? "bg-blue-600 text-white" : "bg-slate-700 text-slate-300 hover:bg-slate-600"}`}
              onClick={() => setActiveCategory(null)}
            >
              All
            </button>
            {categories.map((category, index) => (
              <button
                key={index}
                className={`rounded-full px-3 py-1 text-xs capitalize ${activeCategory === category ? "bg-blue-600 text-white" : "bg-slate-700 text-slate-300 hover:bg-slate-600"}`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filteredCommands.map((cmd, index) => (
              <div key={index} className="rounded-md bg-slate-800 p-4 border border-slate-700">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <code className="font-mono text-sm font-bold text-blue-400">{cmd.command}</code>
                    <span className="rounded bg-slate-700 px-2 py-0.5 text-xs capitalize">{cmd.category}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="rounded p-1 hover:bg-slate-700 flex items-center gap-1 text-xs text-slate-300"
                      onClick={() => copyToClipboard(cmd.example)}
                      title="Copy to clipboard"
                    >
                      {copiedCommand === cmd.example ? (
                        <>
                          <Check className="h-4 w-4 text-green-400" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 text-slate-400" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                    <button
                      className="rounded bg-blue-600 px-2 py-1 text-xs hover:bg-blue-700 flex items-center gap-1"
                      onClick={() => executeCommand(cmd.example)}
                      title="Run in terminal"
                    >
                      <span>Try It</span>
                    </button>
                  </div>
                </div>
                <p className="mb-2 text-sm text-slate-300">{cmd.description}</p>
                <code className="block rounded bg-slate-900 p-2 text-xs text-slate-300">{cmd.example}</code>
              </div>
            ))}

            {filteredCommands.length === 0 && (
              <div className="flex h-40 flex-col items-center justify-center text-slate-400 bg-slate-800 rounded-lg border border-slate-700">
                <p>No commands found</p>
                <p className="text-sm">Try a different search term</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

