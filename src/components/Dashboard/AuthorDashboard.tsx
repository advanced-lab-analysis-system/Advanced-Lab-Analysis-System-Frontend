import { Grid, CircularProgress, makeStyles } from '@material-ui/core'
import { useKeycloak } from '@react-keycloak/ssr'
import { KeycloakInstance } from 'keycloak-js'
import React, { useEffect, useState } from 'react'
import Layout from '../../Layout'
import { ModuleData } from '../../types'
import { AuthorModule } from '../Module'

const useStyles = makeStyles((theme) => ({
	moduleGrid: {
		padding: theme.spacing(3),
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
					<Grid container spacing={3} className={classes.moduleGrid}>
						{modules.map((moduleData) => (
							<Grid item md={3} sm={6} xs={12}>
								<AuthorModule
									moduleData={moduleData}></AuthorModule>
							</Grid>
						))}
					</Grid>
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

export default AuthorDashboard
