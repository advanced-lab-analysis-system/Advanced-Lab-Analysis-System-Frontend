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
import useUserStore from '../../../store'
import { QuestionData } from '../../types'

import ReactMarkdown from 'react-markdown'

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

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		let key = question.questionId
		setAnswers({ ...answers, [key]: (event.target as HTMLInputElement).value })
	}

	const submitCurrSelection = () => {
		setEndTime(new Date().toISOString())
		fetch(`http://localhost:9000/candidate/submission?examId=${examId}&candidateId=${username}&questionType=mcq`, {
			method: 'POST',
			headers: {
				Authorization: accessToken,
				'Content-Type': 'application/json',
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
		<Grid container>
			<Grid item md={6}>
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
								onClick={() => submitCurrSelection()}
							/>
						))}
					</RadioGroup>
				</FormControl>
				<Button variant='contained' color='primary' onClick={() => submitCurrSelection()}>
					Submit
				</Button>
			</Grid>
		</Grid>
	)
}

export default MCQQuestion
