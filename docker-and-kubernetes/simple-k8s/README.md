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
	- in **client-node-port.yaml** `kind: Service` says the config file creates a service, in this case **networking**.

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

	> The containers created as the **Multi-container** application in **Sections 10 & 11** are not tightly coupled, so for this course, we will only be running a single container in a pod.

> refer to **client-pod-yaml** for additional comments.

#### Lesson 161

An in-depth look at **Services** and **client-node-port.yaml**
 
> **Services** sets up **networking** in a k8s cluster.

* There are four commonly used sub-types of **Services**

	1. **ClusterIP**
	2. **NodePort** exposes a container to the outside world. With very few exceptions, this is only used in a **development environment**.
	3. **LoadBalancer**	
	4. **Ingress**
	
		> Only discussing **NodePort** for now. The rest will be covered later.
	
> Every **node** has a **kube-proxy**. This proxy is **the single point entry/exit** to the outside world.

> **kube-proxy** inspects all incoming requests and determines which services/pods to route them to inside the node.

* K8s uses a **Label/Selector** system to associate **Services** with **Pods**.

	* When the **client-node-port** service starts up, it uses the **selector** section to determine that it is looking for an **object/Pod** with a **Label** with a key:value pair of **component: web**. When it finds it, it directs all traffic in the **ports** section to the **client-pod** It also exposes port **3000** to the outside world.
	
	> **Label/Selector** names can be called anything descriptive of what they're doing.
	
> Notes on the ports sections are described in the **client-pod.yaml** and **client-node-port.yaml** files.

* **nodePort** in **client-node-port.yaml** must be between **30000-32767**.

#### Lesson 162

* Now that the **client-pod.yaml** and **client-node-port.yaml** files are explained, they will be loaded into the k8s cluster via the **kubectl** commands,

		kubectl apply -f client-pod.yaml
		
		kubectl apply -f client-node-port.yaml

* To get the status of the pods, execute

		kubectl get pods
		
	This command returns the following info,
	
	```
	NAME		READY   STATUS    RESTARTS   AGE
	client-pod	1/1     Running   0          3m
	```
	where

	* **NAME**: the pod that was started
	* **READY**: number of pods running/pod copies needed to be running
	* **STATUS**:	 current pod status, (at this point client-pod should be in a running status)
	* **RESTARTS**: number of times the pod has been restarted
	* **AGE**: How long the pod has been running

* To get the status of the services, execute

		kubectl get services
		
	This returns the following info,
	
	```
	NAME               TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)          AGE
	client-node-port   NodePort    10.111.228.223   <none>        3050:31515/TCP   14m
	kubernetes         ClusterIP   10.96.0.1        <none>        443/TCP          27d
	```
	where
	
	* **NAME**: the service that was started
	* **TYPE**: the type of service, (in our case, *NodePort*)
	* **CLUSTER-IP**: IP of the cluster
	* **EXTERNAL-IP**: visible IP
	* **PORTS**: the first port is the **port** used by other pods in the cluster. the second port is the **nodePort** which is used to connect to the container from the outside world.
		
		> **targetPort** is not reported because it is not used.
		
	* **AGE**: How long the service has been running

* Now that both objects are running, the next step is to access the client-pod object, (aka the multi-client container).  To do this, the IP address of the **minikube** virtual machine is needed. To obtain it, execute,

		minikube ip

* Copy the ip address returned and enter it into a browser window with the **nodePort**,

		<k8s cluster ip>:31515
		
	> **localhost** does not exist in the k8s world, objects must be accessed via the VM's ip address.
	
#### Lesson 163

What happened when the configuration files were loaded into kubectl in the previous lessons?

##### Recap of k8s so far,

* A **node** is a *computer*, e.g. a VM or a physical machine that runs some number of (potentially dissimilar) **objects**.
* A **master** controls the **cluster** and,
	* consists of 4 programs. For now, we're only concerned with **kube-apiserver**
* A **deployment file** is essentially the same as the configuration files created previously which define an **object** or **service**.
* **Docker Hub** is where the images are maintained that will be used to create **Pod objects**

##### New knowledge

* **kube-apiserver** is responsible for monitoring the status of the **nodes** to ensure they are functioning correctly.
* When `kubectl apply -f \<config file\>` passes the file into the **master**, **kube-apiserver** reads it and interprets the information which is recorded by the **master** in a *responsibilities* record. **kube-apiserver** then looks at the responsibilities to see if there are any updates it needs to process.
	
	>The course example deployment says there are 4 object copies needed and 0 are running. The following workflow is based on this.

	* **kube-apiserver** tells the **nodes** in the cluster how many copies to start.

		>  Each of the nodes has a copy of **Docker** running on it.
	
	* The **Docker** copy running in each **node** contacts **Docker Hub** and downloads the specified image to the node.

		> The nodes are autonomous, so each one will download the image to its local storage cache.
		
	* Once the image is downloaded, a container will be created from it in one of the **node's** **Pods**.

	* Finally, the **master** checks the status of the nodes, updates its **responsibilities** record and then polls them for additional status and subsequent updates as needed.

#### Lesson 164

Two important things that cannot be stressed enough,

1. To deploy something, we update the desired state of the **master** with a **config file**.
2. The **master** works **constantly** to meet the desired state. 

> These are key to understanding k8s and how we work with it as developers.

Two ways to deploy,

1. **Iterative** - "do exactly these steps to arrive at this container setup." aka **Discrete commands**, e.g.

		A specific k8s command on specific pod

2. **Declarative** - "The container setup should look like this, make it happen." aka **General guidance**, e.g.

		Updating a config file and sending it to the master

> k8s supports both methods, and while both are technically correct, the lessons presented in this course strive for the **Declarative** method because it is more scalable and considered **best production practice** by the k8s community.
	
### Takeaways
---

* **k8s** is a system to deploy containerized applications.

	> At the end of the day k8s is all about running containers. 
	
* A **Pod** must have a **Service** associated with it if we want to access anything in the Pod.
* **By default** the **master** decides on which nodes to run containers, (in pods).

	> This can be overridden in the config files.
	
* K8s is far more restrictive and explicit than either **docker-compose** or **Elastic Beanstalk** with regards to how networking is configured.
* As developers, we do not work directly with **nodes** in a **cluster**, we communicate changes to the **master** via **config files** and **kubectl** which then manages the nodes.
* **Master** continuously monitors all the **nodes**. When it detects an object issue, it automatically attempts to recreate that object inside the node, until the list of **responsibilities** is satisfied.
	
	> This is one of the most important ideas of k8s.
