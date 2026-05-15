import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null })
    window.location.reload()
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children
    }

    return (
      <div className="error-boundary">
        <h2>Terjadi kesalahan</h2>
        <p>Aplikasi mengalami error yang tidak terduga.</p>
        <pre className="error-boundary-detail">{String(this.state.error?.message || this.state.error)}</pre>
        <button className="button" onClick={this.handleReload} type="button">
          Muat Ulang
        </button>
      </div>
    )
  }
}
