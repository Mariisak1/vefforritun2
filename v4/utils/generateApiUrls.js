export function generateApiUrl(path) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const url = new URL(path, baseUrl);

  console.log('url', url);

  return url;
}