/** @type {import('next').NextConfig} */

module.exports = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/app',
        permanent: false,
        basePath: false
      },
    ]
  },
}