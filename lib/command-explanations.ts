export const commandExplanations = [
  {
    command: "docker --version",
    explanation:
      "This command displays the installed Docker version. It&apos;s useful to verify that Docker is properly installed and to check which version you&apos;re running.",
    examples: ["docker --version", "docker -v"],
  },
  {
    command: "docker info",
    explanation:
      "Provides detailed information about your Docker installation, including the number of containers and images, server version, storage driver, and system-wide settings.",
    examples: ["docker info"],
  },
  {
    command: "docker run",
    explanation:
      "Creates and starts a new container from an image. This is one of the most fundamental Docker commands that allows you to launch applications inside containers.",
    examples: ["docker run nginx", "docker run -d -p 8080:80 nginx", "docker run --name my-container ubuntu bash"],
  },
  {
    command: "docker ps",
    explanation:
      "Lists running containers. This command helps you see what containers are currently active, their IDs, names, and other metadata.",
    examples: ["docker ps", "docker ps -a", "docker ps -q"],
  },
  {
    command: "docker images",
    explanation:
      "Lists all locally stored Docker images. This shows you what images are available on your system to create containers from.",
    examples: ["docker images", "docker images -a", "docker images nginx"],
  },
  {
    command: "docker pull",
    explanation:
      "Downloads an image from a registry (like Docker Hub). This command fetches images that you can later use to create containers.",
    examples: ["docker pull ubuntu", "docker pull nginx:latest", "docker pull redis:6.0.5"],
  },
  {
    command: "docker stop",
    explanation:
      "Stops one or more running containers. This gracefully shuts down the container, allowing it to perform cleanup operations before terminating.",
    examples: ["docker stop my-container", "docker stop 1a2b3c4d5e6f", "docker stop $(docker ps -q)"],
  },
  {
    command: "docker start",
    explanation:
      "Starts one or more stopped containers. This command lets you restart containers that were previously stopped.",
    examples: ["docker start my-container", "docker start 1a2b3c4d5e6f", "docker start my-container1 my-container2"],
  },
  {
    command: "docker rm",
    explanation:
      "Removes one or more containers. This permanently deletes the container, but not the image it was created from.",
    examples: ["docker rm my-container", "docker rm -f running-container", "docker rm $(docker ps -aq)"],
  },
  {
    command: "docker rmi",
    explanation: "Removes one or more images. This deletes images from your local system, freeing up disk space.",
    examples: ["docker rmi nginx", "docker rmi nginx:latest", "docker rmi $(docker images -q)"],
  },
  {
    command: "docker-compose",
    explanation:
      "A tool for defining and running multi-container Docker applications. With a YAML file, you configure your application&apos;s services and run them with a single command.",
    examples: ["docker-compose up", "docker-compose down", "docker-compose ps"],
  },
  {
    command: "docker-compose --version",
    explanation:
      "Shows the installed Docker Compose version. This helps verify that Docker Compose is properly installed and check which version you&apos;re running.",
    examples: ["docker-compose --version", "docker-compose -v"],
  },
  {
    command: "docker-compose up",
    explanation:
      "Creates and starts containers defined in a docker-compose.yml file. This is the main command to launch a multi-container application defined with Docker Compose.",
    examples: ["docker-compose up", "docker-compose up -d", "docker-compose up --build"],
  },
  {
    command: "docker-compose down",
    explanation:
      "Stops and removes containers, networks, volumes, and images created by &apos;up&apos;. This command cleans up all resources created by docker-compose up.",
    examples: ["docker-compose down", "docker-compose down --volumes", "docker-compose down --rmi all"],
  },
  {
    command: "docker network",
    explanation:
      "Manages Docker networks. Docker networks allow containers to communicate with each other and with the outside world.",
    examples: [
      "docker network ls",
      "docker network create my-network",
      "docker network connect my-network my-container",
    ],
  },
  {
    command: "docker volume",
    explanation:
      "Manages Docker volumes. Volumes are the preferred way to persist data generated and used by Docker containers.",
    examples: ["docker volume ls", "docker volume create my-volume", "docker volume rm my-volume"],
  },
]

