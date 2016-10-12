import ReactDOM from 'react-dom';

export function makeDomReactDriver(elementOrQuery) {
  let rootElement = elementOrQuery;
  if (typeof elementOrQuery === 'string') {
    rootElement = document.querySelector(elementOrQuery);
  }
  function domReactDriver(vnode$) {
    vnode$.addListener({
      next(vnode){
        ReactDOM.render(vnode, rootElement);
      },
      error(x){},
      complete(){}
    });

    return {};
  }

  return domReactDriver;
}

export default makeDomReactDriver;
