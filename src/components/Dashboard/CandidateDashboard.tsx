import { CircularProgress, Grid, makeStyles } from '@material-ui/core'
import { useKeycloak } from '@react-keycloak/ssr'
import { KeycloakInstance } from 'keycloak-js'
import React, { useState, useEffect } from 'react'
import Layout from '../../Layout'
import Module from '../Module'

const useStyles = makeStyles((theme) => ({
	moduleGrid: {
		padding: theme.spacing(3),
	},
}))

const CandidateDashboard = () => {
	const classes = useStyles()

	const [moduleIds, setModuleIds] = useState<Array<string>>([])

	const { keycloak } = useKeycloak<KeycloakInstance>()

	const [loading, setLoading] = useState<boolean>(true)

	const getCandidateModules = () => {
		fetch(`http://localhost:9000/candidate/modules`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${keycloak?.token}`,
			},
		})
			.then((response) => response.json())
			.then((res: Array<string>) => {
				if (res.length === 0) {
					setLoading(false)
				} else {
					setModuleIds(res)
				}
			})
	}

	useEffect(() => {
		getCandidateModules()
	}, [])

	useEffect(() => {
		if (moduleIds.length !== 0) {
			console.log(moduleIds)
			setLoading(false)
		}
	}, [moduleIds])

	if (!loading) {
		if (moduleIds.length !== 0)
			return (
				<Layout>
					<Grid container spacing={3} className={classes.moduleGrid}>
						{moduleIds.map((moduleId) => (
							<Grid item md={3} sm={6} xs={12}>
								<Module moduleId={moduleId}></Module>
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

export default CandidateDashboard
