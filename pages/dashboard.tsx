import React, { useEffect, useState } from 'react'
import Layout from '../src/Layout'

import Router from 'next/router'

import { Button, Container, Divider, Grid, makeStyles, Paper, Typography } from '@material-ui/core'

import useUserStore from '../store'

import { ExamData } from '../src/types'

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
			<Typography variant='body1' className={classes.tileText}>
				{exam.examName}
			</Typography>
			<Typography variant='body1' className={classes.tileText}>
				{exam.noOfQuestions}
			</Typography>
			<Button variant='contained' color='primary'>
				{exam.status === 'upcoming' ? 'Start' : 'View'}
			</Button>
		</Paper>
	)
}

const dashboard = () => {
	const classes = useStyles()

	const accessToken = useUserStore((state) => state.accessToken)
	const isLoggedIn = useUserStore((state) => state.isLoggedIn)

	const [upcomingExams, setUpcomingExams] = useState<ExamData[]>([])
	const [endedExams, setEndedExams] = useState<ExamData[]>([])

	const getExams = () => {
		fetch('http://localhost:9000/candidate/exams', {
			method: 'GET',
			headers: {
				Authorization: accessToken,
			},
		})
			.then((response) => response.json())
			.then((res) => {
				res.forEach((element: ExamData) => {
					if (element.status === 'upcoming') setUpcomingExams([...upcomingExams, element])
					else setEndedExams([...endedExams, element])
				})
			})
	}

	useEffect(() => {
		if (!isLoggedIn) Router.push('/auth/signin')
		else getExams()
	}, [])

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
			{!isLoggedIn && <>Loading...</>}
		</>
	)
}

export default dashboard
