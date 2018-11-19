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

#### Lessons 158 & 159

1. Verify the **\<username\>/multi-client** image is on [Docker Hub](https://hub.docker.com/)

	> It was pushed there are part of the lessons in Sections 10 and 11.
	
2. mkdir **simple-k8s** to contain the config files.
3. Create **client-pod.yaml**

	> This file contains the configuration for the container we will create from the **multi-client** image.
	
4. Create **client-node-port.yaml**

	> This file contains the networking configuration for the container.

5. In **Lesson 157** we learned about k8s **objects**. Objects can be different *kinds* of things. In both the config files just created, we specified what *kind* of object to create by the use of the **`kind`** keyword, e.g.

	- in **client-pod.yaml** `kind: Pod` says the config file creates a **container**.
	- in **client-node-port.yaml** `kind: Service` says the config file creates a service, int this case **networking**.

6. **`appVersion: v1`** specifies what set of objects can be created.

	>Each API version defines a different set of objects that are available.
	
	>Before setting appVersion, you have to determine what type of object is to be created, an research to see which object set/version is applicable.

#### Lesson 160

An in-depth look at **Pods** and **client-pod-yaml**

In **Lesson 156** we installed and played around a little but with **minikube**. When the command `minikube start` was executed, it created a virtual machine which is referred to as a **node**.

* **Nodes** are used by k8s to run various objects such as **Pods** and **Services**

	> With **docker-compose** and **Elastic Beanstalk** single containers can be deployed at will. In **k8s** the smallest *object* we can create is a **Pod**. A **Pod** runs one or more **containers**.

	> When we deploy any containers to k8s, we will deploy them inside Pods.

* A **Pod** runs a set of one or more containers that are very tightly coupled, i.e. all of the containers *must* be up and running for the rest of the containers to function.

	> The containers created as the **Mulit-container** application in **Sections 10 & 11** are not tightly coupled, so for this course, we will only be running a single container in a pod.

> refer to **client-pod-yaml** for additional comments.

#### Lesson 161

An in-depth look at **Services** and **client-node-port.yaml**
 
> **Services** sets up **networking** in a k8s cluster.

* There are four commonly used sub-types of **Services**

	1. **ClusterIP**
	2. **NodePort** exposes a container to the outside world. With very few exceptions, this is only used in a **development evironment**.
	3. **LoadBalancer**	
	4. **Ingress**
	
		> Only discussing **NodePort** for now. The rest will be covered later.
	
> Every **node** has a **kube-proxy**. This proxy is **the single point entry/exit** to the outside world.

> **kube-proxy** inspects all incoming requests and determines which services/pods to route them to inside the node.

* K8s uses a **Label/Selector** system to acssociate **Services** with **Pods**.

	* When the **client-node-port** service starts up, it uses the **selector** section to determine that it is looking for an **object/Pod** with a **Label** with a key:value pair of **component: web**. When it finds it, it directs all traffic in the **ports** section to the **client-pod** It also exposes port **3000** to the outside world.
	
	> **Label/Selector** names can be called anything descriptive of what they're doing.
	
> Notes on the ports sections are described in the **client-pod.yaml** and **client-node-port.yaml** files.

* **nodePort** in **client-node-port.yaml** must be between **30000-32767**.


