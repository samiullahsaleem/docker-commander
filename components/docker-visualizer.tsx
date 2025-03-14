"use client"

import { useState, useEffect } from "react"
import { Box, Layers, Server, RefreshCw } from "lucide-react"

interface DockerVisualizerProps {
  dockerState?: {
    containers: any[]
    images: any[]
  }
}

export function DockerVisualizer({ dockerState }: DockerVisualizerProps) {
  const [activeTab, setActiveTab] = useState<"containers" | "images" | "networks">("containers")
  const [containers, setContainers] = useState<any[]>(dockerState?.containers || [])
  const [images, setImages] = useState<any[]>(
    dockerState?.images || [
      { id: "9c7a54a9a43c", repository: "hello-world", tag: "latest", size: "13.3kB", created: "3 months ago" },
      { id: "a6bd71f48f68", repository: "nginx", tag: "latest", size: "187MB", created: "3 months ago" },
    ],
  )

  // Update state if dockerState changes
  useEffect(() => {
    if (dockerState) {
      if (dockerState.containers) {
        setContainers(dockerState.containers)
      }
      if (dockerState.images) {
        setImages(dockerState.images)
      }
    }
  }, [dockerState])

  // Listen for Docker state changes from Terminal
  useEffect(() => {
    const handleStateChange = (event: any) => {
      if (event.detail.containers) {
        setContainers(event.detail.containers)
      }
      if (event.detail.images) {
        setImages(event.detail.images)
      }
    }

    window.addEventListener("dockerStateChanged", handleStateChange)
    return () => {
      window.removeEventListener("dockerStateChanged", handleStateChange)
    }
  }, [])

  const runExampleContainer = () => {
    // More reliable way to execute a command in the terminal
    try {
      // Find the terminal input
      const terminalInput = document.querySelector('input[type="text"]') as HTMLInputElement
      if (terminalInput) {
        // Set the value and trigger input event
        terminalInput.value = "docker run hello-world"
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
        console.error("Terminal input not found")

        // Fallback: Dispatch a custom event that the terminal can listen for
        const event = new CustomEvent("runDockerCommand", {
          detail: { command: "docker run hello-world" },
        })
        window.dispatchEvent(event)
      }
    } catch (error) {
      console.error("Error running example container:", error)
    }
  }

  return (
    <div className="rounded-lg border border-slate-700 bg-slate-800 p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold">Docker Visualizer</h3>
        <button
          className="flex items-center gap-1 rounded bg-slate-700 px-2 py-1 text-xs hover:bg-slate-600"
          onClick={() => {
            // Force refresh visualization
            const event = new Event("dockerStateChanged")
            window.dispatchEvent(event)
          }}
        >
          <RefreshCw className="h-3 w-3" />
          Refresh
        </button>
      </div>

      <div className="mb-4 flex border-b border-slate-700">
        <button
          className={`flex items-center gap-2 px-4 py-2 ${activeTab === "containers" ? "border-b-2 border-blue-500 text-blue-400" : "text-slate-400"}`}
          onClick={() => setActiveTab("containers")}
        >
          <Box className="h-4 w-4" />
          Containers
        </button>
        <button
          className={`flex items-center gap-2 px-4 py-2 ${activeTab === "images" ? "border-b-2 border-blue-500 text-blue-400" : "text-slate-400"}`}
          onClick={() => setActiveTab("images")}
        >
          <Layers className="h-4 w-4" />
          Images
        </button>
        <button
          className={`flex items-center gap-2 px-4 py-2 ${activeTab === "networks" ? "border-b-2 border-blue-500 text-blue-400" : "text-slate-400"}`}
          onClick={() => setActiveTab("networks")}
        >
          <Server className="h-4 w-4" />
          Networks
        </button>
      </div>

      <div className="h-64 overflow-y-auto">
        {activeTab === "containers" && (
          <div>
            {containers.length > 0 ? (
              <div className="space-y-2">
                {containers.map((container, index) => (
                  <div key={index} className="flex items-center justify-between rounded bg-slate-700 p-3">
                    <div className="flex items-center gap-2">
                      <Box
                        className={`h-5 w-5 ${container.status === "running" ? "text-green-400" : "text-slate-400"}`}
                      />
                      <div>
                        <p className="font-medium">{container.name}</p>
                        <p className="text-xs text-slate-400">{container.image}</p>
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <p className={container.status === "running" ? "text-green-400" : "text-slate-400"}>
                        {container.status}
                      </p>
                      <p className="text-xs text-slate-400">{container.id.substring(0, 12)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center">
                <div className="mb-4 text-center text-slate-400">
                  <Box className="mx-auto mb-2 h-12 w-12 text-slate-500" />
                  <p>No containers running</p>
                  <p className="text-sm">Use the terminal to start containers</p>
                </div>
                <button
                  className="rounded bg-blue-600 px-3 py-1 text-sm hover:bg-blue-700"
                  onClick={runExampleContainer}
                >
                  Run Example Container
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === "images" && (
          <div className="space-y-2">
            {images.map((image, index) => (
              <div key={index} className="flex items-center justify-between rounded bg-slate-700 p-3">
                <div className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-blue-400" />
                  <div>
                    <p className="font-medium">{image.repository}</p>
                    <p className="text-xs text-slate-400">{image.tag}</p>
                  </div>
                </div>
                <div className="text-right text-sm">
                  <p>{image.size}</p>
                  <p className="text-xs text-slate-400">{image.created}</p>
                </div>
              </div>
            ))}

            {images.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center text-slate-400">
                <Layers className="mx-auto mb-2 h-12 w-12 text-slate-500" />
                <p>No images available</p>
                <p className="text-sm">Use 'docker pull' to get images</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "networks" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between rounded bg-slate-700 p-3">
              <div className="flex items-center gap-2">
                <Server className="h-5 w-5 text-blue-400" />
                <div>
                  <p className="font-medium">bridge</p>
                  <p className="text-xs text-slate-400">bridge</p>
                </div>
              </div>
              <div className="text-right text-sm">
                <p>local</p>
                <p className="text-xs text-slate-400">f2d74a2ec4bf</p>
              </div>
            </div>

            <div className="flex items-center justify-between rounded bg-slate-700 p-3">
              <div className="flex items-center gap-2">
                <Server className="h-5 w-5 text-blue-400" />
                <div>
                  <p className="font-medium">host</p>
                  <p className="text-xs text-slate-400">host</p>
                </div>
              </div>
              <div className="text-right text-sm">
                <p>local</p>
                <p className="text-xs text-slate-400">69bb21378df5</p>
              </div>
            </div>

            <div className="flex items-center justify-between rounded bg-slate-700 p-3">
              <div className="flex items-center gap-2">
                <Server className="h-5 w-5 text-blue-400" />
                <div>
                  <p className="font-medium">none</p>
                  <p className="text-xs text-slate-400">null</p>
                </div>
              </div>
              <div className="text-right text-sm">
                <p>local</p>
                <p className="text-xs text-slate-400">c4c1c8e21a3a</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

