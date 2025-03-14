"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { CheckCircle, XCircle } from "lucide-react"
import { dockerCommands } from "@/lib/docker-commands"

interface TerminalProps {
  onCommandExecuted: (command: string, output: string, success: boolean, state?: any) => void
  initialDockerState?: {
    containers: any[]
    images: any[]
  }
}

export function Terminal({ onCommandExecuted, initialDockerState }: TerminalProps) {
  const [commandHistory, setCommandHistory] = useState<Array<{ command: string; output: string; success?: boolean }>>([
    {
      command: "",
      output: "Welcome to Docker Command Terminal! Type 'help' to see available commands.",
      success: undefined,
    },
  ])
  const [currentCommand, setCurrentCommand] = useState("")
  const [commandIndex, setCommandIndex] = useState(-1)
  const [commandBuffer, setCommandBuffer] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)

  // Simulate running containers and images state
  const [runningContainers, setRunningContainers] = useState<any[]>(initialDockerState?.containers || [])
  const [availableImages, setAvailableImages] = useState<any[]>(
    initialDockerState?.images || [
      { id: "9c7a54a9a43c", repository: "hello-world", tag: "latest", size: "13.3kB", created: "3 months ago" },
      { id: "a6bd71f48f68", repository: "nginx", tag: "latest", size: "187MB", created: "3 months ago" },
    ],
  )

  // Focus input when terminal is clicked
  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  // Auto-scroll to bottom when new commands are added
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [commandHistory])
    // Update state if initialDockerState changes
    useEffect(() => {
      if (initialDockerState) {
          if (initialDockerState.containers) {
              setRunningContainers(initialDockerState.containers);
          }
          if (initialDockerState.images) {
              setAvailableImages(initialDockerState.images);
          }
      }
  }, [initialDockerState]); // Add dependency array

  // Notify state change
  useEffect(() => {
      notifyStateChange();
  }, [runningContainers, availableImages]); // Add dependency array

  // Handle external command execution
  useEffect(() => {
      const handleExternalCommand = (event: CustomEvent<{ command: React.SetStateAction<string> }>) => {
          if (event.detail?.command) {
              setCurrentCommand(event.detail.command);
              setTimeout(() => {
                  const form = inputRef.current?.closest("form");
                  if (form) {
                      form.dispatchEvent(new Event("submit", { bubbles: true }));
                  }
              }, 100);
          }
      };
      window.addEventListener("runDockerCommand", handleExternalCommand as EventListener);
      return () => {
          window.removeEventListener("runDockerCommand", handleExternalCommand as EventListener);
      };
  }, []); // Add empty dependency array

  // Event to notify other components about Docker state changes
  const notifyStateChange = () => {
    const state = { containers: runningContainers, images: availableImages }
    const event = new CustomEvent("dockerStateChanged", {
      detail: state,
    })
    window.dispatchEvent(event)
    return state
  }

  useEffect(() => {
    notifyStateChange()
  }, [runningContainers, availableImages])

  // Update state if initialDockerState changes
  useEffect(() => {
    if (initialDockerState) {
      if (initialDockerState.containers) {
        setRunningContainers(initialDockerState.containers)
      }
      if (initialDockerState.images) {
        setAvailableImages(initialDockerState.images)
      }
    }
  }, [initialDockerState])

  // Listen for external command execution requests
  useEffect(() => {
    const handleExternalCommand = (event: any) => {
      if (event.detail?.command) {
        // Set the command in the input
        setCurrentCommand(event.detail.command)

        // Use setTimeout to ensure the state is updated before submitting
        setTimeout(() => {
          // Try to find and submit the form
          const form = inputRef.current?.closest("form")
          if (form) {
            form.dispatchEvent(new Event("submit", { bubbles: true }))
          } else {
            // Alternative approach: manually process the command
            const processedCommand = processCommand(event.detail.command)

            // Update command history
            setCommandHistory((prev) => [
              ...prev,
              {
                command: event.detail.command,
                output: processedCommand.output,
                success: processedCommand.success,
              },
            ])

            // Notify parent component
            if (processedCommand.success !== undefined) {
              const state = notifyStateChange()
              onCommandExecuted(event.detail.command, processedCommand.output, processedCommand.success, state)

              // Dispatch command executed event for challenge verification
              const commandEvent = new CustomEvent("commandExecuted", {
                detail: {
                  command: event.detail.command,
                  output: processedCommand.output,
                  success: processedCommand.success,
                },
              })
              window.dispatchEvent(commandEvent)
            }
          }
        }, 100)
      }
    }

    window.addEventListener("runDockerCommand", handleExternalCommand)
    return () => {
      window.removeEventListener("runDockerCommand", handleExternalCommand)
    }
  }, [])

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentCommand.trim()) return

    // Add command to buffer for up/down navigation
    setCommandBuffer([currentCommand, ...commandBuffer])
    setCommandIndex(-1)

    let output = ""
    let success: boolean | undefined = undefined

    // Process the command
    const processedCommand = processCommand(currentCommand)
    output = processedCommand.output
    success = processedCommand.success

    // Update command history
    setCommandHistory([
      ...commandHistory,
      {
        command: currentCommand,
        output,
        success,
      },
    ])

    // Notify parent component
    if (success !== undefined) {
      const state = notifyStateChange()
      onCommandExecuted(currentCommand, output, success, state)

      // Dispatch command executed event for challenge verification
      const commandEvent = new CustomEvent("commandExecuted", {
        detail: { command: currentCommand, output, success },
      })
      window.dispatchEvent(commandEvent)
    }

    setCurrentCommand("")
  }

  const processCommand = (cmd: string) => {
    // Split command and arguments
    const parts = cmd.split(" ")
    const baseCommand = parts[0]
    const args = parts.slice(1)

    // Basic command processing
    if (cmd === "help") {
      return {
        output: `
Available commands:

DOCKER BASICS:
  docker --version              Check Docker version
  docker info                   Display system-wide information
  docker login                  Log in to a Docker registry

CONTAINER MANAGEMENT:
  docker ps                     List running containers
  docker ps -a                  List all containers (running and stopped)
  docker run [OPTIONS] IMAGE    Run a container
  docker start CONTAINER        Start a stopped container
  docker stop CONTAINER         Stop a running container
  docker restart CONTAINER      Restart a container
  docker rm CONTAINER           Remove a container
  docker logs CONTAINER         Fetch logs of a container
  docker exec CONTAINER COMMAND Execute a command in a running container

IMAGE MANAGEMENT:
  docker images                 List images
  docker pull IMAGE             Pull an image from registry
  docker push IMAGE             Push an image to registry
  docker build -t NAME:TAG .    Build an image from a Dockerfile
  docker rmi IMAGE              Remove an image

DOCKER COMPOSE:
  docker-compose --version      Check Docker Compose version
  docker-compose up             Create and start containers
  docker-compose down           Stop and remove containers
  docker-compose ps             List containers managed by compose

NETWORKING:
  docker network ls             List networks
  docker network create         Create a network
  docker network connect        Connect a container to a network

VOLUME MANAGEMENT:
  docker volume ls              List volumes
  docker volume create          Create a volume
  docker volume rm              Remove a volume

SYSTEM:
  docker system df              Show docker disk usage
  docker system prune           Remove unused data

TERMINAL:
  clear                         Clear terminal history
`,
        success: true,
      }
    } else if (cmd === "clear") {
      setCommandHistory([])
      return { output: "", success: true }
    } else if (cmd === "docker --version") {
      return { output: "Docker version 24.0.5, build ced0996", success: true }
    } else if (cmd === "docker-compose --version") {
      return { output: "Docker Compose version v2.20.2", success: true }
    } else if (cmd === "docker info") {
      return {
        output: `
Client:
 Context:    default
 Debug Mode: false
 Plugins:
  buildx: Docker Buildx (Docker Inc.)
  compose: Docker Compose (Docker Inc.)
  dev: Docker Dev Environments (Docker Inc.)

Server:
 Containers: ${runningContainers.length}
  Running: ${runningContainers.filter((c) => c.status === "running").length}
  Paused: 0
  Stopped: ${runningContainers.filter((c) => c.status !== "running").length}
 Images: ${availableImages.length}
 Server Version: 24.0.5
 Storage Driver: overlay2
 Logging Driver: json-file
 Cgroup Driver: systemd
 Kernel Version: 5.15.0-76-generic
 Operating System: Ubuntu 22.04.3 LTS
 OSType: linux
 Architecture: x86_64
 CPUs: 8
 Total Memory: 15.61GiB
`,
        success: true,
      }
    } else if (cmd === "docker ps") {
      if (runningContainers.length === 0 || runningContainers.filter((c) => c.status === "running").length === 0) {
        return { output: "CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES", success: true }
      }

      let output =
        "CONTAINER ID   IMAGE           COMMAND                  CREATED         STATUS         PORTS                  NAMES\n"
      runningContainers
        .filter((c) => c.status === "running")
        .forEach((container) => {
          output += `${container.id.substring(0, 12)}   ${container.image}   ${container.command}   ${container.created}   ${container.status}   ${container.ports || ""}   ${container.name}\n`
        })

      return { output, success: true }
    } else if (cmd === "docker ps -a") {
      if (runningContainers.length === 0) {
        return { output: "CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES", success: true }
      }

      let output =
        "CONTAINER ID   IMAGE           COMMAND                  CREATED         STATUS         PORTS                  NAMES\n"
      runningContainers.forEach((container) => {
        output += `${container.id.substring(0, 12)}   ${container.image}   ${container.command}   ${container.created}   ${container.status}   ${container.ports || ""}   ${container.name}\n`
      })

      return { output, success: true }
    } else if (cmd === "docker images") {
      if (availableImages.length === 0) {
        return { output: "REPOSITORY   TAG       IMAGE ID       CREATED        SIZE", success: true }
      }

      let output = "REPOSITORY    TAG       IMAGE ID       CREATED         SIZE\n"
      availableImages.forEach((image) => {
        output += `${image.repository}   ${image.tag}    ${image.id}   ${image.created}   ${image.size}\n`
      })

      return { output, success: true }
    } else if (cmd.startsWith("docker run ")) {
      const imageName = args.filter((arg) => !arg.startsWith("-"))[1]
      console.log(imageName);
      if (!imageName) {
        return { output: "Error: No image specified", success: false }
      }

      // Check if image exists
      const imageExists = availableImages.some(
        (img) => `${img.repository}:${img.tag}` === imageName || img.repository === imageName,
      )

      // If image doesn't exist, automatically pull common images instead of showing error
      if (!imageExists) {
        if (
          ["hello-world", "nginx", "ubuntu", "node", "python", "redis", "postgres", "mysql"].includes(
            imageName.split(":")[0],
          )
        ) {
          // Add the image automatically
          const newImage = {
            id: Math.random().toString(36).substring(2, 10),
            repository: imageName.includes(":") ? imageName.split(":")[0] : imageName,
            tag: imageName.includes(":") ? imageName.split(":")[1] : "latest",
            size: `${Math.floor(Math.random() * 200) + 10}MB`,
            created: "Just now",
          }
          setAvailableImages((prevImages) => [...prevImages, newImage])
        } else {
          return {
            output: `Unable to find image '${imageName}' locally\nPulling from docker hub...\nError: pull access denied for ${imageName}, repository does not exist or may require 'docker login'`,
            success: false,
          }
        }
      }

      // For hello-world, add it to available images if not exists
      if (imageName === "hello-world" && !imageExists) {
        const newImage = {
          id: "9c7a54a9a43c",
          repository: "hello-world",
          tag: "latest",
          size: "13.3kB",
          created: "3 months ago",
        }
        setAvailableImages([...availableImages, newImage])
      }

      // Generate container ID
      const containerId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

      // Create container name if not specified
      let containerName = ""
      const nameIndex = args.indexOf("--name")
      if (nameIndex !== -1 && args.length > nameIndex + 1) {
        containerName = args[nameIndex + 1]
      } else {
        // Generate random name
        const adjectives = ["bold", "calm", "eager", "kind", "proud", "brave", "wise"]
        const nouns = ["panda", "tiger", "eagle", "wolf", "bear", "fox", "hawk"]
        containerName = `${adjectives[Math.floor(Math.random() * adjectives.length)]}_${nouns[Math.floor(Math.random() * nouns.length)]}`
      }

      // Check for port mapping
      let ports = ""
      const portIndex = args.findIndex((arg) => arg.includes("-p") || arg.includes("--publish"))
      if (portIndex !== -1 && args.length > portIndex + 1) {
        ports = args[portIndex + 1]
      }

      // Add container to running containers
      const newContainer = {
        id: containerId,
        image: imageName,
        command: imageName === "nginx" ? "nginx -g 'daemon off;'" : "/hello",
        created: "Just now",
        status: "running",
        ports: ports,
        name: containerName,
      }

      setRunningContainers([...runningContainers, newContainer])

      if (imageName === "hello-world") {
        return {
          output: `
Hello from Docker!
This message shows that your installation appears to be working correctly.

To generate this message, Docker took the following steps:
 1. The Docker client contacted the Docker daemon.
 2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
 3. The Docker daemon created a new container from that image which runs the
    executable that produces the output you are currently reading.
 4. The Docker daemon streamed that output to the Docker client, which sent it
    to your terminal.
`,
          success: true,
        }
      } else if (imageName === "nginx" || imageName.startsWith("nginx:")) {
        return {
          output: `
Successfully pulled nginx:latest
Creating container...
Container started
${ports ? `Mapped port ${ports}` : ""}
`,
          success: true,
        }
      } else {
        return {
          output: `
Creating container with ${imageName}...
Container started
${ports ? `Mapped port ${ports}` : ""}
`,
          success: true,
        }
      }
    } else if (cmd.startsWith("docker stop ")) {
      const containerIdentifier = args[0]

      if (!containerIdentifier) {
        return { output: "Error: No container specified", success: false }
      }

      // Find container by ID or name
      const containerIndex = runningContainers.findIndex(
        (c) => c.id.startsWith(containerIdentifier) || c.name === containerIdentifier,
      )

      if (containerIndex === -1) {
        return {
          output: `Error: No such container: ${containerIdentifier}`,
          success: false,
        }
      }

      // Update container status
      const updatedContainers = [...runningContainers]
      updatedContainers[containerIndex] = {
        ...updatedContainers[containerIndex],
        status: "stopped",
      }

      setRunningContainers(updatedContainers)

      return { output: containerIdentifier, success: true }
    } else if (cmd.startsWith("docker start ")) {
      const containerIdentifier = args[0]

      if (!containerIdentifier) {
        return { output: "Error: No container specified", success: false }
      }

      // Find container by ID or name
      const containerIndex = runningContainers.findIndex(
        (c) => c.id.startsWith(containerIdentifier) || c.name === containerIdentifier,
      )

      if (containerIndex === -1) {
        return {
          output: `Error: No such container: ${containerIdentifier}`,
          success: false,
        }
      }

      // Update container status
      const updatedContainers = [...runningContainers]
      updatedContainers[containerIndex] = {
        ...updatedContainers[containerIndex],
        status: "running",
      }

      setRunningContainers(updatedContainers)

      return { output: containerIdentifier, success: true }
    } else if (cmd.startsWith("docker rm ")) {
      const containerIdentifier = args[0]

      if (!containerIdentifier) {
        return { output: "Error: No container specified", success: false }
      }

      // Find container by ID or name
      const containerIndex = runningContainers.findIndex(
        (c) => c.id.startsWith(containerIdentifier) || c.name === containerIdentifier,
      )

      if (containerIndex === -1) {
        return {
          output: `Error: No such container: ${containerIdentifier}`,
          success: false,
        }
      }

      // Check if container is running
      if (runningContainers[containerIndex].status === "running") {
        return {
          output: `Error: You cannot remove a running container ${containerIdentifier}. Stop the container before attempting removal or use -f`,
          success: false,
        }
      }

      // Remove container
      const updatedContainers = runningContainers.filter((_, index) => index !== containerIndex)
      setRunningContainers(updatedContainers)

      return { output: containerIdentifier, success: true }
    } else if (cmd.startsWith("docker pull ")) {
      const imageName = args[0]

      if (!imageName) {
        return { output: "Error: No image specified", success: false }
      }

      // Parse repository and tag
      let repository = imageName
      let tag = "latest"

      if (imageName.includes(":")) {
        ;[repository, tag] = imageName.split(":")
      }

      // Check if image already exists
      const imageExists = availableImages.some((img) => img.repository === repository && img.tag === tag)

      if (imageExists) {
        return {
          output: `
${tag}: Pulling from ${repository}
Digest: sha256:a89cb097693dd354de8d5facd4d2e117af36a2e72a9b1f7c6d996e4000f74c59
Status: Image is up to date for ${repository}:${tag}
`,
          success: true,
        }
      }

      // Add new image
      const newImage = {
        id: Math.random().toString(36).substring(2, 10),
        repository,
        tag,
        size: `${Math.floor(Math.random() * 200) + 10}MB`,
        created: "Just now",
      }

      setAvailableImages([...availableImages, newImage])

      return {
        output: `
${tag}: Pulling from ${repository}
Digest: sha256:${Math.random().toString(36).substring(2, 40)}
Status: Downloaded newer image for ${repository}:${tag}
`,
        success: true,
      }
    } else if (cmd.startsWith("docker rmi ")) {
      const imageIdentifier = args[0]

      if (!imageIdentifier) {
        return { output: "Error: No image specified", success: false }
      }

      // Parse repository and tag
      let repository = imageIdentifier
      let tag = "latest"

      if (imageIdentifier.includes(":")) {
        ;[repository, tag] = imageIdentifier.split(":")
      }

      // Find image by ID, repository:tag, or repository
      const imageIndex = availableImages.findIndex(
        (img) =>
          img.id.startsWith(imageIdentifier) ||
          `${img.repository}:${img.tag}` === imageIdentifier ||
          (img.repository === repository && img.tag === tag),
      )

      if (imageIndex === -1) {
        return {
          output: `Error: No such image: ${imageIdentifier}`,
          success: false,
        }
      }

      // Check if image is used by any container
      const imageInUse = runningContainers.some(
        (container) =>
          container.image === `${availableImages[imageIndex].repository}:${availableImages[imageIndex].tag}` ||
          container.image === availableImages[imageIndex].repository,
      )

      if (imageInUse) {
        return {
          output: `Error: conflict: unable to remove repository ${imageIdentifier} (must force) - container is using its referenced image`,
          success: false,
        }
      }

      // Remove image
      const updatedImages = availableImages.filter((_, index) => index !== imageIndex)
      setAvailableImages(updatedImages)

      return { output: `Untagged: ${repository}:${tag}\nDeleted: ${imageIdentifier}`, success: true }
    } else if (cmd === "docker network ls") {
      return {
        output: `
NETWORK ID     NAME      DRIVER    SCOPE
f2d74a2ec4bf   bridge    bridge    local
69bb21378df5   host      host      local
c4c1c8e21a3a   none      null      local
`,
        success: true,
      }
    } else if (cmd === "docker volume ls") {
      return {
        output: `
DRIVER    VOLUME NAME
local     data-volume
local     mysql-data
`,
        success: true,
      }
    } else if (cmd === "docker system df") {
      return {
        output: `
TYPE            TOTAL     ACTIVE    SIZE      RECLAIMABLE
Images          ${availableImages.length}         ${availableImages.length}         ${availableImages
          .reduce((acc, img) => {
            // Extract numeric part from size string (e.g. "187MB" -> 187)
            const sizeMatch = img.size.match(/(\d+(\.\d+)?)/)
            const sizeNum = sizeMatch ? Number.parseFloat(sizeMatch[1]) : 0
            return acc + sizeNum
          }, 0)
          .toFixed(1)}MB     0B (0%)
Containers      ${runningContainers.length}         ${runningContainers.filter((c) => c.status === "running").length}         10.5MB     0B (0%)
Local Volumes   2         2         234.2MB    0B (0%)
Build Cache     0         0         0B         0B
`,
        success: true,
      }
    } else if (cmd === "docker system prune") {
      return {
        output: `
WARNING! This will remove:
  - all stopped containers
  - all networks not used by at least one container
  - all dangling images
  - all dangling build cache

Are you sure you want to continue? [y/N] y

Deleted Containers:
Deleted Networks:
Deleted Images:
Total reclaimed space: 0B
`,
        success: true,
      }
    } else if (cmd.startsWith("docker-compose ")) {
      if (cmd === "docker-compose up") {
        return {
          output: `
Creating network "app_default" with the default driver
Creating app_db_1    ... done
Creating app_redis_1 ... done
Creating app_web_1   ... done
Attaching to app_db_1, app_redis_1, app_web_1
db_1     | 2023-03-14 12:00:00.555 UTC [1] LOG:  starting PostgreSQL 13.3
redis_1  | 1:C 14 Mar 12:00:00.777 # oO0OoO0OoO0Oo Redis is starting oO0OoO0OoO0Oo
web_1    | Listening on port 3000
`,
          success: true,
        }
      } else if (cmd === "docker-compose down") {
        return {
          output: `
Stopping app_web_1   ... done
Stopping app_redis_1 ... done
Stopping app_db_1    ... done
Removing app_web_1   ... done
Removing app_redis_1 ... done
Removing app_db_1    ... done
Removing network app_default
`,
          success: true,
        }
      } else if (cmd === "docker-compose ps") {
        return {
          output: `
    Name                   Command               State           Ports
------------------------------------------------------------------------------
app_db_1       docker-entrypoint.sh postgres    Up      5432/tcp
app_redis_1    docker-entrypoint.sh redis ...   Up      6379/tcp
app_web_1      docker-entrypoint.sh npm start   Up      0.0.0.0:3000->3000/tcp
`,
          success: true,
        }
      }
    }

    // Check if command exists in dockerCommands
    const knownCommand = dockerCommands.find((c) => cmd.startsWith(c.command))
    if (knownCommand) {
      return {
        output: `Command '${cmd}' recognized but not fully implemented in this simulator.\n\nUsage: ${knownCommand.example}\n\n${knownCommand.description}`,
        success: true,
      }
    }

    return {
      output: `Command not recognized: '${cmd}'\nType 'help' to see available commands.`,
      success: false,
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle up/down arrow keys for command history
    if (e.key === "ArrowUp") {
      e.preventDefault()
      const nextIndex = Math.min(commandBuffer.length - 1, commandIndex + 1)
      setCommandIndex(nextIndex)
      if (commandBuffer[nextIndex]) {
        setCurrentCommand(commandBuffer[nextIndex])
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      if (commandIndex > 0) {
        const nextIndex = commandIndex - 1
        setCommandIndex(nextIndex)
        setCurrentCommand(commandBuffer[nextIndex])
      } else if (commandIndex === 0) {
        setCommandIndex(-1)
        setCurrentCommand("")
      }
    }
  }

  return (
    <div
      className="rounded-lg border border-slate-700 bg-slate-950 p-4 font-mono text-sm"
      onClick={focusInput}
      ref={terminalRef}
    >
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-bold text-blue-400">Docker Terminal</h3>
        <div className="flex gap-2">
          <div className="h-3 w-3 rounded-full bg-red-500"></div>
          <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
          <div className="h-3 w-3 rounded-full bg-green-500"></div>
        </div>
      </div>

      <div className="h-64 overflow-y-auto">
        {commandHistory.map((entry, index) => (
          <div key={index} className="mb-2">
            {entry.command && (
              <div
                className={`flex items-center gap-2 ${entry.success === false ? "border-l-2 border-red-500 pl-1" : ""}`}
              >
                <span className="text-green-400">user@docker-quest:~$</span>
                <span>{entry.command}</span>
                {entry.success === true && <CheckCircle className="h-4 w-4 text-green-500" />}
                {entry.success === false && <XCircle className="h-4 w-4 text-red-500" />}
              </div>
            )}
            <div className="ml-4 whitespace-pre-wrap text-slate-300">{entry.output}</div>
          </div>
        ))}

        <form onSubmit={handleCommandSubmit} className="flex items-center">
          <span className="text-green-400">user@docker-quest:~$</span>
          <input
            ref={inputRef}
            type="text"
            value={currentCommand}
            onChange={(e) => setCurrentCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            className="ml-2 flex-1 bg-transparent outline-none"
            autoFocus
          />
        </form>
      </div>
    </div>
  )
}

