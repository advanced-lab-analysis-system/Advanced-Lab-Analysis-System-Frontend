import { AppBar, Button, makeStyles, Toolbar, Typography } from '@material-ui/core'
import Router from 'next/router'
import React, { ReactNode } from 'react'
import useUserStore from '../store'

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
		flexGrow: 1,
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

	const isLoggedIn = useUserStore((state) => state.isLoggedIn)
	const inExam = useUserStore((state) => state.inExam)
	const handleInExam = useUserStore((state) => state.handleInExam)
	const clearUserData = useUserStore((state) => state.clearUserData)
	return (
		<div className={classes.root}>
			<header>
				<AppBar position='fixed' className={classes.appBar}>
					<Toolbar>
						<Typography component='h1' variant='h6' color='inherit' noWrap className={classes.title}>
							ALAS
						</Typography>
						{isLoggedIn && !inExam && (
							<Button
								variant='contained'
								color='secondary'
								onClick={() => {
									clearUserData()
								}}>
								Logout
							</Button>
						)}
						{isLoggedIn && inExam && (
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
