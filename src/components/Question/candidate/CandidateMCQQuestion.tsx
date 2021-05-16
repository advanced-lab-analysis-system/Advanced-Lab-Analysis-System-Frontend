import {
	Grid,
	Paper,
	FormControl,
	FormLabel,
	RadioGroup,
	FormControlLabel,
	Radio,
	Button,
	makeStyles,
} from '@material-ui/core'
import React, { useState, useEffect } from 'react'

import { MCQQuestionData, QuestionData } from '../../../types'

import ReactMarkdown from 'react-markdown'

import { useKeycloak } from '@react-keycloak/ssr'
import { KeycloakInstance } from 'keycloak-js'

const useStyles = makeStyles((theme) => ({
	statement: {
		display: 'flex',
		flexDirection: 'column',
		flexGrow: 1,
		marginTop: theme.spacing(3),
		marginBottom: theme.spacing(3),
		padding: theme.spacing(1),
	},
	mcqOptions: {
		height: 'inherit',
		padding: theme.spacing(3),
		display: 'flex',
		flexDirection: 'column',
	},
}))

const CandidateMCQQuestion = ({
	examId,
	question,
	answers,
	setAnswers,
}: {
	examId: string
	question: MCQQuestionData
	answers: any
	setAnswers: any
}) => {
	const classes = useStyles()

	const { keycloak } = useKeycloak<KeycloakInstance>()

	const [startTime, setStartTime] = useState<string>('')
	const [endTime, setEndTime] = useState<string>('')

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		let key = question.questionId
		setAnswers({
			...answers,
			[key]: (event.target as HTMLInputElement).value,
		})
	}

	const submitCurrSelection = () => {
		setEndTime(new Date().toISOString())
		fetch(
			`http://localhost:9000/candidate/exam/${examId}/submission?questionType=mcq`,
			{
				method: 'POST',
				headers: {
					Authorization: `Bearer ${keycloak?.token}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					questionId: question.questionId,
					visitStartTime: startTime,
					visitEndTime: endTime,
					selectedAnswer: answers[question.questionId],
				}),
			}
		)
			.then((response) => response.json())
			.then((res) => {
				setStartTime(new Date().toISOString())
			})
	}

	useEffect(() => {
		setStartTime(new Date().toISOString())
		console.log(question)
	}, [])

	return (
		<Grid container>
			<Grid item md={6}>
				<Paper className={classes.statement} variant='outlined'>
					{/* @ts-ignore */}
					<ReactMarkdown>{question.statement}</ReactMarkdown>
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
						{question.options.map((option) => (
							<FormControlLabel
								value={option}
								control={<Radio />}
								label={option}
								onClick={() => submitCurrSelection()}
							/>
						))}
					</RadioGroup>
				</FormControl>
				<Button
					variant='contained'
					color='secondary'
					style={{ alignSelf: 'flex-end' }}
					onClick={() => submitCurrSelection()}>
					Submit
				</Button>
			</Grid>
		</Grid>
	)
}

export default CandidateMCQQuestion
