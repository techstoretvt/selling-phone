

const domain = process.env.REACT_APP_FRONTEND_URL

export default function sitemap() {
  return [
    {
      url: domain,
      lastModified: new Date(),
    },
    {
      url: domain + '/blogs/all',
      lastModified: new Date(),
    },
    {
      url: domain + '/search',
      lastModified: new Date(),
    },
    {
      url: domain + '/short-video/foryou',
      lastModified: new Date(),
    },
  ];
}