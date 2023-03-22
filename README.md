# Membrane Backend v1.0.0

<p align="center">
  
  <img src="Tradesocket.png" width="500" height="300">
  
</p>
<p align="center"><i>This image was generated with Dall-e 2 AI</i></p>

<br>
<br>
<br>
          


The Membrane Backend CC is a Node.js server application that serves as a bridge between different market data sources and a client-side application that displays the data. The objective of this application is to provide a unified API that allows the client-side application to request market data from different sources without having to worry about the specifics of each source.

The application stack includes the following packages:

* Express: A web application framework for Node.js
* Axios: A Promise-based HTTP client for the browser and Node.js
* Morgan: HTTP request logger middleware for Node.js
* Winston: A versatile logging library for Node.js
* Cors: Middleware for handling cross-origin resource sharing (CORS) in Node.js
The Membrane Backend CC uses a microservices architecture to fetch data from different market data sources. The microservices are implemented using the Express framework and use Axios to make HTTP requests to the market data sources. The main server application provides endpoints for the client-side application to request market data from the different microservices.

The Membrane Backend CC implements the following microservices:

* Data Provider Service: Fetches order book data and calculates the effective price for a given quantity
Market Depth Service: Fetches real-time market depth data using websockets
The Data Provider Service microservice provides the client-side application with endpoints to fetch order book data and calculate the effective price for a given quantity. These endpoints will be used by the client-side application to display the order book and provide the user with a way to place orders.

* The Market Depth Service microservice provides real-time market depth data using websockets, which will be used by the client-side application to display a visual representation of the market depth.

The Membrane Backend CC uses Docker to provide a consistent environment for development, testing, and deployment. The application can be easily deployed using Docker Compose.

The Membrane Backend CC fulfills part of the requirements of the technical challenge by providing the client-side application with a unified API to fetch market data from different sources. Additionally, the application provides endpoints to fetch order book data and calculate the effective price for a given quantity. The Market Depth Service microservice provides real-time market depth data using websockets, which is a requirement of the technical challenge.

Jest is used to test the different parts of the application, ensuring that everything is working as expected. The Membrane Backend CC implements unit tests, integration tests, and end-to-end tests to ensure that the application is working correctly.

# Architecture:

This architecture provides a separation of concerns, making the application more modular and maintainable. In this project, this architecture is being used to create a backend web server that processes data from a web socket and interacts with the business layer to return a response.


* The application layer (src/microservices/):

Contains the application logic that processes the integration though websockets. It communicates with the data layer to perform Real time communication with Bitfinex API. It's responsible for implementing business rules and orchestrating the data retrieval and data processing.


* The routes layer (api/routes/): Contains the routes that define the API endpoints and their corresponding controllers. In this project, the routes.js file defines the /api endpoints and maps it to each microservice.

* The testing layer (tests/): Contains the files needed for automated testing of the application. It includes tests of the application layer and the controller layer.


# Rest of the structure explanation:

### .gitignore: 
File that specifies the files and directories to be ignored by Git.

### README.md: 
File containing the project documentation.

### package.json: 
NPM configuration file that specifies the dependencies and scripts of the project.

### Dockerfile: 
The Dockerfile specifies how to build the Docker image for the application in this project. It defines the environment and dependencies needed to run the application, and packages them into a container that can be easily deployed and run in different environments.

### server.js:
Is file is entry point of the application that starts the local server, specifies API routes, and set the CORS, Helmet and Winston configuration.

### .dockerignore:
File specifies the files and directories to be ignored when building the Docker image for the application, making the image smaller and faster to build.


# Requirements:

* [NodeJS](https://nodejs.org/en/download "NodeJS")
* [Docker](https://docs.docker.com/engine/install/ubuntu/)
* [Javascript](https://www.npmjs.com/package/javascript)

# Dependencies description in this project:

* Jest: 
A testing library for JavaScript code. It will be used to write unit and integration tests to ensure the quality and correctness of the code in this project.

* Morgan: 
A middleware that logs HTTP requests and responses for Node.js. It will be used to log incoming requests and responses in the server's console for debugging and monitoring purposes.

* Nodemon: 
A tool that watches for file changes and automatically restarts the Node.js server. It will be used to speed up development by automatically restarting the server when code changes are made.

* Standard: 
A JavaScript linter that helps to enforce consistent style and good practices in the code. It will be used to ensure that the code in this project adheres to the Standard style and best practices.

* Winston: 
A versatile logging library for Node.js. It will be used to log server events and errors to different transports (such as console, file, or third-party services) for debugging and monitoring purposes.

* Cors: 
A middleware that enables Cross-Origin Resource Sharing (CORS) in the server. It will be used to allow requests from different domains or origins to access the API endpoints in this project.

* Express: 
A minimalist web framework for Node.js. It will be used to create the Application program interface.

* dotenv: A zero-dependency module that loads environment variables from a .env file into process.env. It will be used to store sensitive information like API keys and database credentials.

* axios: 
A promise-based HTTP client for Node.js and the browser. It will be used to make HTTP requests to external APIs.

## Before start, to use the project locally install npm dependencies:

You have to use the following command to start a development server:

```sh
npm install
```

## To run development mode:

You have to use the following command to start a development server:

```sh
npm run dev
```


## To run the code in production mode locally:

```sh
npm start
```

## Trigger the endpoint GET contacts/sync on local server:

```sh
http://localhost:3000/api/data-provider
```


# Tests:

Following tests libraries are used for unit/integration tests:
* [Jest](https://www.npmjs.com/package/jest)


Tests are kept next to source with following pattern *.test.js

Use following command to run tests:

```sh
npm test
```


# Docker:


* To create de Docker image:

```sh
docker build -t tradesocket .
```

This will create our docker image.

* Run the container

```sh
docker run -p 3000:8080 tradesocket
```

See `Dockerfile` for more details.
