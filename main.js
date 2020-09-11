import {MyReact,Component } from './MyReact'

let a = <div id="hello">
        <p>hello world!<span>231231</span></p>
        <p>hahahaha</p>
    </div>


class TestComponent extends Component  {
  render() {
    return <div id="hello">hello world!</div>
  }
}

MyReact.render(<TestComponent name="123" />, document.body)


