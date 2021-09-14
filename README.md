# Udagram Image Filtering Application

Application URL: http://ab1a3bf7decc04346b4efb1a1e8625f9-218761061.us-east-2.elb.amazonaws.com:3000/


Udagram is a simple cloud application developed alongside the Udacity Cloud Engineering Nanodegree. It allows users to register and log into a web client, post photos and videos to the feed.

The project is split into two parts:
1. Frontend - React web application
2. Backend RESTful API - Node-Express application

## Getting Started
> _tip_: it's recommended that you start with getting the backend API running since the frontend web application depends on the API.

### Prerequisite
1. The depends on the Node Package Manager (NPM). You will need to download and install Node from [https://nodejs.com/en/download](https://nodejs.org/en/download/). This will allow you to be able to run `npm` commands.
2. Environment variables will need to be set. These environment variables include database connection details that should not be hard-coded into the application code.

#### Environment Script
A file named `sample_env.sh` has been prepared as an optional tool to help you configure these variables on your local development environment.
 
We do _not_ want your credentials to be stored in git. After pulling this `starter` project, run the following command to tell git to stop tracking the script in git but keep it stored locally. This way, you can use the script for your convenience and reduce risk of exposing your credentials.
`git rm --cached sample_env.sh`

Afterwards, we can prevent the file from being included in your solution by adding the file to our `.gitignore` file.

### 1. Database
Create a PostgreSQL database either locally or on AWS RDS. The database is used to store the application's metadata.

* We will need to use password authentication for this project. This means that a username and password is needed to authenticate and access the database.
* The port number will need to be set as `5432`. This is the typical port that is used by PostgreSQL so it is usually set to this port by default.

Once your database is set up, set the config values for environment variables prefixed with `POSTGRES_` in `sample_env.sh`.
* If you set up a local database, your `POSTGRES_HOST` is most likely `localhost`
* If you set up an RDS database, your `POSTGRES_HOST` is most likely in the following format: `***.****.us-west-1.rds.amazonaws.com`. You can find this value in the AWS console's RDS dashboard.


### 2. S3
Create an AWS S3 bucket. The S3 bucket is used to store images that are displayed in Udagram.

Set the config values for environment variables prefixed with `AWS_` in `sample_env.sh`.


### 3. Backend API
Launch the backend API locally. The API is the application's interface to S3 and the database.

* To download all the package dependencies, run the command from the directory `udagram-api/`:
    ```bash
    npm install .
    ```
* To run the application locally, run:
    ```bash
    npm run dev
    ```
* You can visit `http://localhost:8080/api/v0/feed` in your web browser to verify that the application is running. You should see a JSON payload. Feel free to play around with Postman to test the API's.

### 4. Frontend App
Launch the frontend app locally.

* To download all the package dependencies, run the command from the directory `udagram-frontend/`:
    ```bash
    npm install .
    ```
* Run the application with following command
    ```bash
    npm start
    ```


## Running Application Locally using docker-compose:
* All the parameters are configured and the image names provided from my dockerhub registry `mohit7me`. You can replace the image names with the local image names, or simply remove the repository name so that default names from docker-compose-build can be used.
* To build all the images locally execute following command:
    ```bash
    docker-compose -f docker-compose-build.yaml build --parallel
    ```
* Set the environment variables by executing commands from sample_env.sh
* Run the following command to setup the application in your system:
    ```bash
    docker-compose up
    ```
* This should deploy 5 containers for each service, that are: backend-feed, backend-user, backend-video, reverseproxy, and frontend.
* You can access your web application at `http://localhost:3000`
* Backend can be accessed at URL `http://localhost:8080`

## Running Application in EKS cluster:
* Create an EKS cluster with at least 2 `t3.xlarge` since there are 5 services are going to run on atleast 2 containers each (unless you change that to 1). 
* All the deployment manifests are provided in `deployment-yamls` folder.
* Populate the values in `aws-secret.yaml`, `env-configmap.yaml` and `env-secret.yaml` with correct values.
> Note: the values in `aws-secret.yaml` and `env-secret.yaml` must be base64 encoded.
* In your terminal go to `deployment-yamls` folder.
* Run following commands to deploy the configmap and secrets in K8s cluster:
    ```bash
    kubectl apply -f aws-secret.yaml
    kubectl apply -f env-secret.yaml
    kubectl apply -f env-configmap.yaml
    ```
* Deploy all the deployments and services for Udagram application with following command:
    ```bash
    kubectl apply -f k8s
    ```
* Check the deployment state of your application using `kubectl get pods` command. 
* Create an Loadbalancer service for `frontend` and `reverseproxy` with public endpoints using following command. 
    ```bash
    kubectl expose deployment reverseproxy --type=LoadBalancer --name=reverseproxy-public
    kubectl expose deployment frontend --type=LoadBalancer --name=publicfrontend
    ```
* To get the public endpoints for your application run `kubectl get svc` command.
* Use public endpoint associated with `publicfrontend` service to access yor web application. 
> Note: you might need to use the port number provided in the `kubectl get svc` for `publicfrontend` service to access the application. Also creating the loadbalancer takes a while so don't panic if web application doesn't come up right away. 
* Update `udagram-react-frontend/src/Config.js` file with the public endpoint of `reverseproxy-public` service. 
* Build a new image for your frontend and tag it with following commands. Go to `udagram-react-frontend` folder:
    ```bash
    docker build -t udagram-react-frontend .
    docker tag udagram-react-frontend udagram-react-frontend:v2
    ```
* Update fronend deployment with the new image with command: 
    ```bash
    kubectl set image deployment frontend frontend=mohit7me/udagram-react-frontend:v2
    ```

* After the new containers are up and running you the frontend application will be able to communicate with the backend services. 

## Tips
1. Take a look at `udagram-api` -- does it look like we can divide it into two modules to be deployed as separate microservices?
2. The `.dockerignore` file is included for your convenience to not copy `node_modules`. Copying this over into a Docker container might cause issues if your local environment is a different operating system than the Docker image (ex. Windows or MacOS vs. Linux).
3. It's useful to "lint" your code so that changes in the codebase adhere to a coding standard. This helps alleviate issues when developers use different styles of coding. `eslint` has been set up for TypeScript in the codebase for you. To lint your code, run the following:
    ```bash
    npx eslint --ext .js,.ts src/
    ```
    To have your code fixed automatically, run
    ```bash
    npx eslint --ext .js,.ts src/ --fix
    ```
4. `sample_env.sh` is really for your backend application. Frontend applications have a different notion of how to store configurations. Configurations for the application endpoints can be configured inside of the `environments/environment.*ts` files.
5. In `sample_env.sh`, environment variables are set with `export $VAR=value`. Setting it this way is not permanent; every time you open a new terminal, you will have to run `sample_env.sh` to reconfigure your environment variables. To verify if your environment variable is set, you can check the variable with a command like `echo $POSTGRES_USERNAME`.
