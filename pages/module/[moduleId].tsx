import {
	CircularProgress,
	Container,
	Divider,
	makeStyles,
	Paper,
	Typography,
} from '@material-ui/core'
import { useKeycloak } from '@react-keycloak/ssr'
import { KeycloakInstance } from 'keycloak-js'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import ExamTile from '../../src/components/Exam/ExamTile'
import Layout from '../../src/Layout'
import { ModuleData } from '../../src/types'

const useStyles = makeStyles((theme) => ({
	moduleName: {
		padding: theme.spacing(2),
		marginTop: theme.spacing(2),
		marginBottom: theme.spacing(2),
		backgroundColor: theme.palette.secondary.main,
		color: theme.palette.secondary.contrastText,
	},
	examsTitle: {
		marginBottom: theme.spacing(1),
	},
}))

const modulePage = () => {
	const router = useRouter()
	const { moduleId } = router.query

	const [module, setModule] = useState<ModuleData | null>(null)
	const [loading, setLoading] = useState<boolean>(true)

	const { keycloak } = useKeycloak<KeycloakInstance>()

	const classes = useStyles()

	const getModuleData = () => {
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
	}

	useEffect(() => {
		if (module !== null) {
			setLoading(false)
		} else {
			setLoading(true)
		}
	}, [module])

	useEffect(() => {
		if (keycloak?.authenticated) {
			getModuleData()
		}
	}, [keycloak?.authenticated])

	if (!loading) {
		return (
			<Layout>
				<Container>
					<Paper variant='outlined' className={classes.moduleName}>
						<Typography variant='h1'>
							{module?.moduleName}
						</Typography>
					</Paper>
					<Typography
						variant='h4'
						color='inherit'
						className={classes.examsTitle}>
						Exams
					</Typography>
					<Divider />
					{module?.examList.map((exam) => (
						<ExamTile examId={exam} />
					))}
				</Container>
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

export default modulePage
