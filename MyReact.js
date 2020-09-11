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
    parentElement.appendChild(component.root)
  }
}

export class Component {
  constructor(props) {
    this.props = Object.create(null);
    this._root = null;
    this.children = []
  }

  setAttribute(name, value) {
      this.props[name] = value; 
  }

  appendChild(component) {
    this.children.push(component);
  }

  get root() {
    if(!this._root) {
      //console.log(this.render())
      //调用组件的render
      this._root = this.render().root;
    }
    return this._root
  }
}


class ElementWrapper {
  constructor(type) {
    this.root = document.createElement(type)
  }

  setAttribute(name, value) {
    this.root.setAttribute(name, value)
  }

  appendChild(component) {
    this.root.appendChild(component.root)
  }
}

class TextNodeWrapper{
  constructor(content) {
    this.root = document.createTextNode(content);
  }
}