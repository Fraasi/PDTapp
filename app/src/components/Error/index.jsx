import React, { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: '',
      info: ''
    }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // You can also log the error to an error reporting service
    console.log('ErrorBoundary:', error, info)
    this.setState({
      error,
      info
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <>
          <h2>Something went wrong.</h2>
          Error: <br />
          {this.state.error}
          info: <br />
          {this.state.info}
        </>

      )
    }

    return this.props.children;
  }
}
