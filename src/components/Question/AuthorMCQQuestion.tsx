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
} from '@material-ui/core'
import React, { useEffect, useMemo, useState } from 'react'
import 'easymde/dist/easymde.min.css'

import dynamic from 'next/dynamic'
import { Delete, Visibility, VisibilityOff } from '@material-ui/icons'
import clsx from 'clsx'

const SimpleMDE = dynamic(() => import('react-simplemde-editor'), {
	ssr: false,
})

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

	const [loading, setLoading] = useState(true)

	const SimpleMDEOptions = useMemo(() => {
		return {
			autofocus: true,
			spellChecker: false,
			sideBySideFullscreen: false,
			// @ts-ignore
		} as SimpleMDE.Options
	}, [])

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
			...questionData,
			statement: '',
			options: [''],
			answer: '',
		})
	}, [])

	return (
		<>
			<Paper className={classes.rootPaper} variant='outlined'>
				<Typography variant='h5'>Statement</Typography>
				<SimpleMDE
					className={classes.simpleMDE}
					value={questionData.statement}
					options={SimpleMDEOptions}
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
					questionData.options.map((options: any, key: number) => (
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
											onMouseDown={(event) =>
												event.preventDefault()
											}
											edge='end'>
											<Delete />
										</IconButton>
									</InputAdornment>
								}
							/>
						</FormControl>
					))}
				<Button
					variant='outlined'
					color='primary'
					onClick={() => addOption()}>
					Add
				</Button>
			</Paper>
			<Paper className={classes.rootPaper} variant='outlined'>
				<Typography variant='h5'>Answer</Typography>
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
					}}>
					<TextField
						label={`Enter Answer index`}
						variant='outlined'
						size='medium'
						margin='normal'
						value={questionData.answer ? questionData.answer : ''}
						onChange={(e) => {
							setQuestionData({
								...questionData,
								answer: e.target.value,
							})
						}}
					/>
					<div>
						<Button
							variant='contained'
							color='secondary'
							onClick={() => deleteQuestion()}>
							Delete
						</Button>
						<Button
							variant='outlined'
							color='secondary'
							className={classes.saveButton}
							onClick={() => updateQuestion()}>
							Save
						</Button>
					</div>
				</div>
			</Paper>
		</>
	)
}

export default AuthorMCQQuestion
