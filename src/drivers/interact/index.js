import xs from 'xstream';

function interactDriver() {
  const streams = {};
  return {
    get(id) {
      if (!streams[id]) {
        streams[id] = xs.create();
      }
      return streams[id];
    },
    cb(id) {
      if (!streams[id]) {
        streams[id] = xs.create();
      }
      return (...args) => {
        streams[id].shamefullySendNext(...args);
      };
    }
  }
}
export function makeInteractDriver() {
  return interactDriver;
}

export default makeInteractDriver;
