"use client"

import { X } from "lucide-react"

interface CommandExplanationProps {
  command: string
  explanation: string
  examples: string[]
  onClose: () => void
}

export function CommandExplanation({ command, explanation, examples, onClose }: CommandExplanationProps) {
  // Function to execute a command in the terminal
  const executeCommand = (cmd: string) => {
    try {
      // Find the terminal input
      const terminalInput = document.querySelector('input[type="text"]') as HTMLInputElement
      if (terminalInput) {
        // Set the value and trigger input event
        terminalInput.value = cmd
        terminalInput.dispatchEvent(new Event("input", { bubbles: true }))

        // Focus the input
        terminalInput.focus()

        // Find the form and submit it
        const form = terminalInput.closest("form")
        if (form) {
          // Use a slight delay to ensure the input value is set
          setTimeout(() => {
            form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }))
          }, 50)
        } else {
          // Alternative approach if form isn't found
          const submitEvent = new KeyboardEvent("keydown", {
            key: "Enter",
            code: "Enter",
            keyCode: 13,
            which: 13,
            bubbles: true,
          })
          terminalInput.dispatchEvent(submitEvent)
        }
      } else {
        // Fallback: Dispatch a custom event that the terminal can listen for
        const event = new CustomEvent("runDockerCommand", {
          detail: { command: cmd },
        })
        window.dispatchEvent(event)
      }
    } catch (error) {
      console.error("Error executing command:", error)
      // Final fallback
      const event = new CustomEvent("runDockerCommand", {
        detail: { command: cmd },
      })
      window.dispatchEvent(event)
    }
  }

  return (
    <div className="rounded-lg border border-blue-600 bg-slate-800 p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-blue-400">Command Explanation</h3>
        <button onClick={onClose} className="rounded-full p-1 hover:bg-slate-700">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="mb-4">
        <code className="block rounded bg-slate-900 p-2 font-mono text-green-400">{command}</code>
      </div>

      <div className="mb-4">
        <h4 className="mb-2 font-medium">What it does:</h4>
        <p className="text-slate-300">{explanation}</p>
      </div>

      {examples.length > 0 && (
        <div>
          <h4 className="mb-2 font-medium">Examples:</h4>
          <div className="space-y-2">
            {examples.map((example, index) => (
              <div key={index} className="rounded bg-slate-900 p-2 flex justify-between items-center">
                <code className="font-mono text-sm text-slate-300">{example}</code>
                <button
                  onClick={() => executeCommand(example)}
                  className="text-xs bg-blue-600 px-2 py-1 rounded hover:bg-blue-700"
                >
                  Try
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}

