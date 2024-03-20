/** @type {import('next').NextConfig} */
const path = require('path')
const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  async redirects() {
    return [
      {
        source: '/community',
        destination: 'https://www.youtube.com/watch?v=v5ZMK0nGrrc&ab_channel=XTREMIX',
        permanent: false
      },
      {
        source: '/admin',
        destination: process.env.REACT_APP_ADMIN_URL,
        permanent: false
      }
    ]
  },
  env: {
    REACT_APP_BACKEND_URL: process.env.REACT_APP_BACKEND_URL,
    REACT_APP_BACKEND_URL_BUILD: process.env.REACT_APP_BACKEND_URL_BUILD,
    REACT_APP_CLIENT_ID_GG: process.env.REACT_APP_CLIENT_ID_GG,
    REACT_APP_APPID_FACE: process.env.REACT_APP_APPID_FACE,
    REACT_APP_SITEKEY_CAPCHA: process.env.REACT_APP_SITEKEY_CAPCHA,
    REACT_APP_ADMIN_URL: process.env.REACT_APP_ADMIN_URL,
    RACT_APP_LNK_VIDEO_DRIVE: process.env.RACT_APP_LNK_VIDEO_DRIVE,
    REACT_APP_FRONTEND_URL: process.env.REACT_APP_FRONTEND_URL,
    REACT_APP_FRONTEND_URL_DOMAIN1: process.env.REACT_APP_FRONTEND_URL_DOMAIN1,

    CLIENT_ID_GIT: process.env.CLIENT_ID_GIT,
    CLIENT_SECRET_GIT: process.env.CLIENT_SECRET_GIT,
    REDIRECT_URI_GIT: process.env.REDIRECT_URI_GIT,

    ACCESSS_TOKEN_MESS: process.env.ACCESSS_TOKEN_MESS

  },
  images: {
    domains: [
      'res.cloudinary.com',
      process.env.REACT_APP_FRONTEND_URL,
      'avatars.githubusercontent.com',
      'lh3.googleusercontent.com',
      'scontent.fsgn2-5.fna.fbcdn.net',
      'scontent.fsgn2-7.fna.fbcdn.net'
    ],

  },
  async rewrites() {
    return [
      {
        source: '/robots.txt',
        destination: '/robots.txt',
      },
    ];
  },
}

module.exports = nextConfig
