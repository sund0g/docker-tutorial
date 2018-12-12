### Table of Contents

* [Section 8: Building a Multi-Container Application](#89)
* [Section 9: "Dockerizing" Multiple Services](#89)
* [Section 14: A Multi-Container App with Kubernetes](#14)

---

<a name="89"></a>
## Sections 8 & 9: Building a Multi-Container Application & "Dockerizing" Multiple Services

The objectives for **sections 8 and 9** of the course are,

1. Take the lessons learned in section 7 and create multiple containters which can be modularly and easily maintained.
2. Create an overly-complicated React application which will be containerized. The reason for the complicated design allows us to learn how to create and support multiple containers for an application, (all of Section 8).
3. Learn about **HTML5 [PushState](https://developer.mozilla.org/en-US/docs/Web/API/History_API) routing**. This does require some basic knowledge of [React Router](https://reacttraining.com/react-router/)
4. Create **Development-only** Dockerfiles for the **React app**, **Express Server**, and  **Worker** components, (lessons 110-112)
5. Create a **Development-only** docker-compose file which will configure and start up the application containers, (lessons 113-115)
6. Learn how to add environment variables to the docker-compose file.
7. Learn a little about [nginx](https://www.nginx.com/) and how to use it for routing requests, (lessons 116-118).
8. Troubleshoot errors, (lessons 120-122).

## Project-specific setup

This lesson requires some additional setup as follows below. **NOTE:** we will be using the `create-react-app` nodejs plugin installed as part of [**Section 6**](https://github.com/sund0g/docker-tutorials/tree/docker-and-k8s-section-7/docker-and-kubernetes/workflow#creating-a-production-grade-workflow).

1. Create the React app, **client**, (at the root of the **complex** directory),

		create-react-app client
>***Note: While we've followed along in lessons 99-107, to understand the architecture of the React application, the recommendation to download and use the tested client, server, and worker files has been followed.***

## Building and running the Client, Server, nginx, and Worker images components in development mode

### To build the containers individually,

* cd to the **client** directory and execute,

		docker build -f dev.Dockerfile -t <username>/complex-client .
		
* cd to the **server** directory and execute,

		docker build -f dev.Dockerfile -t <username>/complex-api .
		
* cd to the **worker** directory and execute,

		docker build -f dev.Dockerfile -t <username>/complex-worker .

### Using docker-compose,

* cd to the **complex** directory, (where **docker-compose.yml** is located) and execute,

		docker-compose up --build

---

* **Notes for Sections 10 and 11 are in the [multi-docker](https://github.com/sund0g/multi-docker) README.md**

* **Notes for Sections 12 and 13 are in the ["simple-k8s"](https://github.com/sund0g/docker-tutorials/tree/master/docker-and-kubernetes/simple-k8s) README.md**

---

<a name="14"></a>
## Section 14: A Multi-Container App with Kubernetes

The objective for this section is to get the **Complex App** running in a **Production** environment.

#### Lesson 181

* This section introduces some new terms,

	* **Ingress server**
	* **Cluster IP**
	* **Persistent Volume Claim**

* The *path to production* looks like,

	1. Create **config files** for each service and deployment
	2. Test locally on **minikube**
	3. Create a **GitHub/Travis** flow to build image and deploy
	4. Deploy app to a **cloud provider**

#### Lessons 182 & 183

* Verify the complex code is exactly the same as the instructor-provided code.

1. Verify that the terminal window being used at this point is not being redirected to minikube. A quick test is,

		docker ps
		
	which should return something like,
	
		CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS              PORTS               NAMES
		
	indicating no containers are running in the local Docker instance.
	
2. Rebuild all the images to ensure we're using the correct version of the code,

		docker-compose up --build
		
	> Remember when we did this originally the first time **docker-compose up** was executed, there were errors and **nginx** continuously stopped/restarted.
	
	> To fix this, \^C to stop **docker-compose** and immediately rerun **docker-compose up** w/o the **--build** flag.
	
3. Navigate, (in a browser window) to **localhost:3050** to verify the application works as expected.
	
