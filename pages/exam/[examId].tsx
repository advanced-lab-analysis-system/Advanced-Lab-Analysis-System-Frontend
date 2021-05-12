import React, { useEffect, useState } from 'react'

import { useRouter } from 'next/router'

import {
	CircularProgress,
	makeStyles,
	Grid,
	Paper,
	List,
	ListItem,
	Button,
	Drawer,
	Toolbar,
} from '@material-ui/core'

import { ExamDataAndQuestions, QuestionData } from '../../src/types'

import Layout from '../../src/Layout'
import MCQQuestion from '../../src/components/Exam/MCQQuestion'
import CodingQuestion from '../../src/components/Exam/CodingQuestion'
import { useKeycloak } from '@react-keycloak/ssr'
import { KeycloakInstance } from 'keycloak-js'

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
}))

const ExamLayout = ({ examDetails }: { examDetails: ExamDataAndQuestions }) => {
	const classes = useStyles()
	// @ts-ignore
	const [currentQuestion, setCurrentQuestion] = useState<QuestionData>({})
	// @ts-ignore
	const [answers, setAnswers] = useState({})

	return (
		<Grid container>
			<Grid item md={1}>
				<Drawer className={classes.drawer} variant='permanent'>
					<Toolbar />
					<Paper
						square
						variant='outlined'
						className={classes.questionList}>
						<List>
							{examDetails.questions.map((question, key) => (
								<ListItem>
									<Button
										fullWidth
										variant='outlined'
										onClick={() =>
											setCurrentQuestion(question)
										}>{`${key + 1}`}</Button>
								</ListItem>
							))}
						</List>
					</Paper>
				</Drawer>
			</Grid>
			<Grid item md={11}>
				{currentQuestion.questionType === 'mcq' && (
					<MCQQuestion
						question={currentQuestion}
						answers={answers}
						setAnswers={setAnswers}
						examId={examDetails.examId}
					/>
				)}
				{currentQuestion.questionType === 'coding' && (
					<CodingQuestion
						question={currentQuestion}
						answers={answers}
						setAnswers={setAnswers}
						examId={examDetails.examId}
					/>
				)}
			</Grid>
		</Grid>
	)
}

const exam = () => {
	const router = useRouter()
	const { examId } = router.query

	const { keycloak } = useKeycloak<KeycloakInstance>()

	// @ts-ignore
	const [examDetails, setExamDetails] = useState<ExamDataAndQuestions>({})
	const [loading, setLoading] = useState(true)

	const fetchExamDetails = () => {
		fetch(`http://localhost:9000/candidate/exams/${examId}`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${keycloak?.token}`,
			},
		})
			.then((response) => response.json())
			.then((res) => {
				setExamDetails(res)
				setLoading(false)
			})
	}

	useEffect(() => {
		if (keycloak?.authenticated) fetchExamDetails()
	}, [keycloak?.authenticated])

	if (loading) {
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
	} else {
		return (
			<Layout>
				<ExamLayout examDetails={examDetails} />
			</Layout>
		)
	}
}

export default exam
