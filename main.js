import {MyReact,Component } from './MyReact'

let a = <div id="hello">
        <p>hello world!<span>231231</span></p>
        <p>hahahaha</p>
    </div>


class TestComponent extends Component {
    constructor() {
      super();
      this.state = {
        count: 1
      }
    }
    render() {
      return <div id="hello">
        hello world!
        <span>{
            this.state.count.toString()
          }
          <button onClick={() => {this.state.count++ ;this.rerender()}}>点击</button>
          </span>
          {
            this.children
          }
        </div>
    }
}

MyReact.render(<TestComponent></TestComponent>, document.body)


let b = <TestComponent name="123" />



