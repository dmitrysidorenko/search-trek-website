import { Stream as xs } from 'xstream/core';
import delay from 'xstream/extra/delay';
import { API_URL } from '../../config';
import parseConfigString from '../../utils/parseConfigString';
import httpResponse from '../../utils/httpResponse';
import * as mocks from '../../mocks/index';

function makeGetConfigUrl() {
  return `${API_URL}/config`;
}

export default function Configuration(sources) {
  const configResponse$ = xs.of(mocks.config);//*/httpResponse(sources.HTTP, 'get-config');
  const config$ = configResponse$
    .map(config => {
      return {
        ...config,
        logoUrl: parseConfigString({ config }, config.logoUrlTemplate)
      }
    }).remember();

  return {
    config$,
    HTTP: xs
      .empty({
        url: makeGetConfigUrl(),
        category: 'get-config'
      })
  };
}
