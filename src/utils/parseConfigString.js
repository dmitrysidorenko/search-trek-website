function getByPath(obj, p = []) {
  return p.reduce((acc, key) => {
    if (acc) {
      return acc[key];
    }
    return acc;
  }, obj);
}

export default function parseConfigString(config, str = '') {
  return str.replace(/{(.+)}/, (match, p) => {
    const path = p.split('.');
    return getByPath(config, path);
  });
}
