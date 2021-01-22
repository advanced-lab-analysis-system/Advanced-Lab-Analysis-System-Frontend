import React, { useEffect } from 'react'

import Router from 'next/router'

import Layout from '../src/Layout'
import useUserStore from '../store'
import { CircularProgress } from '@material-ui/core'

export default function Index() {
	const isLoggedIn = useUserStore((state) => state.isLoggedIn)
	useEffect(() => {
		if (!isLoggedIn) Router.push('/auth/signin')
		else Router.push('/dashboard')
	}, [isLoggedIn])

	return (
		<Layout>
			<CircularProgress />
		</Layout>
	)
}
