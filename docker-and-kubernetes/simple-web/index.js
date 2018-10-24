// require the Express linrary that we marked as a dependency in package.json
const express = require ('express');

// Create an app instance of type Express.
const app = express();

// Set up a single router handler.
// Anyone visiting the 'root route' ('/'), the app will send back the response,
// "Hi there!".
app.get ('/', (request, response) => {
    response.send ('Hi there!');
});

// Set up app to listen on a port, and print to the console after the app is
// successfully listening on the port.
//
// NOTE:    this port has to be mapped (-p) when starting the container, e.g. 
//
//          docker container run -p <localhost-port>:8080 <container>
const port = '8080';

app.listen (port, () => {
    console.log ('Listening on port', port);
});