import {
	Button,
	makeStyles,
	Paper,
	TextField,
	Typography,
	InputAdornment,
	IconButton,
	FormControl,
	InputLabel,
	OutlinedInput,
	FormControlLabel,
	FormLabel,
	Radio,
	RadioGroup,
	Grid,
} from '@material-ui/core'
import React, { useEffect } from 'react'
import 'easymde/dist/easymde.min.css'

import { Delete } from '@material-ui/icons'
import MDEditor from '../MDEditor'

const useStyles = makeStyles((theme) => ({
	rootPaper: {
		padding: theme.spacing(2),
		marginTop: theme.spacing(1),
		marginBottom: theme.spacing(1),
	},
	simpleMDE: {
		zIndex: 10,
	},
	saveButton: {
		marginLeft: theme.spacing(2),
	},
	answerGroup: {
		margin: theme.spacing(2),
	},
}))

const AuthorMCQQuestion = ({
	questionData,
	setQuestionData,
	updateQuestion,
	deleteQuestion,
}: {
	questionData: any
	setQuestionData: any
	updateQuestion: any
	deleteQuestion: any
}) => {
	const classes = useStyles()

	const addOption = () => {
		setQuestionData({
			...questionData,
			options: questionData.options
				? [...questionData.options, '']
				: [''],
		})
	}
	const updateOption = (value: string, ind: number) => {
		let tempOptions = questionData.options.slice()

		tempOptions[ind] = value

		setQuestionData({ ...questionData, options: tempOptions })
	}
	const removeOption = (ind: number) => {
		let tempOptions: Array<string> = questionData.options.slice()

		tempOptions.splice(ind, 1)

		setQuestionData({ ...questionData, options: tempOptions })
	}

	useEffect(() => {
		setQuestionData({
			type: 'mcq',
			statement: '',
			options: [''],
			answer: '',
		})
	}, [])

	return (
		<>
			<Paper className={classes.rootPaper} variant='outlined'>
				<Typography variant='h5'>Statement</Typography>
				<MDEditor
					value={questionData.statement}
					onChange={(value: any) =>
						setQuestionData({
							...questionData,
							statement: value,
						})
					}
				/>
			</Paper>
			<Paper className={classes.rootPaper} variant='outlined'>
				<Typography variant='h5'>Options</Typography>
				{questionData.options &&
					questionData.options.map((_options: any, key: number) => (
						<FormControl
							variant='outlined'
							fullWidth
							margin='normal'>
							<InputLabel htmlFor={`option-${key}`}>
								{`${key + 1}`}
							</InputLabel>
							<OutlinedInput
								id={`option-${key}`}
								label={`${key + 1}`}
								value={questionData.options[key]}
								onChange={(e) =>
									updateOption(e.target.value, key)
								}
								// @ts-ignore
								endAdornment={
									<InputAdornment position='end'>
										<IconButton
											aria-label='delete option'
											onClick={() => removeOption(key)}
											color='secondary'
											onMouseDown={(event) =>
												event.preventDefault()
											}
											edge='end'>
											<Delete fontSize='large' />
										</IconButton>
									</InputAdornment>
								}
							/>
						</FormControl>
					))}
				<div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
					<Button
						variant='outlined'
						color='primary'
						onClick={() => addOption()}>
						Add
					</Button>
				</div>
			</Paper>
			<Paper className={classes.rootPaper} variant='outlined'>
				<Typography variant='h5'>Answer</Typography>
				<Grid container alignItems='center'>
					<Grid item xs={12} md={8} container>
						<FormControl
							component='fieldset'
							className={classes.answerGroup}>
							<RadioGroup
								aria-label='options'
								name='options'
								style={{ width: 'fit-content' }}
								value={
									questionData.answer
										? questionData.answer
										: ''
								}
								onChange={(e) => {
									setQuestionData({
										...questionData,
										answer: e.target.value,
									})
								}}>
								<Grid item container>
									{questionData.options &&
										questionData.options.map(
											(_option: any, key: number) => (
												<FormControlLabel
													value={`${key}`}
													control={
														<Radio color='primary' />
													}
													label={`${key + 1}`}
												/>
											)
										)}
								</Grid>
							</RadioGroup>
						</FormControl>
					</Grid>
					<Grid item xs={12} md={4} container direction='row-reverse'>
						<Button
							variant='outlined'
							color='secondary'
							className={classes.saveButton}
							onClick={() => updateQuestion()}>
							Save
						</Button>
						<Button
							variant='contained'
							color='secondary'
							onClick={() => deleteQuestion()}>
							Delete
						</Button>
					</Grid>
				</Grid>
			</Paper>
		</>
	)
}

export default AuthorMCQQuestion
