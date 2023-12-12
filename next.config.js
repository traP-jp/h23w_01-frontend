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
			}
		]
	}
}

module.exports = nextConfig
