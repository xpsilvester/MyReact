const RENDER_TO_DOM = Symbol('render to dom')

export class Component {
  constructor() {
    this.props = Object.create(null);
    this._root = null;
    this.children = [];
    this._range = null;
  }

  setAttribute(name, value) {
      this.props[name] = value; 
  }

  appendChild(component) {
    this.children.push(component);
  }

  get vdom(){
    console.log('component vdom',this.render())
    return this.render().vdom;
  }

  // get root() {
  //   if(!this._root) {
  //     //console.log(this.render())
  //     //调用组件的render
  //     this._root = this.render().root;
  //   }
  //   return this._root
  // }

  [RENDER_TO_DOM](range) {
    this._range = range;
    this._vdom = this.vdom;
    this._vdom[RENDER_TO_DOM](range);
  }

  // rerender() {
  //   // this._range.deleteContents();
  //   // this[RENDER_TO_DOM](this._range)
  //   let oldRange = this._range;

  //   let range = document.createRange();
  //   range.setStart(oldRange.startContainer,oldRange.startOffset)
  //   range.setEnd(oldRange.startContainer,oldRange.startOffset)
  //   this[RENDER_TO_DOM](range)

  //   oldRange.setStart(range.endContainer,range.endOffset)
  //   oldRange.deleteContents();
  // }

  update(){
    let isSameNode = (oldNode, newNode) => {
      if(oldNode.type !== newNode.type){
        return false;
      }
      for(let name in newNode.props) {
        if(newNode.props[name] !== oldNode.props[name]){
          return false;
        }
      }
      if(Object.keys(oldNode.props).length > Object.keys(newNode.props).length){
        return false;
      }
      if(newNode.type === '#text'){
        if(newNode.content !== oldNode.content){
          return false
        }
      }

      return true;
    }

    let update = (oldNode,newNode)=>{
      
      //type, props, children
      //#text content
      if(!isSameNode(oldNode,newNode)){
        console.log('oldNode._range:',oldNode)
        newNode[RENDER_TO_DOM](oldNode._range);
        return;
      }
      newNode._range = oldNode._range;

      let newChildren = newNode.vchildren;
      let oldChildren = oldNode.vchildren;

      if(!newChildren || !newChildren.length){
        return;
      }

      let tailRange = oldChildren[oldChildren.length -1]._range;

      for(let i=0; i< newChildren.length;i++){
        let newChild = newChildren[i];
        let oldChild = oldChildren[i];
        if(i < oldChildren.length){
          update(oldChild,newChild)
        } else {
          let range = document.createRange();
          range.setStart(tailRange.endContainer,tailRange.endOffset);
          range.setEnd(tailRange.endContainer,tailRange.endOffset);
          newChild[RENDER_TO_DOM](range);
          tailRange = range;
        }
      }
    }
    let vdom = this.vdom;
    update(this._vdom,vdom);
    this._vdom = vdom;
  }

  setState(newState) {
    if(this.state === null && typeof this.state !== 'object') {
      this.state = newState;
      this.update();
      return;
    }

    let merge = (oldState, newState) => {
        for (const key in newState) {
          if(oldState[key] === null || typeof oldState[key] !== 'object') {
            oldState[key] = newState[key]
          } else {
            merge(oldState[key], newState[key]);
          }
        }
    }
    merge(this.state, newState);
    this.update();
  }
}

class ElementWrapper extends Component{
  constructor(type) {
    //this.root = document.createElement(type)
    super(type);
    this.type = type;
  }

  // setAttribute(name, value) {
  //   if(name.match(/^on([\s\S]+)/)) {
  //     this.root.addEventListener(RegExp.$1.replace(/^[\s\S]/, s => s.toLowerCase()), value)
  //   } else {
  //     if(name === 'className'){
  //       this.root.setAttribute("class",value)
  //     } else {
  //       this.root.setAttribute(name, value)
  //     }
  //   }
  // }

  // appendChild(component) {
  //   let range = document.createRange();
  //   range.setStart(this.root,this.root.childNodes.length);
  //   range.setEnd(this.root,this.root.childNodes.length);
  //   component[RENDER_TO_DOM](range);
  // }

  get vdom (){
    //console.log(this)
    this.vchildren = this.children.map(child => child.vdom);
    return this;
  }

  [RENDER_TO_DOM](range) {
    // range.deleteContents();
    // range.insertNode(this.root);
    this._range = range;
    //console.log('this._range:',this._range)

    let root = document.createElement(this.type);

    for(let name in this.props) {
      let value = this.props[name];
      if(name.match(/^on([\s\S]+)$/)){
        root.addEventListener(RegExp.$1.replace(/^[\s\S]/, s => s.toLowerCase()), value)
      }
      if (name === 'className') {
        root.setAttribute('class', value)
      } else {
        root.setAttribute(name, value)
      }
    }

    if(!this.vchildren)
      this.vchildren = this.children.map(item => item.vdom);
    
    for (const child of this.vchildren) {
        const childRange = document.createRange();
        childRange.setStart(root, root.childNodes.length);
        childRange.setEnd(root, root.childNodes.length);
        child[RENDER_TO_DOM](childRange);
    }
    replaceContent(range, root);
  }
}

class TextNodeWrapper extends Component {
  constructor(content) {
    super(content);
    //this.root = document.createTextNode(content);
    this.type = "#text";
    this.content = content;
  }
  get vdom(){
    //console.log('TextNodeWrapper',this)
    return this;
  }
  [RENDER_TO_DOM](range) {
    // range.deleteContents();
    // range.insertNode(this.root);
    this._range = range;
    let root = document.createTextNode(this.content);
    replaceContent(range, root)
  }
}

function replaceContent(range, node) {
  range.insertNode(node);
  range.setStartAfter(node);
  
  range.deleteContents();

  range.setStartBefore(node);
  range.setEndAfter(node);

}

export const MyReact = {
  // createElement(type, attributes, ...children) {
  //   //console.log('type:',type,',attributes:',attributes,',children:',children)
  //   const element = document.createElement(type);
  //   //添加属性
  //   for (let name in attributes) {
  //     //console.log('name:',name)
  //     element.setAttribute(name, attributes[name])
  //   }
  //   //添加子节点
  //   for (let child of children) {
  //     //console.log('child:',child)
  //     //console.log('typeof child:',typeof child)
  //     let node;
  //     if(typeof child === 'string'){
  //       node = document.createTextNode(child)
  //     }else{
  //       node = child
  //     }
  //     element.appendChild(node)
      
  //   }
  //   return element;
  // }
  // createElement(type, attributes, ...children) {
  //   let element;
  //   // 判断element的类型, 如果是元素标签的字符串类型, 那么就通过ElementWrapper创建实DOM, 否则就直接实例化本身返回其render的jsx, 进行重新调用createElement构建元素。
  //   if(typeof type === 'string') {
  //      element = new ElementWrapper(type);
  //   } else {
  //     element = new type;
  //   }
  
  //   for (let name in attributes) {
  //     element.setAttribute(name, attributes[name])
  //   }
  
  //   for (let child of children) {
  //     // 如果child是字符串那么直接实例化TextNodeWrapper,得到文本节点。
  //     if(typeof child === 'string') {
  //       child = new TextNodeWrapper(child)
  //     }
  //     element.appendChild(child)
  //   }
    
  //   return element;
  // },
  createElement(type, attributes, ...children) {
    let element;
    if(typeof type === 'string') {
       element = new ElementWrapper(type);
    } else {
      element = new type;
    }
    
    for (let name in attributes) {
      element.setAttribute(name, attributes[name])
    }
  
    function insertChildren(children) {
      for (let child of children) {
        if(typeof child === 'string') {
          child = new TextNodeWrapper(child)
        }
        if(child === null){
          continue;
        }
        if(typeof child === 'object' && child instanceof Array) {
          insertChildren(child);
          return;
        }
        element.appendChild(child)
      }
    }
  
    insertChildren(children);
    
    return element;
  },  
  render(component, parentElement) {
    let range = document.createRange();
    range.setStart(parentElement, 0);
    range.setEnd(parentElement, parentElement.childNodes.length);
    range.deleteContents();
    component[RENDER_TO_DOM](range)
  } 
}