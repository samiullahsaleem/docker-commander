"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Footer } from "@/components/footer"

export default function DockerWorkflowPage() {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    architecture: true,
    lifecycle: true,
    commandFlow: true,
    composeWorkflow: true,
  })

  const toggleSection = (section: string) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
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

          <Link href="/" className="text-slate-300 hover:text-white flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto flex-grow px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Docker Workflow Visualization</h2>
          <p className="text-slate-300 mb-8">
            Visual representations of Docker architecture, container lifecycle, command flow, and Docker Compose
            workflow. These diagrams will help you understand how Docker components interact with each other.
          </p>

          <div className="space-y-6">
            {/* Docker Architecture */}
            <div className="rounded-lg border border-slate-700 bg-slate-800 p-4">
              <div
                className="flex cursor-pointer items-center justify-between"
                onClick={() => toggleSection("architecture")}
              >
                <h3 className="text-lg font-bold">Docker Architecture</h3>
                {expandedSections.architecture ? (
                  <ChevronUp className="h-5 w-5 text-slate-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-slate-400" />
                )}
              </div>

              {expandedSections.architecture && (
                <div className="mt-4">
                  <div className="rounded bg-slate-900 p-4">
                    <pre className="text-xs text-slate-300">
                      {`┌─────────────────────────────────────────────────────────┐
│                     Docker Host                         │
│                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │ Container 1 │  │ Container 2 │  │ Container 3 │     │
│  │             │  │             │  │             │     │
│  │ App A       │  │ App B       │  │ App C       │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
│         │               │               │               │
│         └───────────────┼───────────────┘               │
│                         │                               │
│                  ┌──────────────┐                       │
│                  │ Docker Engine│                       │
│                  └──────────────┘                       │
│                         │                               │
└─────────────────────────┼───────────────────────────────┘
                         │
                 ┌───────────────┐
                 │ Docker Client │
                 └───────────────┘`}
                    </pre>
                  </div>
                  <div className="mt-4 text-sm text-slate-300">
                    <p>
                      <strong>Docker Client:</strong> The command-line interface that allows users to interact with
                      Docker.
                    </p>
                    <p>
                      <strong>Docker Host:</strong> The machine where Docker Engine runs.
                    </p>
                    <p>
                      <strong>Docker Engine:</strong> The core of Docker that creates and manages containers.
                    </p>
                    <p>
                      <strong>Containers:</strong> Isolated environments that run applications.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Container Lifecycle */}
            <div className="rounded-lg border border-slate-700 bg-slate-800 p-4">
              <div
                className="flex cursor-pointer items-center justify-between"
                onClick={() => toggleSection("lifecycle")}
              >
                <h3 className="text-lg font-bold">Container Lifecycle</h3>
                {expandedSections.lifecycle ? (
                  <ChevronUp className="h-5 w-5 text-slate-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-slate-400" />
                )}
              </div>

              {expandedSections.lifecycle && (
                <div className="mt-4">
                  <div className="rounded bg-slate-900 p-4">
                    <pre className="text-xs text-slate-300">
                      {`┌─────────┐     ┌─────────┐     ┌─────────┐
│ Created │────▶│ Running │────▶│ Stopped │
└─────────┘     └─────────┘     └─────────┘
    │                               │
    │                               │
    │                               ▼
    │                          ┌─────────┐
    └─────────────────────────▶│ Removed │
                               └─────────┘

Commands:
- Create: docker create
- Start:  docker start, docker run
- Stop:   docker stop, docker pause
- Remove: docker rm`}
                    </pre>
                  </div>
                  <div className="mt-4 text-sm text-slate-300">
                    <p>
                      <strong>Created:</strong> Container is created but not started.
                    </p>
                    <p>
                      <strong>Running:</strong> Container is running with all processes active.
                    </p>
                    <p>
                      <strong>Stopped:</strong> Container is stopped but still exists.
                    </p>
                    <p>
                      <strong>Removed:</strong> Container is deleted and no longer exists.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Docker Command Flow */}
            <div className="rounded-lg border border-slate-700 bg-slate-800 p-4">
              <div
                className="flex cursor-pointer items-center justify-between"
                onClick={() => toggleSection("commandFlow")}
              >
                <h3 className="text-lg font-bold">Docker Command Flow</h3>
                {expandedSections.commandFlow ? (
                  <ChevronUp className="h-5 w-5 text-slate-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-slate-400" />
                )}
              </div>

              {expandedSections.commandFlow && (
                <div className="mt-4">
                  <div className="rounded bg-slate-900 p-4">
                    <pre className="text-xs text-slate-300">
                      {`┌───────────────┐     ┌───────────────┐     ┌───────────────┐
│ docker build  │────▶│  docker push  │────▶│  docker pull  │
│ Create image  │     │ Share image   │     │ Download image│
└───────────────┘     └───────────────┘     └───────────────┘
                                                   │
                                                   ▼
┌───────────────┐     ┌───────────────┐     ┌───────────────┐
│  docker rm    │◀────│  docker stop  │◀────│  docker run   │
│ Remove        │     │ Stop container│     │ Create & start│
└───────────────┘     └───────────────┘     └───────────────┘`}
                    </pre>
                  </div>
                  <div className="mt-4 text-sm text-slate-300">
                    <p>
                      <strong>docker build:</strong> Creates a Docker image from a Dockerfile.
                    </p>
                    <p>
                      <strong>docker push:</strong> Uploads an image to a registry (like Docker Hub).
                    </p>
                    <p>
                      <strong>docker pull:</strong> Downloads an image from a registry.
                    </p>
                    <p>
                      <strong>docker run:</strong> Creates and starts a container from an image.
                    </p>
                    <p>
                      <strong>docker stop:</strong> Stops a running container.
                    </p>
                    <p>
                      <strong>docker rm:</strong> Removes a stopped container.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Docker Compose Workflow */}
            <div className="rounded-lg border border-slate-700 bg-slate-800 p-4">
              <div
                className="flex cursor-pointer items-center justify-between"
                onClick={() => toggleSection("composeWorkflow")}
              >
                <h3 className="text-lg font-bold">Docker Compose Workflow</h3>
                {expandedSections.composeWorkflow ? (
                  <ChevronUp className="h-5 w-5 text-slate-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-slate-400" />
                )}
              </div>

              {expandedSections.composeWorkflow && (
                <div className="mt-4">
                  <div className="rounded bg-slate-900 p-4">
                    <pre className="text-xs text-slate-300">
                      {`┌─────────────────────┐
│ docker-compose.yml  │
└─────────────────────┘
          │
          ▼
┌─────────────────────┐     ┌─────────────────────┐
│ docker-compose up   │────▶│ docker-compose down │
│ Create & start all  │     │ Stop & remove all   │
└─────────────────────┘     └─────────────────────┘
          │
          ▼
┌─────────────────────┐
│ docker-compose logs │
│ View container logs │
└─────────────────────┘`}
                    </pre>
                  </div>
                  <div className="mt-4 text-sm text-slate-300">
                    <p>
                      <strong>docker-compose.yml:</strong> Configuration file that defines services, networks, and
                      volumes.
                    </p>
                    <p>
                      <strong>docker-compose up:</strong> Creates and starts all services defined in the compose file.
                    </p>
                    <p>
                      <strong>docker-compose down:</strong> Stops and removes all resources created by docker-compose
                      up.
                    </p>
                    <p>
                      <strong>docker-compose logs:</strong> Views output from containers.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

