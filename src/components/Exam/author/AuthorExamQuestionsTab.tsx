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
import AuthorCodingQuestion from '../../Question/author/AuthorCodingQuestion'
import AuthorMCQQuestion from '../../Question/author/AuthorMCQQuestion'

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

const AuthorExamQuestionsTab = ({
	questionList,
	setQuestionList,
}: {
	questionList: Array<any>
	setQuestionList: any
}) => {
	const classes = useStyles()

	const [currentQuestion, setCurrentQuestion] = useState<number>(0)

	const [questionData, setQuestionData] = useState({ questionType: 'mcq' })

	const addNewQuestion = () => {
		setQuestionList((questionList: Array<any>) => [
			...questionList,
			{ questionType: 'mcq' },
		])
		setCurrentQuestion(questionList.length)
		setQuestionData({ questionType: 'mcq' })
	}

	const updateQuestion = (languagesAccepted) => {
		let tempQuestionList = questionList.slice()
		let tempQuestionData = questionData
		tempQuestionData.languagesAccepted = languagesAccepted
		tempQuestionList[currentQuestion] = tempQuestionData
		setQuestionList(tempQuestionList)
	}

	const deleteQuestion = (ind: number) => {
		let tempQuestionList = questionList.slice()
		console.log(tempQuestionList, currentQuestion)
		tempQuestionList.splice(currentQuestion, 1)
		if (tempQuestionList.length === 0) {
			setQuestionList([
				{
					questionType: 'mcq',
					statement: '',
					options: [''],
					answer: 0,
				},
			])
			setCurrentQuestion(0)
		} else {
			setQuestionList(tempQuestionList)
			if (currentQuestion == 0) setQuestionData(tempQuestionList[0])
			else setCurrentQuestion(currentQuestion - 1)
		}
	}

	useEffect(() => {
		setQuestionData(questionList[currentQuestion])
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
									questionType: e.target.value,
								})
							}}
							value={questionData.questionType}
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
					{questionData.questionType === 'mcq' && (
						<AuthorMCQQuestion
							questionData={questionData}
							setQuestionData={setQuestionData}
							updateQuestion={updateQuestion}
							deleteQuestion={deleteQuestion}
						/>
					)}
					{questionData.questionType === 'coding' && (
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

export default AuthorExamQuestionsTab
