## Building a Multi-Container Application & "Dockerizing" Multiple Services

The objectives for sections 8 and 9 of the course are,

1. Take the lessons learned in section 7 and create multiple containters which can be modularly and easily maintained.
2. Create an overly-complicated React application which will be containerized. The reason for the complicated design allows us to learn how to create and support multiple containers for an application, (all of Section 8).
3. Learn about **HTML5 [PushState](https://developer.mozilla.org/en-US/docs/Web/API/History_API) routing**. This does require some basic knowledge of [React Router](https://reacttraining.com/react-router/)
4. Create **Development-only** Dockerfiles for the **React app**, **Express Server**, and  **Worker** components, (lessons 110-112)
5. Create a **Development-only** docker-compose file which will configure and start up the application containers, (lessons 113-115)
6. Learn how to add environment variables to the docker-compose file.
7. Learn a little about [nginx](https://www.nginx.com/) and how to use it for routing requests, (lessons 116-118).

## Project-specific setup

This lesson requires some additional setup as follows below. **NOTE:** we will be using the `create-react-app` nodejs plugin installed as part of [**Section 6**](https://github.com/sund0g/docker-tutorials/tree/docker-and-k8s-section-7/docker-and-kubernetes/workflow#creating-a-production-grade-workflow).

1. Create the React app, **client**, (at the root of the **complex** directory),

		create-react-app client
>***Note: While we've followed along in lessons 99-107, to understand the architecture of the React application, the recommendation to download and use the tested client, server, and worker files has been followed.***

## Building images for the Client, Server, and Worker components

* to build the **client** image, cd to the client directory and execute,

		docker build -f dev.Dockerfile -t <username>/complex-client .
		
* to build the **server** image, cd to the server directory and execute,

		docker build -f dev.Dockerfile -t <username>/complex-server .
		
* to build the **worker** image, cd to the worker directory and execute,

		docker build -f dev.Dockerfile -t <username>/complex-worker .
		
## Starting the containers

### Individual container startup

* To start the **client**,

		docker container run <username>/complex-client

* To start the **server**,

		docker container run <username>/complex-server

* To start the **worker**,

		docker container run <username>/complex-worker
		
### With docker-compose (development only)

	docker-compose up


