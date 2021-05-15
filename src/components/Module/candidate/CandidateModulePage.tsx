import {
	Container,
	Divider,
	makeStyles,
	Paper,
	Typography,
} from '@material-ui/core'
import { useKeycloak } from '@react-keycloak/ssr'
import { KeycloakInstance } from 'keycloak-js'
import React, { useEffect, useState } from 'react'
import Layout from '../../../Layout'
import { ModuleData } from '../../../types'
import ExamTile from '../../Exam/ExamTile'
import Loading from '../../Loading'

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
	divider: {
		marginBottom: theme.spacing(2),
	},
}))

const CandidateModulePage = ({
	moduleId,
}: {
	moduleId: string | string[] | undefined
}) => {
	const [module, setModule] = useState<ModuleData | null>(null)
	const [loading, setLoading] = useState<boolean>(true)

	const { keycloak } = useKeycloak<KeycloakInstance>()

	const classes = useStyles()

	useEffect(() => {
		if (module !== null) {
			setLoading(false)
		} else {
			setLoading(true)
		}
	}, [module])

	useEffect(() => {
		if (keycloak?.authenticated) {
			getCandidateModuleData()
		}
	}, [keycloak?.authenticated])

	const getCandidateModuleData = () => {
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
					<Divider className={classes.divider} />
					{module?.examList.map((exam) => (
						<ExamTile examId={exam} />
					))}
				</Container>
			</Layout>
		)
	}
	return (
		<Layout>
			<Loading />
		</Layout>
	)
}

export default CandidateModulePage
