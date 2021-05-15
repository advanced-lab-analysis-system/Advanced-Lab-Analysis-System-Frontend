import MomentUtils from '@date-io/moment'
import {
	Button,
	Container,
	Grid,
	makeStyles,
	Paper,
	TextField,
	Typography,
} from '@material-ui/core'
import {
	MuiPickersUtilsProvider,
	KeyboardDatePicker,
	KeyboardTimePicker,
} from '@material-ui/pickers'
import Router from 'next/router'
import React, { useEffect } from 'react'

const useStyles = makeStyles((theme) => ({
	rootContainer: {
		marginTop: theme.spacing(2),
		marginBottom: theme.spacing(2),
		flexGrow: 1,
	},
	rootPaper: {
		padding: theme.spacing(2),
	},
	createButton: {
		marginLeft: theme.spacing(2),
	},
}))

const ExamDetailsTab = ({
	examName,
	setExamName,
	examStartTime,
	setExamStartTime,
	examEndTime,
	setExamEndTime,
	createNewExam,
}: {
	examName: string
	setExamName: any
	examStartTime: string
	setExamStartTime: any
	examEndTime: string
	setExamEndTime: any
	createNewExam: any
}) => {
	const classes = useStyles()

	useEffect(() => {
		console.log(examStartTime)
	}, [])

	return (
		<Container className={classes.rootContainer}>
			<Grid container spacing={2}>
				<Grid item container xs={12} direction='row-reverse'>
					<Grid item className={classes.createButton}>
						<Button
							variant='outlined'
							color='primary'
							onClick={() => createNewExam()}>
							Create
						</Button>
					</Grid>
					<Grid item>
						<Button
							variant='contained'
							color='secondary'
							onClick={() => Router.push('/dashboard')}>
							Cancel
						</Button>
					</Grid>
				</Grid>
				<Grid item xs={12} md={6}>
					<Paper className={classes.rootPaper} variant='outlined'>
						<TextField
							id='examName'
							label='Exam Name'
							variant='outlined'
							value={examName}
							onChange={setExamName}
							fullWidth
						/>
					</Paper>
				</Grid>
				<Grid item xs={12} md={6}>
					<Paper className={classes.rootPaper} variant='outlined'>
						<MuiPickersUtilsProvider utils={MomentUtils}>
							<Grid container justify='space-around'>
								<Grid item xs={12} md={6}>
									<KeyboardDatePicker
										disableToolbar
										variant='inline'
										inputVariant='outlined'
										format='DD/MM/yyyy'
										margin='normal'
										id='start-date'
										label='Start Date'
										value={examStartTime}
										onChange={setExamStartTime}
										KeyboardButtonProps={{
											'aria-label': 'change date',
										}}
									/>
								</Grid>
								<Grid item xs={12} md={6}>
									<KeyboardTimePicker
										disableToolbar
										variant='inline'
										inputVariant='outlined'
										margin='normal'
										id='start-time'
										label='Start Time'
										value={examStartTime}
										onChange={setExamStartTime}
										KeyboardButtonProps={{
											'aria-label': 'change time',
										}}
									/>
								</Grid>
								<Grid
									item
									xs={12}
									style={{
										display: 'flex',
										justifyContent: 'center',
									}}>
									<Typography variant='caption'>
										TO
									</Typography>
								</Grid>
								<Grid item xs={12} md={6}>
									<KeyboardDatePicker
										disableToolbar
										variant='inline'
										inputVariant='outlined'
										format='DD/MM/yyyy'
										margin='normal'
										id='end-date'
										label='End Date'
										value={examEndTime}
										onChange={setExamEndTime}
										KeyboardButtonProps={{
											'aria-label': 'change date',
										}}
									/>
								</Grid>
								<Grid item xs={12} md={6}>
									<KeyboardTimePicker
										disableToolbar
										variant='inline'
										inputVariant='outlined'
										margin='normal'
										id='end-time'
										label='End Time'
										value={examEndTime}
										onChange={setExamEndTime}
										KeyboardButtonProps={{
											'aria-label': 'change time',
										}}
									/>
								</Grid>
							</Grid>
						</MuiPickersUtilsProvider>
					</Paper>
				</Grid>
			</Grid>
		</Container>
	)
}

export default ExamDetailsTab
