### Table of Contents

* [Section 8: Building a Multi-Container Application](#89)
* [Section 9: "Dockerizing" Multiple Services](#89)
* [Section 14: A Multi-Container App with Kubernetes](#14)

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

* **Notes for Sections 12 and 13 are in the ["simple-k8s"](https://github.com/sund0g/docker-tutorials/tree/master/docker-and-kubernetes/simple-k8s) README.md**

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

	> Review the contents of the **client-deployment.yaml** for details on how the deployment is configured.

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

> Review the contents of the **client-cluster-ip-service.yaml** for details on how the service is configured.

#### Lesson 187

* Before creating the additional configuration files, the existing ones will be tested to ensure they are correct.
* This will be done by loading both configurations into the cluster via **kubectl**.

--

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

--

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

> Review the contents of the **server-deployment.yaml** and **server-cluster-ip-service.yaml** for details on how the service is configured.

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

> Review the contents of the **worker-deployment.yaml** for details on how the service is configured.

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

> Review the contents of the **redis-deployment.yaml** and **redis-cluster-ip-service.yaml** for details on how the service is configured.

#### Lesson 194

Create the Postgres and associated ClusterIP service configuration files,

* postgres-deployment.yaml
* postgres-cluster-ip-service.yaml

> Review the contents of the postgres-deployment.yaml and postgres-cluster-ip-service.yaml for details on how the service is configured.
