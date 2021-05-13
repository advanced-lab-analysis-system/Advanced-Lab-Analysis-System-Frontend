import { CircularProgress, makeStyles, Paper } from '@material-ui/core'
import { useKeycloak } from '@react-keycloak/ssr'
import { KeycloakInstance } from 'keycloak-js'
import React, { useState, useEffect } from 'react'
import { ExamDataSummary, ModuleData } from '../../types'

const useStyles = makeStyles((theme) => ({
	rootPaper: {
		backgroundColor: theme.palette.background.paper,
		color: theme.palette.secondary.contrastText,
		padding: theme.spacing(2),
		display: 'flex',
		flex: '1',
	},
}))

const ExamTile = ({ examId }: { examId: string }) => {
	const [examData, setExamData] = useState<ExamDataSummary | null>(null)

	const [loading, setLoading] = useState<boolean>(true)

	const { keycloak } = useKeycloak<KeycloakInstance>()

	const getExamData = () => {
		fetch(`http://localhost:9000/candidate/exam/${examId}/summary`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${keycloak?.token}`,
			},
		})
			.then((response) => response.json())
			.then((res: ExamDataSummary) => {
				setExamData(res)
			})
	}

	useEffect(() => {
		if (examData !== null) {
			setLoading(false)
		} else {
			setLoading(true)
		}
	}, [examData])

	if (!loading) {
		return <div></div>
	}
	return (
		<Paper>
			<CircularProgress
				style={{
					alignSelf: 'center',
					marginRight: 'auto',
					marginLeft: 'auto',
				}}
			/>
		</Paper>
	)
}

export default ExamTile
