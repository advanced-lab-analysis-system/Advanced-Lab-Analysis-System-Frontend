import { Grid, CircularProgress, makeStyles, Button } from '@material-ui/core'
import { useKeycloak } from '@react-keycloak/ssr'
import { KeycloakInstance } from 'keycloak-js'
import Router from 'next/router'
import React, { useEffect, useState } from 'react'
import Layout from '../../Layout'
import { ModuleData } from '../../types'
import Loading from '../Loading'
import { AuthorModuleTile } from '../Module'

const useStyles = makeStyles((theme) => ({
	moduleGrid: {
		padding: theme.spacing(3),
	},
	createModule: {
		marginTop: theme.spacing(4),
		marginLeft: theme.spacing(4),
	},
}))

const AuthorDashboard = () => {
	const classes = useStyles()

	const [modules, setModules] = useState<Array<ModuleData>>([])

	const { keycloak } = useKeycloak<KeycloakInstance>()

	const [loading, setLoading] = useState<boolean>(true)

	const getAuthorModules = () => {
		fetch(`http://localhost:9000/author/modules`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${keycloak?.token}`,
			},
		})
			.then((response) => response.json())
			.then((res: Array<ModuleData>) => {
				if (res.length === 0) {
					setLoading(false)
				} else {
					setModules(res)
				}
			})
	}

	useEffect(() => {
		getAuthorModules()
	}, [])

	useEffect(() => {
		if (modules.length !== 0) {
			console.log(modules)
			setLoading(false)
		}
	}, [modules])

	if (!loading) {
		if (modules.length !== 0)
			return (
				<Layout>
					<div
						style={{
							display: 'flex',
							flexGrow: 1,
							height: '100%',
							flexDirection: 'column',
						}}>
						<div className={classes.createModule}>
							<Button
								variant='outlined'
								color='primary'
								onClick={() => Router.push('/module/create')}>
								Create Module
							</Button>
						</div>
						<Grid
							container
							spacing={3}
							className={classes.moduleGrid}>
							{modules.map((moduleData) => (
								<Grid item md={3} sm={6} xs={12}>
									<AuthorModuleTile
										moduleData={
											moduleData
										}></AuthorModuleTile>
								</Grid>
							))}
						</Grid>
					</div>
				</Layout>
			)
		else
			return (
				<Layout>
					<>No Modules to Display</>
				</Layout>
			)
	}
	return (
		<Layout>
			<Loading />
		</Layout>
	)
}

export default AuthorDashboard
