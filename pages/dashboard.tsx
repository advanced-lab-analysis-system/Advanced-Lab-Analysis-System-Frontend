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

	const [loading, setLoading] = useState<boolean>(true)

	const [roleList, setRoleList] = useState<Array<string> | null>(null)

	const [currRole, setCurrRole] = useState<string | null>(null)

	const [moduleIds, setModuleIds] = useState<Array<string>>([])

	// TODO: change url according to REST API
	const getCandidateModules = () => {
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
				setLoading(false)
			})
	}

	useEffect(() => {
		if (keycloak?.authenticated) {
			let origRoleList = keycloak.realmAccess?.roles
			let newRoleList: Array<string> = []
			// @ts-ignore
			origRoleList.forEach((role) => {
				if (role === 'CANDIDATE' || role === 'AUTHOR') {
					newRoleList.push(role)
				}
			})
			setRoleList(newRoleList)
		}
	}, [keycloak?.authenticated])

	useEffect(() => {
		if (roleList !== null) {
			if (roleList.length === 0) {
				alert('not a valid account')
			} else if (roleList.length > 1) {
				setLoading(false)
			} else {
				setCurrRole(roleList[0])
			}
		}
	}, [roleList])

	useEffect(() => {
		if (currRole !== null || currRole !== '') {
			if (currRole === 'CANDIDATE') {
				getCandidateModules()
			} else if (currRole === 'AUTHOR') {
			}
		} else {
			setLoading(true)
		}
	}, [currRole])

	// TODO: need to split into separate module

	if (
		!loading &&
		roleList !== null &&
		roleList.length > 1 &&
		currRole === null
	) {
		return (
			<Layout>
				<Grid container md>
					{roleList.map((role) => (
						<Grid
							item
							xs
							style={{
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
							}}>
							<Button
								variant='contained'
								color='secondary'
								onClick={() => {
									setCurrRole(role)
								}}>
								{role}
							</Button>
						</Grid>
					))}
				</Grid>
			</Layout>
		)
	}

	if (!loading && currRole === 'CANDIDATE' && moduleIds.length !== 0) {
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
