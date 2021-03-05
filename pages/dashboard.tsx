import React, { useEffect, useState } from 'react'
import Layout from '../src/Layout'

import Router from 'next/router'

import { Button, CircularProgress, Container, Divider, Grid, makeStyles, Paper, Typography } from '@material-ui/core'

import useUserStore from '../store'

import { ExamData } from '../src/types'
import Link from '../src/Link'

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
					<Link href={`/exam/${encodeURIComponent(exam.examId)}`} passHref>
						<Button variant='contained' color='primary'>
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

	const accessToken = useUserStore((state) => state.accessToken)
	const username = useUserStore((state) => state.username)
	const isLoggedIn = useUserStore((state) => state.isLoggedIn)

	const [upcomingExams, setUpcomingExams] = useState<ExamData[]>([])
	const [endedExams, setEndedExams] = useState<ExamData[]>([])

	const getExams = () => {
		fetch(`http://localhost:9000/candidate/exams?candidateId==${username}`, {
			method: 'GET',
			headers: {
				Authorization: accessToken,
			},
		})
			.then((response) => response.json())
			.then((res) => {
				res.map((element: ExamData) => {
					if (element.status === 'upcoming') setUpcomingExams((upcomingExams) => [...upcomingExams, element])
					else setEndedExams((endedExams) => [...endedExams, element])
				})
				console.log(res)
			})
	}

	useEffect(() => {
		if (!isLoggedIn) Router.push('/auth/signin')
		else getExams()
	}, [isLoggedIn])

	return (
		<>
			{isLoggedIn && upcomingExams && endedExams && (
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
			)}
			{!isLoggedIn && <CircularProgress />}
		</>
	)
}

export default dashboard
