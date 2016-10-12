export default function httpResponse(HTTP, category) {
  return HTTP
    .select(category)
    .flatten()
    .map(res => res.text)
    .map(JSON.parse)
    .filter(v => !!v);
};
