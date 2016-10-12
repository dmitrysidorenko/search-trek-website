import React from 'react';
import './index.css';
import makePureReactComponent from '../../core/makePureReactComponent';

function renderIcon(iconUrl) {
  return iconUrl && (<i className="track-node--icon"
                        style={{ backgroundImage: `url(${iconUrl})` }}/>);
}
function renderNode(node, isActive, onClick) {
  return (
    <div className={`track-node ${isActive ? 'is-active' : ''}`}
         onClick={onClick}>
      <div className="track-node--label">
        {renderIcon(node.favIconUrl)}
        <div className="track-node--title--wrapper">
          <span className="track-node--title--text">{node.title}</span>
        </div>
      </div>
    </div>
  );
}

export default makePureReactComponent(function () {
  return renderNode(this.props.data, this.props.isActive, this.props.onClick);
});
