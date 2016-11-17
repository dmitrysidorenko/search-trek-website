import React from 'react';
import './index.css';
import makePureReactComponent from '../../core/makePureReactComponent';
import LinkPreview from '../link-preview';

function renderIcon(iconUrl) {
  return iconUrl && (<i className="node-inspector--favicon"
                        style={{ backgroundImage: `url(${iconUrl})` }}/>);
}

export default makePureReactComponent(function () {
  const { node, onNodeRemove, onNodeMove, onNodeCut } = this.props;

  const visitDate = new Date(node.timestamp);

  if (!node) {
    return renderDummy();
  }

  return (
    <div className="node-inspector">
      <div className="node-inspector--header">
        <button className="node-inspector--header--btn button"
                onClick={onNodeMove}>
          move
        </button>
        <button className="node-inspector--header--btn button"
                onClick={onNodeCut}>
          cut
        </button>
        <button className="node-inspector--header--btn button"
                onClick={onNodeRemove}>
          remove
        </button>
      </div>
      <LinkPreview data={node.linkPreview} linkUrl={node.pageUrl}
                   favIconUrl={node.favIconUrl}
                   visitDateString={`${visitDate.toLocaleDateString()}, ${visitDate.toLocaleTimeString()}`}
      />
    </div>
  );
});
