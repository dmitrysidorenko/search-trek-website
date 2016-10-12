export default function parseSearchString(str) {
  const [_, q = ''] = str.split('?');
  const pairs = q.split('&') || [];
  return pairs.reduce((acc, s) => {
    const [key, value] = s.split('=');
    if (key !== '') {
      acc[key] = value;
    }
    return acc;
  }, {});
}
