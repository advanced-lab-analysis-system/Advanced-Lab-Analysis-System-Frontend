import {
	Grid,
	Drawer,
	Toolbar,
	Paper,
	List,
	ListItem,
	Button,
	makeStyles,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
} from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import AuthorCodingQuestion from '../Question/AuthorCodingQuestion'
import AuthorMCQQuestion from '../Question/AuthorMCQQuestion'

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
	questionArea: {
		paddingTop: theme.spacing(2),
		paddingBottom: theme.spacing(2),
	},
	questionAreaPaper: {
		padding: theme.spacing(2),
	},
}))

const ExamQuestionsTab = ({
	questionList,
	setQuestionList,
}: {
	questionList: Array<any>
	setQuestionList: any
}) => {
	const classes = useStyles()

	const [currentQuestion, setCurrentQuestion] = useState<number>(0)

	const [questionData, setQuestionData] = useState({ type: 'mcq' })

	const addNewQuestion = () => {
		setQuestionList((questionList: Array<any>) => [
			...questionList,
			{ type: 'mcq' },
		])
		setCurrentQuestion(questionList.length)
		setQuestionData({ type: 'mcq' })
	}

	const updateQuestion = () => {
		let tempQuestionList = questionList.slice()
		tempQuestionList[currentQuestion] = questionData
		setQuestionList(tempQuestionList)
	}

	const deleteQuestion = () => {
		let tempQuestionList = questionList.slice()
		tempQuestionList.pop()
		setQuestionList(tempQuestionList)
		setCurrentQuestion(tempQuestionList.length - 1)
	}

	useEffect(() => {
		setQuestionData(questionList[currentQuestion])
		console.log(questionList)
	}, [currentQuestion])

	useEffect(() => {
		if (questionList.length === 0) addNewQuestion()
		else {
			setCurrentQuestion(0)
			setQuestionData(questionList[0])
		}
	}, [])

	return (
		<Grid
			container
			style={{
				overflow: 'auto',
				flexWrap: 'nowrap',
				maxHeight: '84.5vh',
			}}>
			<Grid item md={1}>
				<Drawer className={classes.drawer} variant='permanent'>
					<Toolbar />
					<Toolbar variant='dense' />
					<Paper
						square
						variant='outlined'
						className={classes.questionList}>
						<List>
							{questionList.map((question, key) => (
								<ListItem>
									<Button
										fullWidth
										color='primary'
										variant={
											currentQuestion === key
												? 'contained'
												: 'outlined'
										}
										onClick={() => setCurrentQuestion(key)}>
										{`${key + 1}`}
									</Button>
								</ListItem>
							))}
							<ListItem>
								<Button
									fullWidth
									color='primary'
									variant='outlined'
									onClick={() => addNewQuestion()}>
									+
								</Button>
							</ListItem>
						</List>
					</Paper>
				</Drawer>
			</Grid>
			<Grid
				item
				container
				spacing={2}
				className={classes.questionArea}
				md={11}>
				<Grid item xs={12}>
					<FormControl variant='outlined' size='small'>
						<InputLabel id='question-type-label'>
							Question Type
						</InputLabel>
						<Select
							labelId='question-type-label'
							id='question-type'
							style={{ width: '7em' }}
							onChange={(e) => {
								setQuestionData({
									...questionData,
									// @ts-ignore
									type: e.target.value,
								})
							}}
							value={questionData.type}
							label='Question Type'>
							{[
								['mcq', 'coding'].map((qType) => (
									<MenuItem
										key={`${qType}-menuItem`}
										value={qType}>
										{qType}
									</MenuItem>
								)),
							]}
						</Select>
					</FormControl>
				</Grid>
				<Grid item xs={12}>
					{questionData.type === 'mcq' && (
						<AuthorMCQQuestion
							questionData={questionData}
							setQuestionData={setQuestionData}
							updateQuestion={updateQuestion}
							deleteQuestion={deleteQuestion}
						/>
					)}
					{questionData.type === 'coding' && (
						<AuthorCodingQuestion
							questionData={questionData}
							setQuestionData={setQuestionData}
							updateQuestion={updateQuestion}
							deleteQuestion={deleteQuestion}
						/>
					)}
				</Grid>
			</Grid>
		</Grid>
	)
}

export default ExamQuestionsTab
