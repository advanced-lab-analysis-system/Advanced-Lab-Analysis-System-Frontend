import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import useUserStore from '../../store'
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
	Typography,
	Divider,
	FormControl,
	FormLabel,
	RadioGroup,
	FormControlLabel,
	Radio,
} from '@material-ui/core'
import { ExamDataAndQuestions, QuestionData } from '../../src/types'
import Layout from '../../src/Layout'

import Router from 'next/router'

import ReactMarkdown from 'react-markdown'

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
		maxHeight: '90vh',
		padding: theme.spacing(3),
	},
	statement: {
		display: 'flex',
		flexDirection: 'column',
		flexGrow: 1,
		marginTop: theme.spacing(3),
		marginBottom: theme.spacing(3),
		padding: theme.spacing(1),
	},
	formControl: {
		margin: theme.spacing(1),
		minWidth: 120,
	},
	mcqOptions: {
		height: 'inherit',
		padding: theme.spacing(3),
		display: 'flex',
		flexDirection: 'column',
	},
}))

const MCQQuestion = ({
	examId,
	question,
	answers,
	setAnswers,
}: {
	examId: string
	question: QuestionData
	answers: any
	setAnswers: any
}) => {
	const classes = useStyles()

	const username = useUserStore((state) => state.username)
	const accessToken = useUserStore((state) => state.accessToken)

	const [startTime, setStartTime] = useState<string>('')
	const [endTime, setEndTime] = useState<string>('')

	const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
		// @ts-ignore
		let key = question.questionId
		setAnswers({ ...answers, key: event.target.value as string })
	}

	const submitCurrSelection = () => {
		setEndTime(new Date().toISOString())
		fetch(`http://localhost:9000/candidate/submission?examId=${examId}&candidateId=${username}&questionType=mcq`, {
			method: 'POST',
			headers: {
				Authorization: accessToken,
			},
			body: JSON.stringify({
				questionId: question.questionId,
				visitStartTime: startTime,
				visitEndTime: endTime,
				selectedAnswer: answers[question.questionId],
			}),
		})
			.then((response) => response.json())
			.then((res) => {
				console.log(res)
				setStartTime(new Date().toISOString())
			})
	}

	useEffect(() => setStartTime(new Date().toISOString()), [])

	return (
		<Grid container style={{ height: '100%' }}>
			<Grid item md={6} style={{ display: 'flex' }}>
				<Paper className={classes.statement} variant='outlined'>
					{/* @ts-ignore */}
					<ReactMarkdown>{question.question.statement}</ReactMarkdown>
				</Paper>
			</Grid>
			<Grid item md={6} className={classes.mcqOptions}>
				<FormControl component='fieldset'>
					<FormLabel color='primary'>Select an Answer</FormLabel>
					<RadioGroup
						aria-label='gender'
						name='gender1'
						value={answers[question.questionId]}
						onChange={handleChange}>
						{/* @ts-ignore */}
						{question.question.options.map((option) => (
							<FormControlLabel
								value={option}
								control={<Radio />}
								label={option}
								onClick={() => submitCurrSelection}
							/>
						))}
					</RadioGroup>
				</FormControl>
				<Button variant='contained' color='primary' onClick={() => submitCurrSelection}>
					Submit
				</Button>
			</Grid>
		</Grid>
	)
}
// @ts-ignore
const CodingQuestion = ({
	question,
	answers,
	setAnswers,
}: {
	question: QuestionData
	answers: any
	setAnswers: any
}) => {
	const classes = useStyles()

	// @ts-ignore
	const [currentLanguage, setCurrentLanguage] = useState<number>(question.question.languagesAccepted[0])

	const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
		setCurrentLanguage(event.target.value as number)
	}

	useEffect(() => {
		console.log(answers, setAnswers)
	}, [])

	const languages = {
		62: 'java',
		54: 'cpp',
		48: 'c',
		71: 'python',
		70: 'python',
	}

	return (
		<Grid container style={{ height: '100%' }}>
			<Grid item md={4} style={{ display: 'flex' }}>
				<Paper className={classes.statement} variant='outlined'>
					<Typography variant='h6' component='h1'>
						Statement
					</Typography>
					<Divider />
					{/* @ts-ignore */}
					<ReactMarkdown>{question.question.statement}</ReactMarkdown>
				</Paper>
			</Grid>
			<Grid item md={8} className={classes.editor}>
				<select name='Language' id='language' onChange={handleChange}>
					{/* @ts-ignore */}
					{question.question.languagesAccepted.map((language) => (
						<>
							{/* @ts-ignore */}
							<option value={language.id}>{languages[language.id]}</option>
						</>
					))}
				</select>
				{/* @ts-ignore */}
				<Editor height='100%' theme='vs-dark' defaultLanguage='java' language={languages[currentLanguage]} />
			</Grid>
		</Grid>
	)
}

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
				{currentQuestion.questionType === 'mcq' && (
					<MCQQuestion
						question={currentQuestion}
						answers={answers}
						setAnswers={setAnswers}
						examId={examDetails.examId}
					/>
				)}
				{currentQuestion.questionType === 'coding' && (
					<CodingQuestion question={currentQuestion} answers={answers} setAnswers={setAnswers} />
				)}
			</Grid>
		</Grid>
	)
}

const exam = () => {
	const router = useRouter()
	const { examId } = router.query

	const accessToken = useUserStore((state) => state.accessToken)
	const isLoggedIn = useUserStore((state) => state.isLoggedIn)

	// @ts-ignore
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
	}, [isLoggedIn])

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
