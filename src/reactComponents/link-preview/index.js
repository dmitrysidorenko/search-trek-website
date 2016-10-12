import React from 'react';
import './index.css';
import makePureReactComponent from '../../core/makePureReactComponent';

function renderThumbnail(url, height, width) {
  return url && (<img className="link-preview--thumbnail"
                      style={{
                        backgroundImage: `url(${url})`
                      }} alt="Thumbnail image" src={url}/>);
}

function renderFavIcon(iconUrl) {
  return iconUrl && (<i className="link-preview--favicon"
                        style={{ backgroundImage: `url(${iconUrl})` }}/>);
}

export default makePureReactComponent(function () {
  const { data: linkPreview, linkUrl, favIconUrl } = this.props;

  return (
    <div className="link-preview">
      <h1 className="title is-5">{linkPreview.title}</h1>
      <a className="link-preview--link" href={linkUrl}
         target="_blank">{renderFavIcon(favIconUrl)}{linkPreview.provider_name}</a>

      {renderThumbnail(linkPreview.thumbnail_url, linkPreview.thumbnail_height, linkPreview.thumbnail_width)}
      <div className="link-preview--description">
        <div>
          {linkPreview.description}
        </div>
      </div>
    </div>
  );
});
