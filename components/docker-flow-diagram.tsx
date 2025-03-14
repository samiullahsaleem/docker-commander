"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

export function DockerFlowDiagram() {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="rounded-lg border border-slate-700 bg-slate-800 p-4">
      <div className="flex cursor-pointer items-center justify-between" onClick={() => setExpanded(!expanded)}>
        <h3 className="text-lg font-bold">Docker Workflow Visualization</h3>
        {expanded ? (
          <ChevronUp className="h-5 w-5 text-slate-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-slate-400" />
        )}
      </div>

      {expanded && (
        <div className="mt-4 space-y-6">
          <div>
            <h4 className="mb-2 font-medium">Docker Architecture</h4>
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
          </div>

          <div>
            <h4 className="mb-2 font-medium">Container Lifecycle</h4>
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
          </div>

          <div>
            <h4 className="mb-2 font-medium">Docker Command Flow</h4>
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
          </div>

          <div>
            <h4 className="mb-2 font-medium">Docker Compose Workflow</h4>
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
          </div>

          <div>
            <h4 className="mb-2 font-medium">Docker Networking</h4>
            <div className="rounded bg-slate-900 p-4">
              <pre className="text-xs text-slate-300">
                {`┌──────────────────────────┐
│ docker network create │
└──────────────────────────┘
           │
           ▼
┌──────────────────────────┐     ┌──────────────────────────┐
│ docker network connect   │────▶│ docker network disconnect│
│ Connect container to net │     │ Disconnect from network  │
└──────────────────────────┘     └──────────────────────────┘
           │
           ▼
┌──────────────────────────┐
│ docker network ls        │
│ List networks            │
└──────────────────────────┘`}
              </pre>
            </div>
          </div>

          <div>
            <h4 className="mb-2 font-medium">Docker Volume Management</h4>
            <div className="rounded bg-slate-900 p-4">
              <pre className="text-xs text-slate-300">
                {`┌──────────────────────────┐
│ docker volume create    │
└──────────────────────────┘
           │
           ▼
┌──────────────────────────┐     ┌──────────────────────────┐
│ docker volume inspect    │────▶│ docker volume rm         │
│ Inspect volume details   │     │ Remove volume            │
└──────────────────────────┘     └──────────────────────────┘
           │
           ▼
┌──────────────────────────┐
│ docker volume ls         │
│ List volumes             │
└──────────────────────────┘`}
              </pre>
            </div>
          </div>

          <div>
            <h4 className="mb-2 font-medium">Docker Swarm</h4>
            <div className="rounded bg-slate-900 p-4">
              <pre className="text-xs text-slate-300">
                {`┌──────────────────────────┐
│ docker swarm init       │
└──────────────────────────┘
           │
           ▼
┌──────────────────────────┐     ┌──────────────────────────┐
│ docker service create    │────▶│ docker service update    │
│ Create a new service     │     │ Update an existing svc   │
└──────────────────────────┘     └──────────────────────────┘
           │
           ▼
┌──────────────────────────┐     ┌──────────────────────────┐
│ docker service ls        │────▶│ docker service rm        │
│ List services            │     │ Remove a service         │
└──────────────────────────┘     └──────────────────────────┘`}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

