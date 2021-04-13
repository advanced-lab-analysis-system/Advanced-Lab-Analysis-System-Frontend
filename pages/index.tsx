import React, { useEffect } from 'react'

import Router from 'next/router'

import Layout from '../src/Layout'
import { CircularProgress } from '@material-ui/core'

import { useKeycloak } from '@react-keycloak/ssr'
import type { KeycloakInstance } from 'keycloak-js'

export default function Index() {
	const { keycloak } = useKeycloak<KeycloakInstance>()
	useEffect(() => {
		if (keycloak?.authenticated) Router.push('/dashboard')
	}, [keycloak?.authenticated])

	return (
		<Layout>
			<CircularProgress
				style={{
					alignSelf: 'center',
					marginRight: 'auto',
					marginLeft: 'auto',
				}}
			/>
		</Layout>
	)
}
