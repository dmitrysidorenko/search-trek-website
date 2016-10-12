import * as mocks from './index';
import { Stream as xs } from 'xstream/core';
import delay from 'xstream/extra/delay';
import { API_URL } from '../config';
import isThing from '../utils/isThing';


export default function mockHTTPDriver() {
  return (request$) => {
    const [config, info] = [
      `${API_URL}/config`,
      `${API_URL}/player/info`
    ];
    const mockMap = {
      [config]: mocks.config,
      [info]: mocks.playerInfo
    };
    return {
      select(category){
        return request$
          .filter(r => r.category === category)
          .map(r => {
            return xs
              .of(mockMap[r.url]).compose(delay(0))
              .filter(isThing)
              .map(d => ({ text: JSON.stringify(d) }));
          });
      }
    };
  }
}
