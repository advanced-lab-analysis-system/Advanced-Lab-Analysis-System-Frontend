import { AppBar, makeStyles, Toolbar, Typography } from '@material-ui/core'
import React, { ReactNode } from 'react'

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
		flexDirection: 'column',
		flex: 'auto',
	},
	appBar: {
		background: 'black',
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
		marginTop: theme.spacing(2),
		flexShrink: 0,
	},
}))

const Layout = ({ children }: { children: ReactNode }) => {
	const classes = useStyles()
	return (
		<div className={classes.root}>
			<header>
				<AppBar position='static'>
					<Toolbar>
						<Typography
							variant='h5'
							// color='textPrimary'
							className={classes.title}>
							ALAS
						</Typography>
					</Toolbar>
				</AppBar>
			</header>
			<main className={classes.main}>{children}</main>
			<footer className={classes.footer}></footer>
		</div>
	)
}

export default Layout
