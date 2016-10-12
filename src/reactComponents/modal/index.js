import React from 'react';
import './index.css';
import makePureReactComponent from '../../core/makePureReactComponent';


export default makePureReactComponent(function () {
  return (
    <div className={`tain-modal modal ${this.props.isActive && 'is-active'}`}>
      <div className="modal-background"></div>
      <div className="modal-content">
        {this.props.children}
      </div>
      <button className="modal-close"
              onClick={this.props.onClose}/>
    </div>
  );
});
