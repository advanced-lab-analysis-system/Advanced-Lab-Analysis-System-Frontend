import {
	Button,
	CircularProgress,
	Grid,
	makeStyles,
	Paper,
	Typography,
} from '@material-ui/core'
import { useKeycloak } from '@react-keycloak/ssr'
import { KeycloakInstance } from 'keycloak-js'
import Router from 'next/router'
import React, { useState, useEffect } from 'react'
import { ExamDataSummary } from '../../types'
import Loading from '../Loading'

const useStyles = makeStyles((theme) => ({
	rootPaper: {
		backgroundColor: theme.palette.background.paper,
		color: 'inherit',
		padding: theme.spacing(2),
		display: 'flex',
		flex: '1',
		marginTop: theme.spacing(2),
		marginBottom: theme.spacing(2),
	},
}))

const ExamTile = ({ examId }: { examId: string }) => {
	const classes = useStyles()

	const [examSummaryData, setExamSummaryData] =
		useState<ExamDataSummary | null>(null)

	const [loading, setLoading] = useState<boolean>(true)

	const { keycloak } = useKeycloak<KeycloakInstance>()

	const getExamSummaryData = () => {
		fetch(`http://localhost:9000/candidate/exam/${examId}/summary`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${keycloak?.token}`,
			},
		})
			.then((response) => response.json())
			.then((res: ExamDataSummary) => {
				res.examStartTime = new Date(res.examStartTime)
				res.examEndTime = new Date(res.examEndTime)
				setExamSummaryData(res)
			})
	}

	useEffect(() => {
		if (examSummaryData !== null) {
			setLoading(false)
		} else {
			setLoading(true)
		}
	}, [examSummaryData])

	useEffect(() => {
		if (keycloak?.authenticated) getExamSummaryData()
	}, [keycloak?.authenticated])

	if (!loading) {
		return (
			<Paper className={classes.rootPaper}>
				<Grid container>
					<Grid
						item
						xs={4}
						style={{ display: 'flex', alignItems: 'center' }}>
						<Typography variant='h6' noWrap color='primary'>
							{examSummaryData?.examName}
						</Typography>
					</Grid>
					<Grid
						item
						xs={2}
						style={{ display: 'flex', alignItems: 'center' }}>
						<Typography variant='h6'>
							{`${examSummaryData?.noOfQuestions} Question(s)`}
						</Typography>
					</Grid>
					<Grid
						item
						xs={4}
						style={{ display: 'flex', alignItems: 'center' }}>
						<Typography variant='body1' color='primary'>
							{`${examSummaryData?.examStartTime.toLocaleString()} - ${examSummaryData?.examEndTime.toLocaleString()}`}
						</Typography>
					</Grid>
					<Grid
						xs={2}
						item
						style={{
							display: 'flex',
							justifyContent: 'flex-end',
						}}>
						<Button
							variant='contained'
							color='primary'
							size='medium'
							disabled={examSummaryData?.status === 'upcoming'}
							style={{ minWidth: '6.25em' }}
							onClick={() => Router.push(`/exam/${examId}`)}>
							{examSummaryData?.status === 'running'
								? 'Start'
								: 'View'}
						</Button>
					</Grid>
				</Grid>
			</Paper>
		)
	}
	return (
		<Paper className={classes.rootPaper}>
			<Loading />
		</Paper>
	)
}

export default ExamTile
