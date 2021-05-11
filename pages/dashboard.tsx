import React, { useEffect, useState } from 'react'
import Layout from '../src/Layout'

import {
	Button,
	Container,
	Divider,
	Grid,
	makeStyles,
	Paper,
	Typography,
} from '@material-ui/core'

import { CircularProgress } from '@material-ui/core'

import { ModuleData } from '../src/types'
import Link from '../src/Link'
import { useKeycloak } from '@react-keycloak/ssr'
import { KeycloakInstance } from 'keycloak-js'
import { useExamStore } from '../store'

import Module from '../src/components/Module'

const useStyles = makeStyles((theme) => ({
	moduleGrid: {
		padding: theme.spacing(3),
	},
	examTile: {
		margin: theme.spacing(2),
		padding: theme.spacing(2),
		display: 'flex',
		justifyContent: 'space-between',
	},
	tileText: {
		display: 'flex',
		alignItems: 'center',
	},
	examHeader: {
		marginTop: theme.spacing(3),
		marginBottom: theme.spacing(3),
	},
	examSubheaders: {
		marginTop: theme.spacing(2),
		marginBottom: theme.spacing(2),
	},
}))

const dashboard = () => {
	const classes = useStyles()

	const { keycloak } = useKeycloak<KeycloakInstance>()

	const [moduleIds, setModuleIds] = useState<Array<string>>([])

	// TODO: change url according to REST API
	const getModules = () => {
		fetch(`http://localhost:9000/candidate/modules`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${keycloak?.token}`,
			},
		})
			.then((response) => response.json())
			.then((res) => {
				res.map((element: string) => {
					setModuleIds((moduleIds) => [...moduleIds, element])
				})
				console.log(res)
			})
	}

	useEffect(() => {
		if (keycloak?.authenticated) getModules()
	}, [keycloak?.authenticated])

	if (keycloak?.authenticated && moduleIds.length !== 0) {
		return (
			<Layout>
				<Grid container md spacing={3} className={classes.moduleGrid}>
					{moduleIds.map((moduleId) => (
						<Grid item md={3} sm={6} xs={12}>
							<Module moduleId={moduleId}></Module>
						</Grid>
					))}
				</Grid>
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

export default dashboard
