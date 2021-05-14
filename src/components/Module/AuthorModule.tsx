import {
	Paper,
	CircularProgress,
	makeStyles,
	Typography,
	Button,
} from '@material-ui/core'
import React, { useState, useEffect } from 'react'
import { ModuleData } from '../../types'

import Link from '../../Link'

const useStyles = makeStyles((theme) => ({
	rootPaper: {
		backgroundColor: theme.palette.secondary.dark,
		color: theme.palette.secondary.contrastText,
		padding: theme.spacing(2),
		minHeight: '200px',
		display: 'flex',
		flex: '1',
	},
}))

const AuthorModule = ({ moduleData }: { moduleData: ModuleData }) => {
	const classes = useStyles()

	const [loading, setLoading] = useState<boolean>(true)

	useEffect(() => {
		if (moduleData !== null) {
			setLoading(false)
		} else {
			setLoading(true)
		}
	}, [moduleData])

	if (!loading) {
		return (
			<Link href={`/module/${moduleData.id}`} passHref>
				<Button fullWidth>
					<Paper
						className={classes.rootPaper}
						onClick={() => console.log('module click')}>
						<Typography variant='h4'>
							{moduleData?.moduleName.toUpperCase()}
						</Typography>
					</Paper>
				</Button>
			</Link>
		)
	}

	return (
		<Paper className={classes.rootPaper}>
			<CircularProgress
				style={{
					alignSelf: 'center',
					marginRight: 'auto',
					marginLeft: 'auto',
				}}
			/>
		</Paper>
	)
}

export default AuthorModule
