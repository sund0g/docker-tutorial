### Table of Contents
* [Section 12: Onwards to Kubernetes!](#12)
* [Section 13: Maintaining Sets of Containers with Deployments](#13)

---

<a name="12"></a>
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

> Refer to **client-pod.yaml** for additional comments.

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
* **Master** continuously monitors all the **nodes**. When is detects an object issue, it automatically attempts to recreate that object inside the node, until the list of **responsibilities** is satisfied.
	
	> This is one of the most important ideas of k8s.

<a name="13"></a>	
## Section 13: Maintaining Sets of Containers with Deployments

#### Lessons 165 & 166

* It is recommended to take a **Declarative** approach when updating an existing object.

	> This will be the general recommendation any time a change is being made to the cluster.
	
* A pod's **unique identifiers** are,
	* **Name**
	* **Kind**

	Usage of these identifiers determine whether the **master** will create a new pod or update an existing one,
	
	> Changing either of the identifiers in the config file results in master creating a new pod.
	
* An example of updating an existing pod will be to update the **`client-pod`** by replacing the **`multi-client`** container with a **`multi-worker`** container.

	> the **multi-worker** service expects to have a **Redis** database available. We are not adding that for this example, and so there may be errors when we execute the update and restart the pod. This example only demonstrates how to update an existing pod.
	
	1. Update **`client-pod.yaml`** changing **`image`** from **`\<username\>/multi-client`** to **`\<username\>/multi-worker`**

		> Ensure that **minikube** is running before proceeding.
		
	2. Execute,
			
			kubectl apply -f client-pod.yaml
			
		This should return a **`pod/client-pod configured`** message.
	
	3. To examine the container inside the pod, (we want to verify the container is using the multi-worker image) we learn the **`kubectl`** command,


			kubectl describe <object type> <object name>, e.g.

			kubectl describe pod client-pod
			
	4. Review the **`Events`** section to see the container inside the pod was updated.

	This proves that we successfully updated a container using the **Declarative** approach, e.g. updating the **config file** only and letting k8s figure out what to do.
	
#### Lesson 167

* The four following configuration properties are the only ones we can change when updating a pod via a configuration file using the **Pod** object type,

	* **spec.containers[\*].image**
	* **spec.initContainers[\*].image**
	* **spec.activeDeadlineSeconds**
	* **spec.tolerations**

	To create an example error demonstrating this, change the **`containerPort`** in **client-pod.yaml** from **3000** to **9999**.
	
	In the next lesson we'll learn how to create a configuration file where *any* pod property can be updated.

#### Lesson 168

* There are limits to what properties can be changed when using the **`Pod`** object type. To get around this, we use the **`Deployment`** object type.

	> The full list of k8s objects are [here](https://kubernetes.io/docs/concepts/#kubernetes-objects)
	
	The **`Deployment`** object **"maintains a set of identical pods ensuring they have the correct config and that the right number exists"**
	
	> **Deployment** and **Pod** objects are similar in that either can be used to to run containers containing applications.
	
This table compares/contrasts **Pods** and **Deployments**,

Pod  | Deployment
------------- | -------------
Runs a single set of containers | Runs one or more sets of identical pods
Good for one-off dev purposes | Good for dev purposes
Rarely used in production | Good for production
n/a | Monitors the state of each pod, updating as necessary

* **Pods** are only used for running sets of very closely related containers having tight integration with each other.
* They are not recommended for use in production because of the property restrictions exposed in the previous lesson.

* **Deployments** will attempt to recreate and/or restart the containers if they crash.  When **updating**, they will attempt to update/restart before destroying the existing ones and creating new ones with the updates.
 
> From this point forward, the course will use **Deployments** for both Development and Production examples.

#### Lessons 169 & 170

* Create a client **Deployment** configuration file, **client-deployment.yaml**

> Refer to **client-deployment.yaml** for comments on the properties.

#### Lesson 171

> **Housekeeping tip:** Recall that in previous lessons there was a client pod deployed. It will be cleaned up before deploying the new Deployment

1. To remove an object, execute the command,

		kubectl delete -f <config file>, e.g.
		
		kubectl delete -f client-pod.yaml
		
	> This is an **Imperative** command, and is ok for existing object deletions to a cluster because currently there is really no other way to accomplish this task.
	
	> The process of a **Pod** being deleted is the same as a **container** being deleted by the **Docker CLI**. When a container is stopped/deleted, it is given 10 seconds to stop before being deleted. This same time interval happens with **kubectl delete**.
	
	Executing **`kubectl get pods`** should now return, **"No resources found."**

2. To create the new **Deployment** execute,

		kubectl apply -f client-deployment.yaml
		
	should return
		
		deployment.apps/client-deployment created

3. To examine the Pod status execute,

		kubectl get pods
		
	returns
		
		NAME                                READY   STATUS    RESTARTS   AGE
		client-deployment-6dd64ffd7-984bx   1/1     Running   0          19h
		
4. to print out the status of the Deployment execute,

		kubectl get deployment
		
	returns
		
		NAME                DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
		client-deployment   1         1         1            1           19h
		
	* **DESIRED** reflects the number of **replicas** in client-deployment.yaml
	* **CURRENT** is the current number of running pods
	* **UP-TO-DATE** indicates the number of pods that are not synced with the config file.
	* **AVAILABLE** shows the number of pods that are successfully running their containers.

#### Lesson 172

* To verify the **multi-client** container is running in the cluster.

	> Remember, containers running in Pods managed by k8s are no longer accessed via **localhost**. Instead, we use the **IP** of the **node** and the **port** assigned to the **service/container** running inside the pod.

	1. Get the ip address of the node by executing,
	
			minikube ip
		
	2. Get the **nodePort** associated with the container from **client-node-port.yaml** (**31515**)
	3. Enter **`<ip address from minikube ip command>:3515`** in a browser window.

	This should display the application.

* Now is a great time to understand why **Service** objects are needed.

	* To start, execute,
	
			kubectl get pods -o wide
			
		returns
			
			NAME                                READY   STATUS    RESTARTS   AGE   IP           NODE
			client-deployment-6dd64ffd7-984bx   1/1     Running   0          2d    172.17.0.2   minikube 
			
		This adds two additional columns,
			
		* **IP** reflects the ip address of the pod.
		* **NODE** is the name of the node in which the pod is running.

	* ALL Pods get their own randomly assigned IP address.
	* The address is internal to the minikube virtual machine.
	* The address is internal to the minikube virtual machine.
	* It is not accessible outside of the pod.
	* The reason is that when the pod is deleted, updated, etc. it may well be assigned a new ip address.

**This is where Service objects become useful for development; they use their Selectors to automatically route traffic to the associated pods. As pods come and go, the Service objects abstract the connectivity layer from us.**

#### Lesson 173

* Make changes to **client-deployment.yaml** and verify the pod(s) are updated.

	1. Change **containerPort** from **3000** to **9999** save and execute,
			
			kubectl apply -f client-deployment.yaml
			
		returns
			
			deployment.apps/client-deployment configured
	
		> *configured* means a change was made to an existing deployment.
	
	2. Execute,
		
			kubectl get pods
			
		returns
			
			NAME                                 READY   STATUS    RESTARTS   AGE
			client-deployment-65f586b878-9zw4r   1/1     Running   0          2m
			
		> k8s saw the port change to the **template** section of **client-deployment.yaml**, deleted the previous pod and recreated it rther than try to update it with the new port number.
		
	3. To verify the port was changed, execute,

			kubectl describe pod client-deployment-65f586b878-9zw4r
			
		returns the long-form description of the pod with the port change
			
			...
			
			Port:           9999/TCP

			...
		
		> The pod name is optional. Can use **pods** to return information of all pods.
	
	4. Change the number of **replicas** from **1** to **5** save and execute,
			
			kubectl apply -f client-deployment.yaml
	5. Then execute,
	
			kubectl get pods
			
		returns
			
			NAME                                 READY   STATUS              RESTARTS   AGE
			client-deployment-65f586b878-2spzw   0/1     ContainerCreating   0          1s
			client-deployment-65f586b878-67p7k   0/1     ContainerCreating   0          1s
			client-deployment-65f586b878-9zw4r   1/1     Running             0          16m
			client-deployment-65f586b878-hb5h2   0/1     ContainerCreating   0          1s
			client-deployment-65f586b878-wldgq   0/1     ContainerCreating   0          1s
			
	
		> This means there are 5 containers running in separate pods.
		
		> **REMEMBER** the number of replicas is the number of **pods** to be maintained
		
	6. Finally, change the **image** from **\<username\>/multi-client** to **\<username\>/multi-worker** save and execute,
	
			kubectl apply -f client-deployment.yaml

	7. ASAP after step 6, execute,
		
			kubectl get deployments
			
		returns
			
			NAME                DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
			client-deployment   5         7         3            4           3d

		* DESIRED is **5** because that's the number of replicas
		* CURRENT is **7** (at the moment the command was executed) ans is the **total** number of pods running. Subtracting the number of AVAILABLE pods tells us that there are **3** pods that re old and need to be deleted, (kubectl does this automatically).
		* UP-TO-DATE is **3** meaning 3 of the 5 pods have been updated
		* AVAILABLE is **4** meaning 4 of 5 pods are available.
	
		Executing `kubectl get deployments` again returns,
		
			NAME                DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
			client-deployment   5         5         5            5           3d
		
		This means that kubectl completed the updates and we have the DESIRED number of pods running.
		
#### Lessons 174 - 176

* How is a deployment updated when a new version of an image becomes available?

	> Before continuing, revert the changes to **client-deployment.yaml**

1. Switch the deployment use the multi-client image again.
	
	* Save the reverted changes to **client-deployment.yaml** and execute,
	
			kubectl apply -f client-deployment.yaml

	* Execute `minikube ip` to get the ip of the newly created pod.
	* Enter **\<k8s cluster ip\>:31515** into a browser window to verify we can access the client.

2. Update the multi-client image, rebuild, and push it to [Docker Hub](https://hub.docker.com/).
	
	* Open **.../client/src/App.js** in an editor.
	* Change `App-title` to something else, (dealer's choice) and save.
	* In the **client** directory build the image with the change,
	
			docker build -f prod.Dockerfile -t <username>/multi-client .
	* Push the new image to [Docker Hub](https://hub.docker.com/),
	
			docker push <username>/multi-client
3.  Get the deployment to recreate pods with the latest multi-client image.

	> At this point, there is no easy way to do this with k8s, see [k8s GitHub issue #33664](https://github.com/kubernetes/kubernetes/issues/33664). The reason is that is nothing in the k8s config file syntax that provides a way to recognize an image update.
	
	
	We will examine three ways to solve this problem.
	
	* Manually delete pods so the deployment will recreate them, (pulling the latest image) **This is not scalable**.
	* Tag images with a version and include version in the config file. **Adds an extra step in the deployment process**.
	* Use an **imperative** command to update the image version the deployment should use. **Uses an imperative command**. 

		> The third solution is what we will implement. It may not be the best, but it is reasonable.
		
	1. Tag the multi-client image with a version and push to Docker Hub.
		* From the **multi-docker** client directory, execute,
		
				docker build -f prod.Dockerfile -t <username>/multi-client:v2 .
				
			> Alternatively just add the tag without rebuilding the full image.
			
			and
				
				docker push <username>/multi-client:v2
			 
	2. Execute **kubectl** forcing the deployment to use the new image version,

			kubectl set image deployment/client-deployment client=<username>/multi-client:v2
			
		returns
		
			deployment.extensions/client-deployment image updated
			
		> To verify the update we can check the status of the pod, `kubectl get pods` as well as checking the update in the browser, (via `minikube ip`:31515)
		
* This may seem very complicated, and it is to a degree. When this process is productized it will all be automated in a script and thus become very easy.

#### Lessons 178 & 179

* Recall there are **TWO** versions of Docker running on your machine,

	1. The version that is running on the **minikube node**
	2. The version that was installed on the local computer.

* The Docker client on the local machine by default is configured to communicate with the Docker server also installed on the local machine.

* The local docker client can be configured in the **terminal window** to communicate with the version of the Docker server installed on a node in the k8s cluster. To do this execute,

		eval $(minikube docker-env)

> **This only works for the terminal window in which the command was executed.** 
			
* To see what specifically is being set by the *eval* bash command, execute,

		minikube docker-env
this should return something like,

		export DOCKER_TLS_VERIFY="1"
		export DOCKER_HOST="tcp://xxx.xxx.xxx.xxx:2376"
		export DOCKER_CERT_PATH="/Users/<user>/.minikube/certs"
		export DOCKER_API_VERSION="1.35"
		# Run this command to configure your shell:
		# eval $(minikube docker-env)

* Anytime the **Docker CLI** is invoked, (e.g. `docker ps`) it first looks at the **docker-env** to get the information it needs to execute a command.

> The **DOCKER_HOST** variable contains the ip address of the minikube server. This can be verified by executing `minikube ip` and comparing the two.

#### Lesson 180

* Why would we need to access the version of Docker running in the cluster when the nodes are managed by k8s?
	* Use the same Docker CLI **debugging** techiques
	* Manually kill containers to **test** k8s' ability to self-heal
	* **Delete** cached images in the node
	* and more

* As an example, to get the **command line** of a container, execute,

		docker ps
		
	This returns a bunch of k8s/Docker information. Looking at the top of the results should show something like,
	
		CONTAINER ID        IMAGE                        COMMAND                  CREATED             STATUS              PORTS               NAMES
		ecd46e15dd38        sund0g/multi-client          "nginx -g 'daemon of…"   5 seconds ago       Up 4 seconds                            k8s_client_client-deployment-789958dc67-qmsq7_default_574847cb-fa69-11e8-b1d5-080027
		
* Copy the **Container ID** and execute,

		docker exec -it <container ID> /bin/sh
		
	which puts us in in the container so we can do normal Docker debugging on the container.
	
	> Most of the Docker commands are available via **kubectl**
	
* To get to the **container command line** via **kubectl**,

	1. Execute,
			
			kubectl get pods
		
		this returns,
		
			NAME                                 READY   STATUS    RESTARTS   AGE
			client-deployment-789958dc67-qmsq7   1/1     Running   1          3d
			
	2. Copy the **NAME** of the pod and execute,

			kubectl exec -it <NAME> /bin/sh
			
* If an **image caching** issue is suspected, (k8s is not updating newer images), the classic Docker command **prune** could be used as a potential solution e.g.

		docker system prune -a
			 
> It is left to the the user to decide whether to use classic Docker or kubectl comands.

	
