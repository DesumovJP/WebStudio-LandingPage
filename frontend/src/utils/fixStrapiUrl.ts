export function fixStrapiUrl(url?: string): string {
  if (!url) return '';
  let v = String(url).trim();
  // strip locale prefixes like /uk/ or /en/
  if (v.startsWith('/uk/')) v = v.replace('/uk/', '/');
  if (v.startsWith('/en/')) v = v.replace('/en/', '/');
  // upgrade http to https
  if (v.startsWith('http://')) v = v.replace('http://', 'https://');
  // replace stale Railway subdomain
  v = v.replace(
    'webstudio-landingpage.up.railway.app',
    'webstudio-landingpage-production.up.railway.app'
  );
  return v;
}

export default fixStrapiUrl;
