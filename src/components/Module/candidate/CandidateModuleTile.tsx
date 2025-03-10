import {
	Paper,
	CircularProgress,
	makeStyles,
	Typography,
	Button,
} from '@material-ui/core'
import React, { useState, useEffect } from 'react'
import { ModuleData } from '../../../types'

import { useKeycloak } from '@react-keycloak/ssr'
import { KeycloakInstance } from 'keycloak-js'
import Link from '../../../Link'
import Loading from '../../Loading'

const useStyles = makeStyles((theme) => ({
	rootPaper: {
		backgroundColor: theme.palette.secondary.dark,
		color: theme.palette.secondary.contrastText,
		padding: theme.spacing(2),
		minHeight: '200px',
		display: 'flex',
		flex: '1',
	},
}))

const CandidateModuleTile = ({ moduleId }: { moduleId: string }) => {
	const classes = useStyles()

	const [module, setModule] = useState<ModuleData | null>(null)
	const [loading, setLoading] = useState<boolean>(true)

	const { keycloak } = useKeycloak<KeycloakInstance>()

	useEffect(() => {
		fetch(`http://localhost:9000/candidate/module/${moduleId}`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${keycloak?.token}`,
			},
		})
			.then((response) => response.json())
			.then((res: ModuleData) => {
				setModule(res)
			})
	}, [])

	useEffect(() => {
		if (module !== null) {
			setLoading(false)
		}
	}, [module])

	if (!loading) {
		return (
			<Link href={`/module/${moduleId}`} passHref>
				<Button fullWidth>
					<Paper className={classes.rootPaper}>
						<Typography variant='h4'>
							{module?.moduleName.toUpperCase()}
						</Typography>
					</Paper>
				</Button>
			</Link>
		)
	}

	return (
		<Paper className={classes.rootPaper}>
			<Loading />
		</Paper>
	)
}

export default CandidateModuleTile
