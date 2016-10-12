import React from 'react';
import makePureReactComponent from '../../core/makePureReactComponent';
import './index.css';
const bigLogoUrl = require('file!../../assets/images/big-logo.png');


export default makePureReactComponent(function () {
  return (
    <div className="page-navbar">
      <nav className="nav has-shadow">
        <div className="nav-left">
          <a className="nav-item is-brand" href="#/">
            <img src={bigLogoUrl}
                 alt="Logo"/>
          </a>
        </div>

        <div className="nav-center is-hidden-tablet">
          <a
            className="nav-item is-tab is-active">{this.props.activeMenuItem}</a>
        </div>

        <div className="nav-center is-hidden-mobile">
          {
            this.props.menuItems.map(c => (
              <a key={c.id}
                 className={`nav-item is-tab ${c.isActive ? 'is-active' : ''}`}
                 href={c.href}>
                {c.displayName}
              </a>
            ))
          }
        </div>

        <span className="nav-toggle"
              onClick={this.props.onToggleMenu}>
                <span/>
                <span/>
                <span/>
              </span>

        <div
          className={`nav-right nav-menu ${this.props.isMenuShown ? 'is-active' : ''} is-hidden-tablet`}>
          {
            this.props.menuItems.map(c => (
              <a key={c.id}
                 className={`nav-item ${c.isActive ? 'is-active' : ''}`}
                 href={c.href}>
                {c.displayName}
              </a>
            ))
          }
        </div>
      </nav>
    </div>
  );
});
