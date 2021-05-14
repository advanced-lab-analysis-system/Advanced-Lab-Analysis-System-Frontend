import { CircularProgress } from '@material-ui/core'
import React from 'react'

const Loading = () => {
	return (
		<CircularProgress
			style={{
				alignSelf: 'center',
				marginRight: 'auto',
				marginLeft: 'auto',
			}}
		/>
	)
}

export default Loading
