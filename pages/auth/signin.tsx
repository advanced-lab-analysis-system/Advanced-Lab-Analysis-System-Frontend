import React, { useState } from 'react'

import Router from 'next/router'

import {
	Avatar,
	Button,
	CssBaseline,
	TextField,
	FormControlLabel,
	Checkbox,
	Grid,
	Typography,
	Container,
	makeStyles,
	Divider,
	Paper,
} from '@material-ui/core'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import useUserStore from '../../store'
import Layout from '../../src/Layout'

const useStyles = makeStyles((theme) => ({
	signIn: {
		marginTop: theme.spacing(4),
		marginBottom: theme.spacing(4),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main,
	},
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing(1),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
	paper: {
		padding: theme.spacing(4),
	},
}))

const SignInComponent = ({ role }: { role: string }) => {
	const classes = useStyles()

	const addUsername = useUserStore((state) => state.addUsername)
	const addAccessToken = useUserStore((state) => state.addAccessToken)
	const addRole = useUserStore((state) => state.addRole)
	const handleIsLoggedIn = useUserStore((state) => state.handleIsLoggedIn)

	const useInput = (initialValue: any) => {
		const [value, setValue] = useState(initialValue)
		function handleChange(e: { target: { value: any } }) {
			setValue(e.target.value)
		}
		return [value, handleChange]
	}

	const handleSubmit = (e: { preventDefault: () => void }) => {
		e.preventDefault()
	}

	const [username, setUsername] = useInput('')
	const [password, setPassword] = useInput('')

	const authenticateUser = (username: string, password: string) => {
		fetch('http://localhost:9000/auth/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username: username, password: password }),
		})
			.then((response) => {
				if (response.status == 200) return response.json()
				else return 'Invalid Credentials'
			})
			.then((res) => {
				if (res != 'Invalid Credentials' && res['role'] === role) {
					addAccessToken(res['access_token'])
					addUsername(username)
					addRole(role)
					handleIsLoggedIn(true)
					Router.push('/dashboard')
				} else {
					if (res == 'Invalid Credentials') alert(res)
					else alert('Not an authorized Account')
				}
			})
	}

	return (
		<Paper className={classes.paper}>
			<Typography variant='h6' align='center'>
				{role === 'ROLE_AUTHOR' ? 'Author' : 'Candidate'}
			</Typography>
			<Divider />
			<form className={classes.form} noValidate onSubmit={handleSubmit}>
				<TextField
					variant='outlined'
					margin='normal'
					required
					fullWidth
					id='username'
					label='Username'
					name='username'
					autoComplete='username'
					autoFocus
					onChange={setUsername}
				/>
				<TextField
					variant='outlined'
					margin='normal'
					required
					fullWidth
					name='password'
					label='Password'
					type='password'
					id='password'
					autoComplete='current-password'
					onChange={setPassword}
				/>
				<FormControlLabel control={<Checkbox value='remember' color='primary' />} label='Remember me' />
				<Button
					type='submit'
					size='large'
					fullWidth
					variant='contained'
					color='primary'
					className={classes.submit}
					onClick={() => authenticateUser(username, password)}>
					Sign In
				</Button>
			</form>
		</Paper>
	)
}

const SignIn = () => {
	const classes = useStyles()

	return (
		<Layout>
			<Container component='main'>
				<CssBaseline />
				<div className={classes.signIn}>
					<Avatar className={classes.avatar}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography component='h1' variant='h5'>
						Sign in
					</Typography>
				</div>
				<Grid container alignItems='center' justify='center' spacing={5}>
					<Grid item md={6}>
						<SignInComponent role='ROLE_AUTHOR' />
					</Grid>
					<Grid item md={6}>
						<SignInComponent role='ROLE_CANDIDATE' />
					</Grid>
				</Grid>
			</Container>
		</Layout>
	)
}

export default SignIn
