import React, { useEffect, useState } from 'react'

import {
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
	QuestionData,
	MCQQuestionData,
	CodingQuestionData,
} from '../../../types'
import Loading from '../../Loading'
import CandidateCodingQuestion from '../../Question/candidate/CandidateCodingQuestion'
import CandidateMCQQuestion from '../../Question/candidate/CandidateMCQQuestion'
import Layout from '../../../Layout'
import { useKeycloak } from '@react-keycloak/ssr'
import { KeycloakInstance } from 'keycloak-js'
import { useExamStore } from '../../../../store'

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

const CandidateExamLayout = ({
	examId,
	loading,
	setLoading,
}: {
	examId: string
	loading: boolean
	setLoading: any
}) => {
	const { keycloak } = useKeycloak<KeycloakInstance>()

	const handleInExam = useExamStore((state) => state.handleInExam)

	// @ts-ignore
	const [examDetails, setExamDetails] = useState<CandidateExamData>({})

	const fetchExamDetails = () => {
		fetch(`http://localhost:9000/candidate/exam/${examId}`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${keycloak?.token}`,
			},
		})
			.then((response) => response.json())
			.then((res: CandidateExamData) => {
				setExamDetails(res)
				setLoading(false)
			})
	}

	useEffect(() => {
		if (keycloak?.authenticated) {
			fetchExamDetails()
			handleInExam(true)
		}
	}, [keycloak?.authenticated])

	const classes = useStyles()
	const [currentQuestion, setCurrentQuestion] = useState<
		QuestionData | MCQQuestionData | CodingQuestionData
		// @ts-ignore
	>({})
	// @ts-ignore
	const [answers, setAnswers] = useState({})

	useEffect(() => {
		setCurrentQuestion(examDetails.questionList[0])
	}, [])

	useEffect(() => {
		if (currentQuestion !== undefined) setLoading(false)
	}, [currentQuestion])

	return (
		<Layout>
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
									(question: any, key: number) => (
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
						<CandidateMCQQuestion
							// @ts-ignore
							question={currentQuestion}
							answers={answers}
							setAnswers={setAnswers}
							examId={examDetails.id}
						/>
					)}
					{currentQuestion.questionType === 'coding' && (
						<CandidateCodingQuestion
							// @ts-ignore
							question={currentQuestion}
							answers={answers}
							setAnswers={setAnswers}
							examId={examDetails.id}
						/>
					)}
				</Grid>
			</Grid>
		</Layout>
	)
}

export default CandidateExamLayout
