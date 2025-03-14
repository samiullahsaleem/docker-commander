export const dockerCommands = [
  // Docker Basics
  {
    command: "docker --version",
    description: "Display Docker version information",
    example: "docker --version",
    category: "basics",
  },
  {
    command: "docker info",
    description: "Display system-wide information",
    example: "docker info",
    category: "basics",
  },
  {
    command: "docker login",
    description: "Log in to a Docker registry",
    example: "docker login",
    category: "basics",
  },
  {
    command: "docker logout",
    description: "Log out from a Docker registry",
    example: "docker logout",
    category: "basics",
  },

  // Container Management
  {
    command: "docker ps",
    description: "List running containers",
    example: "docker ps",
    category: "containers",
  },
  {
    command: "docker ps -a",
    description: "List all containers (running and stopped)",
    example: "docker ps -a",
    category: "containers",
  },
  {
    command: "docker run",
    description: "Run a command in a new container",
    example: "docker run nginx",
    category: "containers",
  },
  {
    command: "docker run -d",
    description: "Run container in background",
    example: "docker run -d nginx",
    category: "containers",
  },
  {
    command: "docker run -p",
    description: "Publish container's port to the host",
    example: "docker run -p 8080:80 nginx",
    category: "containers",
  },
  {
    command: "docker run -v",
    description: "Bind mount a volume",
    example: "docker run -v /host/path:/container/path nginx",
    category: "containers",
  },
  {
    command: "docker run --name",
    description: "Assign a name to the container",
    example: "docker run --name my-nginx nginx",
    category: "containers",
  },
  {
    command: "docker start",
    description: "Start one or more stopped containers",
    example: "docker start my-container",
    category: "containers",
  },
  {
    command: "docker stop",
    description: "Stop one or more running containers",
    example: "docker stop my-container",
    category: "containers",
  },
  {
    command: "docker restart",
    description: "Restart one or more containers",
    example: "docker restart my-container",
    category: "containers",
  },
  {
    command: "docker kill",
    description: "Kill one or more running containers",
    example: "docker kill my-container",
    category: "containers",
  },
  {
    command: "docker rm",
    description: "Remove one or more containers",
    example: "docker rm my-container",
    category: "containers",
  },
  {
    command: "docker logs",
    description: "Fetch the logs of a container",
    example: "docker logs my-container",
    category: "containers",
  },
  {
    command: "docker logs -f",
    description: "Follow log output",
    example: "docker logs -f my-container",
    category: "containers",
  },
  {
    command: "docker exec",
    description: "Run a command in a running container",
    example: "docker exec -it my-container bash",
    category: "containers",
  },
  {
    command: "docker cp",
    description: "Copy files/folders between container and local filesystem",
    example: "docker cp my-container:/file/path /host/path",
    category: "containers",
  },
  {
    command: "docker stats",
    description: "Display a live stream of container resource usage statistics",
    example: "docker stats",
    category: "containers",
  },

  // Image Management
  {
    command: "docker images",
    description: "List images",
    example: "docker images",
    category: "images",
  },
  {
    command: "docker pull",
    description: "Pull an image from a registry",
    example: "docker pull ubuntu:20.04",
    category: "images",
  },
  {
    command: "docker push",
    description: "Push an image to a registry",
    example: "docker push myimage:1.0",
    category: "images",
  },
  {
    command: "docker build",
    description: "Build an image from a Dockerfile",
    example: "docker build -t myimage:1.0 .",
    category: "images",
  },
  {
    command: "docker rmi",
    description: "Remove one or more images",
    example: "docker rmi myimage:1.0",
    category: "images",
  },
  {
    command: "docker tag",
    description: "Create a tag for an image",
    example: "docker tag myimage:1.0 myrepo/myimage:1.0",
    category: "images",
  },
  {
    command: "docker history",
    description: "Show the history of an image",
    example: "docker history myimage:1.0",
    category: "images",
  },
  {
    command: "docker save",
    description: "Save one or more images to a tar archive",
    example: "docker save -o myimage.tar myimage:1.0",
    category: "images",
  },
  {
    command: "docker load",
    description: "Load an image from a tar archive",
    example: "docker load -i myimage.tar",
    category: "images",
  },
  {
    command: "docker inspect",
    description: "Return low-level information on Docker objects",
    example: "docker inspect myimage:1.0",
    category: "images",
  },

  // Docker Compose
  {
    command: "docker-compose --version",
    description: "Show Docker Compose version",
    example: "docker-compose --version",
    category: "compose",
  },
  {
    command: "docker-compose up",
    description: "Create and start containers",
    example: "docker-compose up",
    category: "compose",
  },
  {
    command: "docker-compose up -d",
    description: "Create and start containers in detached mode",
    example: "docker-compose up -d",
    category: "compose",
  },
  {
    command: "docker-compose down",
    description: "Stop and remove containers, networks",
    example: "docker-compose down",
    category: "compose",
  },
  {
    command: "docker-compose ps",
    description: "List containers",
    example: "docker-compose ps",
    category: "compose",
  },
  {
    command: "docker-compose logs",
    description: "View output from containers",
    example: "docker-compose logs",
    category: "compose",
  },
  {
    command: "docker-compose build",
    description: "Build or rebuild services",
    example: "docker-compose build",
    category: "compose",
  },
  {
    command: "docker-compose restart",
    description: "Restart services",
    example: "docker-compose restart",
    category: "compose",
  },

  // Networking
  {
    command: "docker network ls",
    description: "List networks",
    example: "docker network ls",
    category: "network",
  },
  {
    command: "docker network create",
    description: "Create a network",
    example: "docker network create my-network",
    category: "network",
  },
  {
    command: "docker network connect",
    description: "Connect a container to a network",
    example: "docker network connect my-network my-container",
    category: "network",
  },
  {
    command: "docker network disconnect",
    description: "Disconnect a container from a network",
    example: "docker network disconnect my-network my-container",
    category: "network",
  },
  {
    command: "docker network inspect",
    description: "Display detailed information on one or more networks",
    example: "docker network inspect my-network",
    category: "network",
  },
  {
    command: "docker network rm",
    description: "Remove one or more networks",
    example: "docker network rm my-network",
    category: "network",
  },

  // Volume Management
  {
    command: "docker volume ls",
    description: "List volumes",
    example: "docker volume ls",
    category: "volumes",
  },
  {
    command: "docker volume create",
    description: "Create a volume",
    example: "docker volume create my-volume",
    category: "volumes",
  },
  {
    command: "docker volume inspect",
    description: "Display detailed information on one or more volumes",
    example: "docker volume inspect my-volume",
    category: "volumes",
  },
  {
    command: "docker volume rm",
    description: "Remove one or more volumes",
    example: "docker volume rm my-volume",
    category: "volumes",
  },
  {
    command: "docker volume prune",
    description: "Remove all unused local volumes",
    example: "docker volume prune",
    category: "volumes",
  },

  // System Commands
  {
    command: "docker system df",
    description: "Show docker disk usage",
    example: "docker system df",
    category: "system",
  },
  {
    command: "docker system prune",
    description: "Remove unused data",
    example: "docker system prune",
    category: "system",
  },
  {
    command: "docker system prune -a",
    description: "Remove all unused images not just dangling ones",
    example: "docker system prune -a",
    category: "system",
  },
  {
    command: "docker events",
    description: "Get real time events from the server",
    example: "docker events",
    category: "system",
  },
]

