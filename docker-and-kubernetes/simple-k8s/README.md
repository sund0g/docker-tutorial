## Section 12: Onwards to Kubernetes!

#### Lesson 154
* Get an understanding of Kubernetes, **What** it is and **Why** would we want to use it.

#### Lesson 155
* Learn when to use,
	*  **[minikube](https://kubernetes.io/docs/setup/minikube/)** - for development
	*  **[kubctl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)** - for production 

#### Lesson 156
* Install the k8s environment

TODO: put in the details here

#### Lesson 157

> **GOAL** Get the **multi-client** image running on the local k8s cluster as a container.
> 
> To start, we need to map our existing **docker-compose** knowledge to **k8s**.

* Compare and contrast **docker-compose** with **Kubernetes**
	* with docker-compose each entry,
		* can build an **image**
		* represents a **container**
		* defines the **networking** requirements (ports) 
	* with Kubernetes,
		* **images** must be already built
		* there is one config file per *object*

			> An **object** in k8s does not alway map to a container. More on this later.
		*  **networking** is manually configured

* Getting back to the goal above, we will do the following,
	1. Ensure the **multi-client** image is on [Docker Hub](https://hub.docker.com/)
	2. Create a config file to create the **container**
	3. Create a config file to configure **networking**

#### Lesson 158

1. Verify the **\<username\>/multi-client** image is on [Docker Hub](https://hub.docker.com/)

	> It was pushed there are part of the lessons in Sections 10 and 11.
	
2. mkdir **simple-k8s** to contain the config files.
3. Create **client-pod.yaml**

	> This file contains the configuration for the container we will create from the **multi-client** image.
	
4. Create **client-node-port.yaml**

	> This file contains the netowrking configuration for the container.

#### Lesson 159


