import {
	AppBar,
	Button,
	makeStyles,
	Toolbar,
	Typography,
} from '@material-ui/core'
import { useKeycloak } from '@react-keycloak/ssr'
import { KeycloakInstance } from 'keycloak-js'
import Router from 'next/router'
import React, { ReactNode } from 'react'
import { useExamStore } from '../store'

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
		flexDirection: 'column',
		flex: 'auto',
		height: '100%',
	},
	appBar: {
		zIndex: theme.zIndex.drawer + 1,
	},
	menuButton: {
		marginRight: theme.spacing(2),
	},
	logo: {
		marginRight: theme.spacing(1),
	},
	main: {
		display: 'flex',
		flexGrow: 1,
		height: '100%',
	},
	title: {
		// flexGrow: 1,
		marginRight: 'auto',
		fontSize: '1.75em',
	},
	footer: {
		height: '50px',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		background: 'black',
		color: 'white',
		marginTop: 'auto',
		flexShrink: 0,
	},
}))

const Layout = ({ children }: { children: ReactNode }) => {
	const classes = useStyles()

	const { keycloak } = useKeycloak<KeycloakInstance>()

	const inExam = useExamStore((state) => state.inExam)
	const handleInExam = useExamStore((state) => state.handleInExam)
	return (
		<div className={classes.root}>
			<header>
				<AppBar position='fixed' className={classes.appBar}>
					<Toolbar>
						<Button
							variant='text'
							color='inherit'
							className={classes.title}
							size='large'
							onClick={() => Router.push('/dashboard')}>
							ALAS
						</Button>
						{keycloak?.authenticated && !inExam && (
							<Button
								variant='contained'
								color='secondary'
								onClick={() => {
									keycloak.logout()
								}}>
								Logout
							</Button>
						)}
						{keycloak?.authenticated && inExam && (
							<Button
								variant='contained'
								color='secondary'
								onClick={() => {
									handleInExam(false)
									Router.push('/dashboard')
								}}>
								End
							</Button>
						)}
					</Toolbar>
				</AppBar>
			</header>
			<Toolbar />
			<main className={classes.main}>{children}</main>
			{/* <footer className={classes.footer}></footer> */}
		</div>
	)
}

export default Layout
