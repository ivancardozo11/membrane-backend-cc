# Membrane Backend CC

<p align="center">
  
  <img src="Tradesocket.png" width="500" height="300">
  
</p>
<p align="center"><i>This image was generated with Dall-e 2 AI</i></p>

<br>
<br>
<br>
          


The Membrane Backend CC is a Node.js server application that serves as a bridge between different market data sources and a client-side application that displays the data. The objective of this application is to provide a unified API that allows the client-side application to request market data from different sources without having to worry about the specifics of each source.

The application stack includes the following packages:

Express: A web application framework for Node.js
Axios: A Promise-based HTTP client for the browser and Node.js
Morgan: HTTP request logger middleware for Node.js
Winston: A versatile logging library for Node.js
Cors: Middleware for handling cross-origin resource sharing (CORS) in Node.js
The Membrane Backend CC uses a microservices architecture to fetch data from different market data sources. The microservices are implemented using the Express framework and use Axios to make HTTP requests to the market data sources. The main server application provides endpoints for the client-side application to request market data from the different microservices.

The Membrane Backend CC implements the following microservices:

Data Provider Service: Fetches order book data and calculates the effective price for a given quantity
Market Depth Service: Fetches real-time market depth data using websockets
The Data Provider Service microservice provides the client-side application with endpoints to fetch order book data and calculate the effective price for a given quantity. These endpoints will be used by the client-side application to display the order book and provide the user with a way to place orders.

The Market Depth Service microservice provides real-time market depth data using websockets, which will be used by the client-side application to display a visual representation of the market depth.

The Membrane Backend CC uses Docker to provide a consistent environment for development, testing, and deployment. The application can be easily deployed using Docker Compose.

The Membrane Backend CC fulfills part of the requirements of the technical challenge by providing the client-side application with a unified API to fetch market data from different sources. Additionally, the application provides endpoints to fetch order book data and calculate the effective price for a given quantity. The Market Depth Service microservice provides real-time market depth data using websockets, which is a requirement of the technical challenge.

Jest is used to test the different parts of the application, ensuring that everything is working as expected. The Membrane Backend CC implements unit tests, integration tests, and end-to-end tests to ensure that the application is working correctly.


# Structure tree:

<br>
<br>
<br>

├── src/

│   └── api/

│   │    ├── routes/

│   │       └── routes.js

│   ├── microservices/

│   │   ├── market-depth-service/

│   │   │   ├── api

│   │   │   │    └── marketDepthRoutes.js

│   │   │   ├── market-depth-analysis.js

│   │   │   ├── tests

│   │   │   ├── package.json

│   │   │   ├── Dockerfile

│   │   │   └── index.js

│   │   ├── data-provider-service/

│   │   │    ├── api

│   │   │    │    └── dataProviderRoutes.js

│   │   │    ├── data-consumer.js

│   │   │    ├── tests

│   │   │    ├── package.json

│   │   │    ├── Dockerfile

│   │   │    └── index.js

├── server.js

├── .gitignore

├── package.json

├── package-lock.json

├── .dockerignore

├── Dockerfile

├── docker-compose.yml

├── README.md

└── server.js
