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

import { ExamData } from '../src/types'
import Link from '../src/Link'
import { useKeycloak } from '@react-keycloak/ssr'
import { KeycloakInstance } from 'keycloak-js'
import { useExamStore } from '../store'

const useStyles = makeStyles((theme) => ({
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

const ExamTile = ({ exam }: { exam: ExamData }) => {
	const classes = useStyles()

	// @ts-ignore
	const inExam = useExamStore((state) => state.inExam)
	const handleInExam = useExamStore((state) => state.handleInExam)

	const startTest = () => {
		handleInExam(true)
	}

	return (
		<Paper className={classes.examTile} variant='outlined'>
			<Grid container>
				<Grid item md={6}>
					<Typography variant='body1' className={classes.tileText}>
						{exam.examName}
					</Typography>
				</Grid>
				<Grid item md={4}>
					<Typography variant='body1' className={classes.tileText}>
						{exam.noOfQuestions}
					</Typography>
				</Grid>
				<Grid item md={2}>
					<Link
						href={`/exam/${encodeURIComponent(exam.examId)}`}
						passHref>
						<Button
							variant='contained'
							color='primary'
							onClick={() => startTest()}>
							{exam.status === 'upcoming' ? 'Start' : 'View'}
						</Button>
					</Link>
				</Grid>
			</Grid>
		</Paper>
	)
}

const dashboard = () => {
	const classes = useStyles()

	const { keycloak } = useKeycloak<KeycloakInstance>()

	const [upcomingExams, setUpcomingExams] = useState<ExamData[]>([])
	const [endedExams, setEndedExams] = useState<ExamData[]>([])

	// TODO: change url according to REST API
	const getExams = () => {
		fetch(
			`http://localhost:9000/candidate/exams?candidateId==${keycloak?.subject}`,
			{
				method: 'GET',
				headers: {
					Authorization: `Bearer ${keycloak?.token}`,
				},
			}
		)
			.then((response) => response.json())
			.then((res) => {
				res.map((element: ExamData) => {
					if (element.status === 'upcoming')
						setUpcomingExams((upcomingExams) => [
							...upcomingExams,
							element,
						])
					else setEndedExams((endedExams) => [...endedExams, element])
				})
				console.log(res)
			})
	}

	useEffect(() => {
		if (keycloak?.authenticated) getExams()
	}, [keycloak?.authenticated])

	if (keycloak?.authenticated && upcomingExams && endedExams) {
		return (
			<Layout>
				<Container maxWidth='md'>
					<Typography variant='h4' className={classes.examHeader}>
						Exams
					</Typography>
					<Divider />
					<Typography variant='h5' className={classes.examSubheaders}>
						Upcoming Exams
					</Typography>
					{upcomingExams.map((item: ExamData) => (
						<ExamTile exam={item} />
					))}
					<Divider />
					<Typography variant='h5' className={classes.examSubheaders}>
						Ended Exams
					</Typography>
					{endedExams.map((item: ExamData) => (
						<ExamTile exam={item} />
					))}
				</Container>
			</Layout>
		)
	} else if (!keycloak?.authenticated) {
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
}

export default dashboard
