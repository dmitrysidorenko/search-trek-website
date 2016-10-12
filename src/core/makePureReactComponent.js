import React from 'react';
import shallowCompare from 'react-addons-shallow-compare';


export default function (render) {
  return React.createClass({
    shouldComponentUpdate(nextProps, nextState){
      return shallowCompare(this, nextProps, nextState);
    },
    render
  })
}
