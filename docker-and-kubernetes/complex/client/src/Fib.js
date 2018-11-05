import React, { Component } from 'react';
// Axios is used to make calls to the backend Express server
import axios from 'axios';

class Fib extends Component {
  // Default state
  state = {
    seenIndexes: [],
    values: {},
    index: ''
  };

  // Lifecycle methods
  componentDidMount() {
    this.fetchValues();
    this.fetchIndexes();
  }

  // Asynchronous method that gets tha fibonacci values.
  async fetchValues() {
    const values = await axios.get('/api/values/current');
    this.setState({ values: values.data });
  }

  // Get the indexes that have been requested and stored in Postgres.
  async fetchIndexes() {
    const seenIndexes = await axios.get('/api/values/all');
    this.setState({
      seenIndexes: seenIndexes.data
    });
  }

  // handleSubmit is a bound async function
  handleSubmit = async event => {
    // Prevent from submitting as default
    event.preventDefault();

    await axios.post('/api/values', {
      index: this.state.index
    });
    this.setState({ index: '' });
  };

  renderSeenIndexes() {
    // Iterate over 'seenIndexes' and pull out and return the number.
    // These numbers are what we will display to the user.
    // Remember this is being pulled from Postgres.
    return this.state.seenIndexes.map(({ number }) => number).join(', ');
  }

  renderValues() {
    // Remember this is being pulled from Redis, which return an object,
    // so we have to break out the key/value pairs appropriately.
    const entries = [];

    // Iterate over the values we have in the object.
    // key represents the index of the Fibonacci number.
    for (let key in this.state.values) {
      entries.push(
        <div key={key}>
          For index {key} I calculated {this.state.values[key]}
        </div>
      );
    }

    return entries;
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>Enter your index:</label>
          <input
            value={this.state.index}
            onChange={event => this.setState({ index: event.target.value })}
          />
          <button>Submit</button>
        </form>

        <h3>Indexes I have seen:</h3>
        {this.renderSeenIndexes()}

        <h3>Calculated Values:</h3>
        {this.renderValues()}
      </div>
    );
  }
}

export default Fib;
