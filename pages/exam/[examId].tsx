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

import {
	CandidateExamData,
	CodingQuestionData,
	MCQQuestionData,
	QuestionData,
} from '../../src/types'

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

const ExamLayout = ({ examDetails }: { examDetails: CandidateExamData }) => {
	const classes = useStyles()
	const [currentQuestion, setCurrentQuestion] = useState<
		QuestionData | MCQQuestionData | CodingQuestionData
		// @ts-ignore
	>({})
	// @ts-ignore
	const [answers, setAnswers] = useState({})

	const [loading, setLoading] = useState(true)

	useEffect(() => {
		setCurrentQuestion(examDetails.questionList[0])
	}, [])

	useEffect(() => {
		if (currentQuestion !== undefined) setLoading(false)
	}, [currentQuestion])

	if (!loading) {
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
								{examDetails.questionList.map(
									(question, key) => (
										<ListItem>
											<Button
												fullWidth
												color='primary'
												variant={
													currentQuestion === question
														? 'contained'
														: 'outlined'
												}
												onClick={() =>
													setCurrentQuestion(question)
												}>{`${key + 1}`}</Button>
										</ListItem>
									)
								)}
							</List>
						</Paper>
					</Drawer>
				</Grid>
				<Grid item md={11}>
					{currentQuestion.questionType === 'mcq' && (
						<MCQQuestion
							// @ts-ignore
							question={currentQuestion}
							answers={answers}
							setAnswers={setAnswers}
							examId={examDetails.id}
						/>
					)}
					{currentQuestion.questionType === 'coding' && (
						<CodingQuestion
							// @ts-ignore
							question={currentQuestion}
							answers={answers}
							setAnswers={setAnswers}
							examId={examDetails.id}
						/>
					)}
				</Grid>
			</Grid>
		)
	}
	return <></>
}

const exam = () => {
	const router = useRouter()
	const { examId } = router.query

	const { keycloak } = useKeycloak<KeycloakInstance>()

	// @ts-ignore
	const [examDetails, setExamDetails] = useState<CandidateExamData>({})
	const [loading, setLoading] = useState(true)

	const fetchExamDetails = () => {
		fetch(`http://localhost:9000/candidate/exam/${examId}`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${keycloak?.token}`,
			},
		})
			.then((response) => response.json())
			.then((res: CandidateExamData) => {
				console.log(res)
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
