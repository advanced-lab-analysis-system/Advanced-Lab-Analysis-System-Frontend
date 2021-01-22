import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import useUserStore from '../../store'
import { CircularProgress, makeStyles, Grid, Paper, List, ListItem, Button, Drawer, Toolbar } from '@material-ui/core'
import { ExamDataAndQuestions, QuestionData } from '../../src/types'
import Layout from '../../src/Layout'

import Router from 'next/router'

import Editor from '@monaco-editor/react'

const useStyles = makeStyles((theme) => ({
	main: {
		padding: theme.spacing(2),
	},
	questionList: {
		height: '100%',
	},
	drawer: {
		flexShrink: 0,
	},
	editor: {
		height: 'inherit',
		padding: theme.spacing(3),
	},
}))

const MCQQuestion = ({ question }: { question: QuestionData }) => {
	return <div></div>
}

const CodingQuestion = ({ question }: { question: QuestionData }) => {
	const classes = useStyles()
	return (
		<Grid container style={{ height: '100%' }}>
			<Grid item md={4}></Grid>
			<Grid item md={8} className={classes.editor}>
				<Editor height='100%' theme='vs-dark' defaultLanguage='javascript' defaultValue='// some comment' />
			</Grid>
		</Grid>
	)
}

const ExamLayout = ({ examDetails }: { examDetails: ExamDataAndQuestions }) => {
	const classes = useStyles()
	const [currentQuestion, setCurrentQuestion] = useState<QuestionData>({})

	return (
		<Grid container>
			<Grid item md={1}>
				<Drawer className={classes.drawer} variant='permanent'>
					<Toolbar />
					<Paper square variant='outlined' className={classes.questionList}>
						<List>
							{examDetails.questions.map((question, key) => (
								<ListItem>
									<Button
										fullWidth
										variant='outlined'
										onClick={() => setCurrentQuestion(question)}>{`${key + 1}`}</Button>
								</ListItem>
							))}
						</List>
					</Paper>
				</Drawer>
			</Grid>
			<Grid item md={11}>
				{currentQuestion.questionType === 'mcq' && <MCQQuestion question={currentQuestion} />}
				{currentQuestion.questionType === 'coding' && <CodingQuestion question={currentQuestion} />}
			</Grid>
		</Grid>
	)
}

const exam = () => {
	const router = useRouter()
	const { examId } = router.query

	const accessToken = useUserStore((state) => state.accessToken)
	const isLoggedIn = useUserStore((state) => state.isLoggedIn)

	const [examDetails, setExamDetails] = useState<ExamDataAndQuestions>({})
	const [loading, setLoading] = useState(true)

	const fetchExamDetails = () => {
		fetch(`http://localhost:9000/candidate/exams/${examId}`, {
			method: 'GET',
			headers: {
				Authorization: accessToken,
			},
		})
			.then((response) => response.json())
			.then((res) => {
				setExamDetails(res)
				setLoading(false)
			})
	}

	useEffect(() => {
		if (!isLoggedIn) Router.push('/auth/signin')
		else fetchExamDetails()
	}, [])

	return (
		<>
			{loading && <CircularProgress />}
			{!loading && (
				<Layout>
					<ExamLayout examDetails={examDetails} />
				</Layout>
			)}
		</>
	)
}

export default exam
