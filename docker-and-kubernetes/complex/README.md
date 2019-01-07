### Table of Contents

* [Section 8: Building a Multi-Container Application](#89)
* [Section 9: "Dockerizing" Multiple Services](#89)
* [Section 14: A Multi-Container App with Kubernetes](#14)
* [Section 15: Handling Traffic with Ingress Controllers](#15)

---

<a name="89"></a>
## Sections 8 & 9: Building a Multi-Container Application & "Dockerizing" Multiple Services

The objectives for **sections 8 and 9** of the course are,

1. Take the lessons learned in section 7 and create multiple containers which can be modularly and easily maintained.
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

* **Notes for Sections 12 and 13 are in the [simple-k8s](https://github.com/sund0g/docker-tutorials/tree/master/docker-and-kubernetes/simple-k8s) README.md**

---

<a name="14"></a>
## Section 14: A Multi-Container App with Kubernetes

The objective for this section is to get the **Complex App** running in a **Production** environment.

The architecture will look like,

* 3 **client** pods
* 3 **server** pods
* 1 **worker** pod
* 1 **Redis** pod
* 1 **Postgres** pod
* 1 **Postgres** PVC
* **Traffic/routing** will be managed by an **Ingress** server and **Cluster IP Service**

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
	
	> If this happens, \^C to stop **docker-compose** and immediately rerun **docker-compose up** w/o the **--build** flag.
	
	> In a later lesson, we added the **`depends_on`** section for the **nginx** service in **docker-compose.yml** to solve this issue.
	
3. Navigate, (in a browser window) to **localhost:3050** to verify the application works as expected.
	
#### Lesson 184

* Before starting to migrate the **complex** application to kubernetes, delete the following from the **complex** directory,

	* **docker-compose.yml**
	* the **nginx** directory

	> The **travis.yml** and **dockerrun.aws.json** from **Section 7** are not here because I skipped that part of the course. When I go back and complete the section everything will be in **complex-elastic-beanstalk**.
	
* Now start the creation of the **k8s** configuration.

	1. Create a **k8s** subdir in the **complex** dir
	2. Create **client-deployment.yaml** in the **k8s** directory

	> Review the contents of **client-deployment.yaml** for details on how the deployment is configured.

#### Lessons 185 & 186

* What is a **ClusterIP** service and how does it differ from a **nodePort** service?

> Remember, a **service** is used any time we want to set up some kind of networking for an **object** such as a **pod**.

* **nodePort**,
	* is used for **development** purposes **only**
	* exposes **pods** to the outside world
	* requires a **port** and **tagetPort** but not **nodePort**

* **ClusterIP**,
	* exposes a set of **pods** to other **objects** in the **cluster**
	* does **not** allow access from the outside world.

> In general, a **ClusterIP** service is used when **objects** need to be accessed only by other **objects** in the **cluster**.

> An **Ingress** service is used for **Objects** in the cluster that need to be accessible to the **outside world**. More on this in subsequent lessons.

1. Create **client-cluster-ip-service.yaml** in the **k8s** directory.

> Review the contents of **client-cluster-ip-service.yaml** for details on how the service is configured.

#### Lesson 187

* Before creating the additional configuration files, the existing ones will be tested to ensure they are correct.
* This will be done by loading both configurations into the cluster via **kubectl**.

---

* Before doing this, delete the deployment created in previous lessons as follows,

		kubectl get pods
		
	to get the name of the old deployment *client-deployment*, then
	
		kubectl delete deployment client-deployment
		
	should return
	
		deployment.extensions "client-deployment" deleted
		
	> Executing **kubectl get deployments** again should return **No resources found** verifying the deployment was deleted.
	
* Also delete the service that was created to provide network services to the deployment as follows,

		kubectl get services
		
	to get the name of the network service *client-node-port*, then
	
		kubectl delete service client-node-port
		
	should return
	
		service "client-node-port" deleted
		
	> Executing **kubectl get services** should return only the kubernetes service which is required for kubernetes to run on the system.

---

Once everything is cleaned up, deploy the configuration files by executing,

		kubectl apply -f k8s
		
> Each configuration file *could* be listed in the apply; having all the configuration files in the same directory allows the shortcut used above.

should return

	service/client-cluster-ip-service created
	deployment.apps/client-deployment created
	
To see the details of the deployment,

	kubectl get deployment
	
should return

	NAME                DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
	client-deployment   3         3         3            3           1h

> Remember, there are 3 pods because we set **replicas: 3** in **client-deployment.yaml**

	kubectl get pods
	
should return

	 NAME                                READY   STATUS    RESTARTS   AGE
	client-deployment-6dd64ffd7-24bgn   1/1     Running   0          1h
	client-deployment-6dd64ffd7-f258j   1/1     Running   0          1h
	client-deployment-6dd64ffd7-mtmsm   1/1     Running   0          1h

and finally,

	kubectl get services
	
should return
	
	NAME                        TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)    AGE
	client-cluster-ip-service   ClusterIP   10.96.45.139   <none>        3000/TCP   1h

### Takeaway
---

* Because there will be 11-12 configuration files to manage, using the **kubectl apply -f k8s** shortcut will save quite a bit of time in the following lessons.

---

#### Lessons 188 & 189

Create the **Express API/multi-server** and associated **ClusterIP** service configuration files,

* **server-deployment.yaml**
* **server-cluster-ip-service.yaml**

> Review the contents of **server-deployment.yaml** and **server-cluster-ip-service.yaml** for details on how the service is configured.

> Remember port 5000 was hardcoded into the server **index.js** file,

> app.listen(5000, err => {
  console.log('Listening');
});

> This has to be included in the **ClusterIP** service.

#### Lesson 190

> The objective of this lesson is to learn an alternative way of managing configuration files by merging them into a single file as it makes sense.

* Combining multiple configuration files is dead simple, just copy the contents of the files into a single file and separate the configs with a, 

		---
		
	However, this may be a bit confusing for maintenance. It is left to personal preference as to which model to follow. I am following the **keep everything in separate files** model as presented in the course

#### Lesson 191

Create the **worker-deployment.yaml** configuration.

> Review the contents of **worker-deployment.yaml** for details on how the service is configured.

#### Lesson 192

* Apply the 3 configuration files created in Lessons 188, 189, & 191 to the cluster,
	
	> This is being done to check for any obvious syntax errors in the files.
	
	
	> Also, the pods may not run correctly because the Redis and Postgres environment variables have not been added to the configuration. This will be done later.


		kubectl apply -f k8s 
	
* Executing

		kubectl get pods
	
	shows the number of pods that we have,
	
		NAME                                 READY   STATUS    RESTARTS   AGE
		client-deployment-6dd64ffd7-24bgn    1/1     Running   0          21h
		client-deployment-6dd64ffd7-f258j    1/1     Running   0          21h
		client-deployment-6dd64ffd7-mtmsm    1/1     Running   0          21h
		server-deployment-5f6466b8f6-2fkck   1/1     Running   0          3m
		server-deployment-5f6466b8f6-gmmbn   1/1     Running   0          3m
		server-deployment-5f6466b8f6-q9886   1/1     Running   0          3m
		worker-deployment-5cd7f9d8ff-59bvh   1/1     Running   0          3m
	
* Executing 

		kubectl get deployments
		
	shows the number of deployments as a result of adding the new configurations,
	
		NAME                DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
		client-deployment   3         3         3            3           21h
		server-deployment   3         3         3            3           5m
		worker-deployment   1         1         1            1           5m
		
* Executing

		kubectl get services
		
	shows the network services for the **client** and **worker**,
	
		NAME                        TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)    AGE
		client-cluster-ip-service   ClusterIP   10.96.45.139    <none>        3000/TCP   21h
		kubernetes                  ClusterIP   10.96.0.1       <none>        443/TCP    52d
		server-cluster-ip-service   ClusterIP   10.105.80.248   <none>        5000/TCP   6m

* The logs can also be examined as we like for additional information on what is going on in the pods, e.g.

		kubectl logs server-deployment-5f6466b8f6-2fkck
		
	returns 
	
		> @ start /app
		> node index.js

		Listening
		{ Error: connect ECONNREFUSED 127.0.0.1:5432
		    at TCPConnectWrap.afterConnect [as oncomplete] (net.js:1117:14)
		  errno: 'ECONNREFUSED',
		  code: 'ECONNREFUSED',
		  syscall: 'connect',
		  address: '127.0.0.1',
		  port: 5432 }
		  
	This tells the following, (which is expected),
	* **nodeJS** was executed (the default **npm** command)
	* The **connection error** is because there is currently no copy of **Redis** available.
	* Port **5432** was used as the default port, (from Redis).

#### Lesson 193

Create the **Redis** and associated **ClusterIP** service configuration files,

* **redis-deployment.yaml**
* **redis-cluster-ip-service.yaml**

> Review the contents of **redis-deployment.yaml** and **redis-cluster-ip-service.yaml** for details on how the service is configured.

#### Lesson 194

Create the Postgres and associated ClusterIP service configuration files,

* postgres-deployment.yaml
* postgres-cluster-ip-service.yaml

> Review the contents of **postgres-deployment.yaml** and **postgres-cluster-ip-service.yaml** for details on how the service is configured.

#### Lesson 195

A quick review on what a **volume** is and why it's needed for **Postgres**.

* When **volumes** were used in previous **Docker** lessons, it was so that code updates could be written to a volume and show up in the **container**.
* With **Postgres** it is the other way around; **write requests** will be sent to the volume instead of the the local storage inside the container. 

	This is so that when the pod is recreated, the data will persist.
	
> **NOTE on multiple database pods: Simply changing the number of database instances in a k8s cluster that point to the same volume will not work. If a database needs to be scaled up, there are additional, safe methods for doing that. This is not particular to k8s; it is a database architecture thing.**

#### Lesson 196 & 197

In **k8s** it is critical to know the following about **volumes**

**Definition of Volume** 

* **Docker**: Some type of mechanism that allows a container to access a filesystem outside of itself.
* **Kubernetes**: An **object** that allows a container to store data **at the pod level**, i.e. the storage is inside the pod.

When **persistent data** is required, a **volume** will not be used because its lifecycle is the **same as the pod on which it resides.**

The following two **k8s objects** are what should be used for persistent data,

* **Persistent Volume Claim**
* **Persistent Volume**

> **k8s Volumes** are not used as part of this course.

Storage for a **Persistent Volume** is outside the pod.

#### Lesson 198

> **GOAL**: learn the difference between **Persistent Volume** and **Persistent Volume Claim**

* A **Persistent Volume Claim** is analogous to an **advertisement**. In **k8s**, configuration files are created such that the **PVC** is *advertised* as available to other objects.

* There are **two** types of **Persistent Volumes**
	* **Statically** provisioned
		* Created ahead of when needed.
		* Can be used immediately
	* **Dynamically** provisioned
		* Created only when specified in a **configuration**

#### Lessons 199, 200, & 201

> **GOAL**: Create a **Persistent Volume Claim**

> Remember, a **PVC** is not an actual instance of storage. It is something that is attached to a **pod config**.

* Create the **claim database-persistent-volume-claim.yaml**

> Review the contents of **database-persistent-volume-claim.yaml** for details on how the **PersistentVolumeClaim** is configured.

* There are **three** types of **Access Modes**
	* **ReadWriteOnce**: Can be used by a **single** node.
	* **ReadOnlyMany**: **Multiple** nodes can **read**
	* **ReadWriteMany**: Can be **read** from and **written** to by **many** nodes.

* **By default**, k8s **creates** persistent volumes on the **local computer**

* To see where storage is being allocated on the local computer,

		kubectl get StorageClass
		
	returns something like,
	
		NAME                 PROVISIONER                AGE
		standard (default)   k8s.io/minikube-hostpath   53d
		
* Executing

		kubectl describe StorageClass
		
	returns additional information,
	
		Name:            standard
		IsDefaultClass:  Yes
		Annotations:     kubectl.kubernetes.io/last-applied-configuration={"apiVersion":"storage.k8s.io/v1","kind":"StorageClass","metadata":{"annotations":{"storageclass.beta.kubernetes.io/is-default-class":"true"},"labels":{"addonmanager.kubernetes.io/mode":"Reconcile"},"name":"standard","namespace":""},"provisioner":"k8s.io/minikube-hostpath"}
		,storageclass.beta.kubernetes.io/is-default-class=true
		Provisioner:           k8s.io/minikube-hostpath
		Parameters:            <none>
		AllowVolumeExpansion:  <unset>
		MountOptions:          <none>
		ReclaimPolicy:         Delete
		VolumeBindingMode:     Immediate
		Events:                <none 
		
	**minikube-hostpath** identifies the storage path as being part of the **minikube** environment on the local computer.
	
* This sounds fairly simple and it is until the configuration is migrated to a **cloud provider** where there are **multiple provisioners**.

> For examples of **provisioners**, refer to the [k8s Storage Classes documentation](https://kubernetes.io/docs/concepts/storage/storage-classes/#provisioner)

#### Lessons 202 & 203

* Now that there is a better understanding of **PVCs** let's look at how to **designate** one in a **pod template**

1. Add the **Claim** to **postgres-deployment.yaml**

	> Review the contents of **postgres-deployment.yaml** for details on how the **PersistentVolumeClaim** is attached to the **pod config**.

2. Deploy the updated **postgres** configuration files,

		kubectl apply -f k8s
		
	> Execute the **kubectl** *get* commands, (pods, deployment, et al) to verify the pods and services were deployed.
	
3. Execute

		kubectl get pv
		
	to get the details of the **Persistent Volume**
	
		NAME                                       CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS   CLAIM                                      STORAGECLASS   REASON   AGE
		pvc-ce8c9cb6-0010-11e9-9053-080027ce12f1   2Gi        RWO            Delete           Bound    default/database-persistent-volume-claim   standard                9m

	**Bound** means the volume is bound to the pod.
	
4. Execute,
	
		kubectl get pvc
		
	to list out the **Persistent Volume Claims/Advertisements** 
	
		NAME                               STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS   AGE
		database-persistent-volume-claim   Bound    pvc-ce8c9cb6-0010-11e9-9053-080027ce12f1   2Gi        RWO            standard       11m

> At this point, if the Postgres pod is deleted, the data in the **Persistent Volume** should remain. This will be tested in subsequent lessons.

#### Lessons 204 & 205

* One of the final configuration steps is to add the **Redis** and **Postgres** environment variables so the **server** and **worker** pods can communicate with the **databases**.
	
	> **Environment variables** are placed in the **container spec section** as an array with the section name of **env:**
	
	The variables that will be added are the same as with **docker-compose**,
	
	* REDIS_HOST
	* REDIS_PORT
	* PGUSER
	* PGHOST
	* PGDATABASE
	* PGPORT
	* PGPASSWORD

1. Add
	* **REDIS_HOST** 
	* **REDIS_PORT** 
	
	to **worker-deployment.yaml** *it needs to communicate with the Redis database.*

2. Add
	* **REDIS_HOST** 
	* **REDIS_PORT**
	* **PGUSER**
	* **PGHOST**
	* **PGPORT**
	* **PGDATABASE**

	to **server-deployment.yaml** *It needs to communicate with both the Redis and Postgres databases.*
	
#### Lesson 206

* Setting the **Postgres password** is what provides access to the **database**. 

### NOTE
---

**Passwords** should **NEVER** be set in clear text in any file. They should be created as **secrets** which can then be used in a secure manner.

---

* **k8s** provides a [**secret** object](https://kubernetes.io/docs/concepts/configuration/secret/) to provide this functionality. **Secrets** securely store pieces of information in the cluster such as,

	* **passwords**
	* **API keys**
	* **SSH keys**
	* any type of data that should not be easily exposed to the outside world.

* As a general rule, **objects** are created with a **configuration file**. However, with **secrets** an **Imperative command** is used to generate the **secret** object.

	> Because an **Imperative command** is used to create the **secret** it must be **manually executed** in the environment in which it is to be used.

* To create a **secret** that **k8s** can use,

		kubectl create secret generic pgpassword --from-literal PGPASSWORD=drowssap54321
		
	returns
	
		secret/pgpassword created
		
	> **create secret** can create 3 types of secrets,
	> 
	> * **generic**: used for general passwords and keys
	> * **docker-registry**: used for custom Docker registries, (such as privately hosted). 
	> * **tls**: Used for HTTPS

* To examine to secret

		kubectl get secrets
		
	returns
	
		NAME                  TYPE                                  DATA   AGE
		default-token-txgp9   kubernetes.io/service-account-token   3      54d
		pgpassword            Opaque                                1      1m

	This tells us the **pgpassword** secret has one (**DATA**) key/value pair associated with it. This pair is the key/value that was entered in the **kubectl create secret** command above.
	
#### Lessons 207, 208, & 209

* To add the Postgres secret created in the previous lesson to the **server-deployment.yaml** and **postgres-deployment.yaml** files as **environment variables**

* Adding the secret to **server-deployment.yaml** tells the **server** what the password is.

* Adding the secret to **postgres-deployment.yaml** tells the database what password to use anytime a connection is made to it.


	> Review the contents of **server-deployment.yaml** and **postgres-deployment.yaml** for details on how the password secret is added to the deployments. 
	
* To apply the changes execute,

		kubectl apply -f k8s
		
#### Lesson 210	

* when the configuration changes were applied in the previous lesson, the following error was returned,
	
		...
		"k8s/worker-deployment.yaml": cannot convert int64 to string
		
	This has nothing to do with the secrets, rather the port numbers that were added as integers.
	
* This is because **environment variable values** must be provided as **strings**.

* To fix the errors add **single quotes** around all integer instances of the **port numbers**, e.g.

		value: 6379 changes to 
		value: '6379'
		
* executing `kubectl apply -f k8s` after the changes should rectify the errors

### Takeaway
---

**environment variable values** must be provided as **strings**.

---

<a name="15"></a>
## Section 15: Handling Traffic with Ingress Controllers

#### Lesson 211

* Thus far **NodePort** and **ClusterIP** have been discussed. Before addressing **Ingress**, we will discuss the **LoadBalancer** service and why it will not be used as part of this course.

* The **LoadBalancer** service is the legacy object for getting **outside network traffic** into a **cluster**. It does **two** separate things,

	1. Provides access to a **single set of pods**. The **complex** application requires outside access to **multi-client** and **multi-server** pods, so the LoadBalancer service will not work for this application. 
	2. **k8s** connects with the **Cloud provider** and provisions a **classic Load Balancer** and automatically configures it to send traffic to the **LoadBalancer** service.

> The **Ingress** service is considered the **modern** approach to directing traffic into a cluster.

#### Lesson 212

* **k8s** leverages several implementations of an **Ingress** service. This course will focus on the **nginx** implementation only.

> **IMPORTANT** This course uses the **[ingress-nginx](https://github.com/kubernetes/ingress-nginx)** community led project, **NOT** the **[kubernetes-nginx](https://github.com/nginxinc/kubernetes-ingress)** project led by the company **[nginx](https://www.nginx.com/)**.

#### Lesson 213

* The setup of **nginx-ingress** varies depending on the environment, (**local, GCP, AWS, Azure**). This course utilizes the **local** and **GCP** environments, and so the nginx-ingress setup will be specific to them.

#### Lesson 214

* The **Ingress** service is a **controller** object, just like the **Deployment** object, i.e. it the **Ingress configuration file** defines a set of **routing rules** and their **desired state** for which **kubectl** will create an **Ingress controller** object that constantly maintains the **desired state**.

> When **kubectl** processes the Ingress **configuration file**, it will create a **pod** running **nginx**.

* To recap, there are **three** separate components that comprise the **Ingress** service,

	1. **Ingress configuration file**: contains the set of rules describing how traffic is to be routed.
	2. **Ingress Controller**: object that watches for changes to the **configuration** and updates the *infrastructure*.
	3. **Infrastructure**: the *thing* that actually handles the traffic.

	> For the **[ingress-nginx](https://github.com/kubernetes/ingress-nginx)** implementation used for this course, the **Ingress Controller** and **Infrastructure** are combined into a single object.
	
#### Lessons 215 & 216

Looking behind the scenes at what will happen when we deploy **nginx** to **GCP**,

* The **Ingress Configuration** is fed into a **Deployment** consisting of a **nginx controller** and a **nginx pod**.
* An instance of a **[GCP Load Balancer](https://cloud.google.com/load-balancing/)** object will be created that directs traffic to our cluster.
* The **nginx controller/pod** deployment will also get a **LoadBalancer** service attached to it.

	> This is the same **LoadBalancer** service described in **Lesson 211**. Even though we said we should not be specifically using this legacy service, it **is** still used behind the scenes when deploying in **GCP**.
	
	> This would be unknown to us unless we examined the source code that sets up Ingress in **GCP**.

* A **default-backend** deployment is set up inside the cluster. This is used for a series of **health-checks** to ensure the cluster is performing as expected.

	> Ideally the default-backend pod would be replaced with the **ExpressAPI/multi-server pod(s)**.
	
	> This will be explained later, but for now, be aware that the **default-backend** will be used for this course.

### Takeaways
---

1. The reason **[ingress-nginx](https://github.com/kubernetes/ingress-nginx)** is being used instead of just using a **custom** nginx, (like in previous sections) is that there is logic built into **[ingress-nginx](https://github.com/kubernetes/ingress-nginx)** that bypasses the **ClusterIP** service and sends requests to a specific pod, emulating **[sticky sessions](http://wiki.metawerx.net/wiki/StickySessions)**. There are other reasons as well that are not discussed here.

2. For a deeper dive into **ingress-nginx** check out **[Studying the Kubernetes Ingress system](https://www.joyfulbikeshedding.com/blog/2018-03-26-studying-the-kubernetes-ingress-system.html)**

---

#### Lesson 217

* To start setting up **[ingress-nginx](https://github.com/kubernetes/ingress-nginx)** for the **Complex** project, the directions in the **[GitHub repo](https://github.com/kubernetes/ingress-nginx)** will be followed,

	1. Navigate to the **[repo](https://github.com/kubernetes/ingress-nginx)**.
	2. Select the **[NGINX Ingress Controller for Kubernetes](https://kubernetes.github.io/ingress-nginx/)** documentation link.
	3. Select the **[Deployment](https://kubernetes.github.io/ingress-nginx/deploy/)** tab at the top.
	4. Select the **[Prerequisite Generic Deployment Command](https://kubernetes.github.io/ingress-nginx/deploy/#prerequisite-generic-deployment-command)**
	5. Execute the command, (this must be done for all environments),
	
			kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/master/deploy/mandatory.yaml
			
		> To see the specifics of what is happening, examine the yaml file by entering it into a browser window,
	
			https://raw.githubusercontent.com/kubernetes/ingress-nginx/master/deploy/mandatory.yaml
			
		> If we wanted to use our own healthchecks instead of the **default-backend**, we would follow the 2 steps in the **default-http-backend** configuration.
	
	6. Select **[minikube](https://kubernetes.github.io/ingress-nginx/deploy/#minikube)** Set up the **local** environment.
	7. Copy and execute the command for standard usage,

			minikube addons enable ingress
			 
		should return,
		
			ingress was successfully enabled
			
#### Lesson 218

* To create the **routing rules** for use inside the **complex** application,

	> The rules created as part of the **Elastic Beanstalk** project in **Section 7** will be reused here, i.e.
	
	>	* if the request has a path of '**/**', route to the **client**
	>	* if the request has a path of '**/api**', route to the **server**

	1. Create **ingress-service.yaml** in the **k8s** directory.

	> Review the contents of **ingress-service.yaml** for details on how the service is configured.
	>
	> Not going into a lot of detail on the spec section now, that will come later.
	
	2. Deploying the networking rules just created,

			kubectl apply -f k8s
			
		should return
		
			ingress.extensions/ingress-service created
			
#### Lesson 219

* To test the Ingress locally,

	1. Get the IP of **minikube**
		
			minikube ip
			
	2. enter the returned IP into a browser window and verify the Fibonacci app functions correctly.

	> No ports are needed on the end of the IP address this time; the **Ingress controller** created in the previous lessons is autimatically listening on ports **80** and **443**.
	
	> Also the **"not safe"** certificate message will only happen in the local environment. When the the application is pushed to Production in the next section, this will be addressed.
	
#### Lesson 220

* At this point, it is time to learn about the **minikube dashboard** to start the dashboard execute,

		minikube dashboard
		
	this will open the dashboard in the default browser.
	
	> **Replica Sets** and **Replication Controllers** are being deprecated in favor of **Deployments**.
	
* While changes *can* be made inside the dashboard, these are **Imperative** and are not recommended.

	> Explore the dashboard; it is useful for examining the status of the cluster.