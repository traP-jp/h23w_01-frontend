/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		swcPlugins: [['@swc-jotai/react-refresh', {}]]
	},
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'www.post.japanpost.jp',
				port: '',
				pathname: '/img/service/standard/two/type/**'
			},
			{
				protocol: 'https',
				hostname: 'h23w01-backend-cors.trap.show',
				port: '',
				pathname: '/api/**'
			}
		]
	}
}

module.exports = nextConfig
