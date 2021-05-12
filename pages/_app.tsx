import React from 'react'

import Head from 'next/head'
import type { AppProps, AppContext } from 'next/app'

import cookie from 'cookie'

import type { IncomingMessage } from 'http'

import { SSRKeycloakProvider, SSRCookies } from '@react-keycloak/ssr'

// import keycloak from '../src/keycloak/keycloak.json'

import { ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'

import theme from '../src/theme'
import '../src/styles/globals.css'
import { KeycloakConfig } from 'keycloak-js'

interface InitialProps {
	cookies: unknown
}

const keycloakCfg: KeycloakConfig = {
	realm: 'test',
	url: 'http://localhost:8080/auth/',
	clientId: 'next-js-client',
}

export default function MyApp(props: AppProps & InitialProps) {
	const { Component, pageProps, cookies } = props

	React.useEffect(() => {
		// Remove the server-side injected CSS.
		const jssStyles = document.querySelector('#jss-server-side')
		if (jssStyles) {
			jssStyles.parentElement!.removeChild(jssStyles)
		}
	}, [])

	return (
		<SSRKeycloakProvider
			keycloakConfig={keycloakCfg}
			persistor={SSRCookies(cookies)}
			initOptions={{ onLoad: 'login-required' }}>
			<React.Fragment>
				<Head>
					<title>My page</title>
					<meta
						name='viewport'
						content='minimum-scale=1, initial-scale=1, width=device-width'
					/>
				</Head>
				<ThemeProvider theme={theme}>
					{/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
					<CssBaseline />
					<Component {...pageProps} />
				</ThemeProvider>
			</React.Fragment>
		</SSRKeycloakProvider>
	)
}

function parseCookies(req?: IncomingMessage) {
	if (!req || !req.headers) {
		return {}
	}
	return cookie.parse(req.headers.cookie || '')
}

MyApp.getInitialProps = async (context: AppContext) => {
	// Extract cookies from AppContext
	return {
		cookies: parseCookies(context?.ctx?.req),
	}
}
