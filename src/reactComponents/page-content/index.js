import React from 'react';
import './index.css';
import makePureReactComponent from '../../core/makePureReactComponent';


export default makePureReactComponent(function () {
  return (
    <section className="page-content section">{this.props.children}</section>
  );
});
