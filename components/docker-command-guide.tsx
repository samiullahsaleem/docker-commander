"use client"

import { useState } from "react"
import { Search, Copy, Check } from "lucide-react"
import { dockerCommands } from "@/lib/docker-commands"

export function DockerCommandGuide() {
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
    // Copy to terminal instead of clipboard
    const terminalInput = document.querySelector('input[type="text"]') as HTMLInputElement
    if (terminalInput) {
      terminalInput.value = command
      terminalInput.dispatchEvent(new Event("input", { bubbles: true }))
      terminalInput.focus()
    }

    setCopiedCommand(command)
    setTimeout(() => setCopiedCommand(null), 2000)
  }

  return (
    <div id="command-guide" className="rounded-lg border border-slate-700 bg-slate-800 p-4">
      <h3 className="mb-4 text-lg font-bold">Docker Command Guide</h3>

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

      <div className="mb-4 flex flex-wrap gap-2">
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

      <div className="h-64 space-y-2 overflow-y-auto">
        {filteredCommands.map((cmd, index) => (
          <div key={index} className="rounded-md bg-slate-700 p-3">
            <div className="mb-1 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <code className="font-mono text-sm font-bold text-blue-400">{cmd.command}</code>
                <span className="rounded bg-slate-600 px-2 py-0.5 text-xs capitalize">{cmd.category}</span>
              </div>
              <button
                className="rounded p-1 hover:bg-slate-600"
                onClick={() => copyToClipboard(cmd.example)}
                title="Copy to terminal"
              >
                {copiedCommand === cmd.example ? (
                  <Check className="h-4 w-4 text-green-400" />
                ) : (
                  <Copy className="h-4 w-4 text-slate-400" />
                )}
              </button>
            </div>
            <p className="mb-1 text-sm text-slate-300">{cmd.description}</p>
            <code className="block rounded bg-slate-800 p-1 text-xs text-slate-300">{cmd.example}</code>
          </div>
        ))}

        {filteredCommands.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center text-slate-400">
            <p>No commands found</p>
            <p className="text-sm">Try a different search term</p>
          </div>
        )}
      </div>
    </div>
  )
}

