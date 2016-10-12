import React from 'react';
import makePureReactComponent from '../../core/makePureReactComponent';
import './index.css';


export default makePureReactComponent(function () {
  return (
    <div className="wl-page" style={{
      overflow: this.props.isGameRunning ? 'hidden' : ''
    }}>{this.props.children}</div>
  );
});
