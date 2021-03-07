import {
	Paper,
	CircularProgress,
	Typography,
	List,
	ListItem,
	Grid,
	Divider,
	Button,
	makeStyles,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	TextField,
	FilledInput,
} from '@material-ui/core'
import React, { useState, useEffect } from 'react'
import useUserStore from '../../../store'
import { QuestionData } from '../../types'

import ReactMarkdown from 'react-markdown'

import Editor from '@monaco-editor/react'

const useStyles = makeStyles((theme) => ({
	gridSection: {
		flexGrow: 1,
		display: 'flex',
		minHeight: 0,
		flexWrap: 'nowrap',
		height: '100%',
	},
	gridItemSection: {
		display: 'flex',
	},
	statementSection: {
		display: 'flex',
		flexDirection: 'column',
		flexGrow: 1,
		marginTop: theme.spacing(3),
		marginBottom: theme.spacing(3),
		padding: theme.spacing(1),

		overflow: 'auto',
		flexWrap: 'nowrap',
		maxHeight: '84.5vh',
	},
	editorSection: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'flex-end',

		padding: theme.spacing(3),

		maxHeight: '84.5vh',
		flexGrow: 1,
		overflow: 'auto',
		minHeight: '100%',
		flexWrap: 'nowrap',
	},
	editor: {
		marginTop: theme.spacing(1),
		marginBottom: theme.spacing(2),
	},
	languageOptions: {
		marginRight: theme.spacing(1),
	},
	runButton: {
		marginRight: theme.spacing(2),
	},
}))

const RunTestCase = ({
	index,
	stdin,
	expectedOutput,
	question,
	currentLanguage,
	editorValue,
	examId,
	runTestCase,
}: {
	index: number
	stdin: any
	expectedOutput: any
	question: any
	currentLanguage: number
	editorValue: string
	examId: string
	runTestCase: boolean
}) => {
	const [loading, setLoading] = useState(true)
	const [result, setResult] = useState('')

	const accessToken = useUserStore((state) => state.accessToken)
	const candidateId = useUserStore((state) => state.username)

	const getResult = () => {
		fetch(
			`http://localhost:9000/candidate/submission?examId=${examId}&candidateId=${candidateId}&questionType=coding`,
			{
				method: 'POST',
				headers: {
					Authorization: accessToken,
				},
				body: JSON.stringify({
					questionId: question.questionId,
					language_id: currentLanguage,
					code: window.btoa(editorValue),
					stdin: window.btoa(stdin),
					expectedOutput: window.btoa(expectedOutput),
					submit: false,
				}),
			}
		)
			.then((response) => response.json())
			.then((res) => {
				console.log(res)
				if (res.status_id === 3) {
					setResult('Accepted')
				} else {
					setResult('Rejected')
				}
				setLoading(false)
			})
	}

	useEffect(() => {
		if (runTestCase) {
			setLoading(true)
			getResult()
		}
	}, [runTestCase])
	return (
		<Paper style={{ width: '100%', display: 'flex', justifyItems: 'space-between', padding: '5px' }}>
			{`Test Case - ${index + 1}`}
			{loading && <CircularProgress />}
			{!loading && <Typography>{result}</Typography>}
		</Paper>
	)
}

const TestCases = ({
	testCases,
	setRunTestCase,
	question,
	currentLanguage,
	editorValue,
	examId,
	runTestCase,
}: {
	testCases: Array<any>
	setRunTestCase: any
	question: any
	currentLanguage: number
	editorValue: string
	examId: string
	runTestCase: boolean
}) => {
	return (
		<List style={{ width: '100%' }}>
			{testCases.map((val: { input: any; output: any }, index: number) => (
				<ListItem style={{ width: '100%', paddingLeft: '0', paddingRight: '0' }}>
					<RunTestCase
						index={index}
						stdin={val.input}
						expectedOutput={val.output}
						question={question}
						currentLanguage={currentLanguage}
						editorValue={editorValue}
						examId={examId}
						runTestCase={runTestCase}
					/>
				</ListItem>
			))}
			{setRunTestCase(false)}
		</List>
	)
}

// @ts-ignore
const CodingQuestion = ({
	question,
	answers,
	setAnswers,
	examId,
}: {
	question: QuestionData
	answers: any
	setAnswers: any
	examId: string
}) => {
	const classes = useStyles()

	// @ts-ignore
	const [currentLanguage, setCurrentLanguage] = useState<number>(question.question.languagesAccepted[0].id)

	const [languagesAccepted, setLanguagesAccepted] = useState<Array<any>>([])

	// @ts-ignore
	const [testCases, setTestCases] = useState<Array<any>>(question.question.testCases)

	const [editorValue, setEditorValue] = useState('')

	const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
		console.log(event.target)
		setCurrentLanguage(event.target.value as number)
	}

	const handleEditorChange = (value: string, event: any) => {
		setEditorValue(value)
	}

	useEffect(() => {
		console.log(answers, setAnswers)
		let temp: React.SetStateAction<any[]> = []
		// @ts-ignore
		question.question.languagesAccepted.forEach((language) => {
			// @ts-ignore
			temp.push({ value: language.id, text: languages[language.id] })
		})
		setLanguagesAccepted(temp)
		console.log(languagesAccepted)
	}, [])

	const languages = {
		62: 'java',
		54: 'cpp',
		48: 'c',
		71: 'python',
		70: 'python',
	}

	const [runTestCase, setRunTestCase] = useState(false)
	const [showTestCases, setShowTestCases] = useState(false)

	const runTestCases = () => {
		if (!showTestCases) {
			setShowTestCases(true)
		}
		setRunTestCase(true)
	}
	// Considering shifting to Box for better control over the elements.
	return (
		<Grid container className={classes.gridSection}>
			<Grid item md={4} className={classes.gridItemSection}>
				<Paper className={classes.statementSection} variant='outlined'>
					<Typography variant='h6' component='h1'>
						Statement
					</Typography>
					<Divider />
					{/* @ts-ignore */}
					<ReactMarkdown>{question.question.statement}</ReactMarkdown>
				</Paper>
			</Grid>
			<Grid item md={8} className={classes.editorSection}>
				<FormControl variant='outlined' size='small' className={classes.languageOptions}>
					<InputLabel id='language-option-label'>Language</InputLabel>
					<Select
						labelId='language-option-label'
						id='language-option'
						onChange={handleChange}
						value={currentLanguage}
						label='Language'>
						{[
							languagesAccepted.map((language) => (
								<MenuItem key={`${language.text}-menuItem`} value={language.value}>
									{language.text}
								</MenuItem>
							)),
						]}
					</Select>
				</FormControl>
				{/* @ts-ignore */}
				<Editor
					height='100%'
					theme='vs-dark'
					defaultLanguage='cpp'
					// @ts-ignore
					language={languages[currentLanguage]}
					value={editorValue}
					// @ts-ignore
					onChange={handleEditorChange}
					className={classes.editor}
				/>
				<div>
					<Button
						variant='contained'
						color='primary'
						className={classes.runButton}
						onClick={() => runTestCases()}>
						Run
					</Button>
					<Button variant='contained' color='secondary'>
						Submit
					</Button>
				</div>
				{showTestCases && (
					<TestCases
						testCases={testCases}
						setRunTestCase={setRunTestCase}
						question={question}
						currentLanguage={currentLanguage}
						editorValue={editorValue}
						examId={examId}
						runTestCase={runTestCase}
					/>
				)}
			</Grid>
		</Grid>
	)
}

export default CodingQuestion

// <select name='Language' id='language' onChange={handleChange}>
// 					{/* @ts-ignore */}
// 					{question.question.languagesAccepted.map((language) => (
// 						<>
// 							{/* @ts-ignore */}
// 							<option value={language.id}>{languages[language.id]}</option>
// 						</>
// 					))}
// 				</select>
