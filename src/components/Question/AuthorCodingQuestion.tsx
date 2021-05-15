import { makeStyles, Paper } from '@material-ui/core'
import React from 'react'

const useStyles = makeStyles((theme) => ({
	rootPaper: {
		padding: theme.spacing(2),
	},
}))

const AuthorCodingQuestion = ({
	questionData,
	setQuestionData,
}: {
	questionData: Object
	setQuestionData: any
}) => {
	const classes = useStyles()
	return (
		<Paper className={classes.rootPaper} variant='outlined'>
			CODING
		</Paper>
	)
}

export default AuthorCodingQuestion
