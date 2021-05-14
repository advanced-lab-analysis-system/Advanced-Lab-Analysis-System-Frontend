import React, { useEffect } from 'react'

import Router from 'next/router'

import Layout from '../src/Layout'

import { useKeycloak } from '@react-keycloak/ssr'
import type { KeycloakInstance } from 'keycloak-js'
import Loading from '../src/components/Loading'

export default function Index() {
	const { keycloak } = useKeycloak<KeycloakInstance>()
	useEffect(() => {
		if (keycloak?.authenticated) Router.push('/dashboard')
	}, [keycloak?.authenticated])

	return (
		<Layout>
			<Loading />
		</Layout>
	)
}
