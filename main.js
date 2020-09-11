import {MyReact,Component } from './MyReact'

let a = <div id="hello">
        <p>hello world!<span>231231</span></p>
        <p>hahahaha</p>
    </div>


class TestComponent extends Component  {
  render() {
    return <div id="hello">hello world!<br/> children: {this.children}</div>
  }
}

MyReact.render(<TestComponent name="123">
    <div>i</div>
    <div>am</div>
</TestComponent>, document.body)


let b = <TestComponent name="123" />
console.log(b)


