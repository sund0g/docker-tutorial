
const express = require ('express');
const redis = require ('redis');

// Adding this this simulate an app crash as part of lesson 53.
const process = require ('process');

// Create app instance of Express
const app = new express();

// Create client connection to the Redis server
const client = redis.createClient({
    // 'redis-server' doesn't mean anything to Node. It assumes we know what
    // we're doing. 'redis-server' comes from the redis service name in
    // docker-compose.yml. If we weren't using Docker, the host would be
    // something like, 'https://my-redis-server.com'.
    host: 'redis-server',
    // 6379 is the default Redis port. Adding it here for completness.
    port: '6379'
});

// Initialize visits to start at 0
client.set('visits', 0);

// Add handler for rot route
app.get('/', (request, response) => {

    // Adding exit to simulate server crash as part of lesson 53.
    //process.exit(0);

    client.get('visits', (error, visits) => {
        response.send('Number of visits is ' + visits);
        // 'visits' comes back as a string, so cast it to integer with parseInt
        client.set('visits', parseInt(visits) + 1);
    });
});

// Set up app listener
// !!! NOTE: this has to be the same port as the one specified in 
// docker-compose.yml
const port = 8081;

app.listen (port, () => {
    console.log('Listening on port', port);
});