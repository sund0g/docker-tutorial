## Building a Multi-Container Application

### NOTE
***This section is focused only on building the React application we will be containerizing. It is here only to provide insight into how the application works prior to putting its components into containers.***

***At the end of the section, there is the option and recommendation to download the client, server, and worker files from the course and use them instead of the files we built in this section. This is what has been done.***

The objectives for this section are,

1. Create an overly-complicated React application which will be containerized. The reason for the complicated design allows us to learn how to create and support multiple containers for an application.
2. Learn about **HTML5 [PushState](https://developer.mozilla.org/en-US/docs/Web/API/History_API) routing**. This does require some basic knowledge of [React Router](https://reacttraining.com/react-router/)

## Project-specific setup

This lesson requires some additional setup as follows below. **NOTE:** we will be using the `create-react-app` nodejs plugin installed as part of [**Section 6**](https://github.com/sund0g/docker-tutorials/tree/docker-and-k8s-section-7/docker-and-kubernetes/workflow#creating-a-production-grade-workflow).

1. Create the React app, **client**, (at the root of the **complex** directory),

		create-react-app client

