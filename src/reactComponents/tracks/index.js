import React from 'react';
import './index.css';
import makePureReactComponent from '../../core/makePureReactComponent';
import TrackNode from '../track-node';

function renderTrack(track, makeOnClick, selectedNodes) {
  return (
    <div key={track.id} className="tree--item">
      <TrackNode data={track} isActive={selectedNodes.indexOf(track) > -1}
                 onClick={makeOnClick(track)}/>
      {
        track.children.length > 0
        && (<ul className="tree--item--children">
          {
            track.children
              .map(t => renderTrack(t, makeOnClick, selectedNodes))
              .map((n, i) =>
                <li className="tree--item--children--item" key={i}>{n}</li>
              )
          }
        </ul>)
      }
    </div>
  );
}

export default makePureReactComponent(function () {
  const tracks = this.props.data;
  const selectedNodes = this.props.selectedNodes || [];
  const makeOnClick = node => () => this.props.onClickNode(node);
  return (
    <div className="tree">
      {tracks.map(t => renderTrack(t, makeOnClick, selectedNodes))}
    </div>
  );
});
