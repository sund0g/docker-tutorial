// Add file containing hostname and port for Redis server. 
const keys = require('./keys');

// Import Redis client
const redis = require('redis');

// Create Redis client
const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000 // Reconnect every second
});

// Watch Redis for messages when a new index value is submitted.
const sub = redisClient.duplicate();

// Using recursion because it is slow. While not efficient in a real
// scenario, we're using it here to demonstrate why we need a separate 
// "worker" process from the Redis client.
function fib(index) {
  if (index < 2) return 1;
  return fib(index - 1) + fib(index - 2);
}

// When a message is received, get the Fibonacci number of the index,
// (sent via message), and insert it into a hash table, (values), as
// message:<fibonacci value>
sub.on('message', (channel, message) => {
  redisClient.hset('values', message, fib(parseInt(message)));
});

// When an insert is received, put the new index into the Redis instance.
sub.subscribe('insert');
