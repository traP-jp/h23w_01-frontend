'use client'

import { useSearchParams } from 'next/navigation'

export default function Login() {
	const params = useSearchParams()
	const code = params.get('code')

	fetch('https://q.trap.jp/api/v3/oauth2/token', {
		method: 'POST',
		headers: {
			'Content-Type': 'x-www-form-urlencoded'
		},
		body: JSON.stringify({
			client_id: process.env.NEXT_CLIENT_ID,
			grant_type: 'authorization_code',
			code: code
		})
	}).then(res => {
		res.json().then(data => {
			data.access_token
		})
	})
}
