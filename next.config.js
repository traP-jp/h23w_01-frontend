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
				hostname: 'h23w-01-backend.trap.show',
				port: '',
				pathname: '/api/**'
			},
			{
				protocol: 'https',
				hostname: 'q.trap.jp',
				port: '',
				pathname: '/api/v3/public/icon/**'
			}
		]
	}
}

module.exports = nextConfig
