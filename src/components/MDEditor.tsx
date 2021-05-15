import React, { useMemo } from 'react'

import dynamic from 'next/dynamic'

import 'easymde/dist/easymde.min.css'

const SimpleMDE = dynamic(() => import('react-simplemde-editor'), {
	ssr: false,
})

import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
	simpleMDE: {
		zIndex: 10,
	},
}))

const MDEditor = ({ value, onChange }: { value: any; onChange: any }) => {
	const classes = useStyles()

	const SimpleMDEOptions = useMemo(() => {
		return {
			autofocus: true,
			spellChecker: false,
			sideBySideFullscreen: false,
			// @ts-ignore
		} as SimpleMDE.Options
	}, [])

	return (
		<SimpleMDE
			className={classes.simpleMDE}
			value={value}
			options={SimpleMDEOptions}
			onChange={onChange}
		/>
	)
}

export default MDEditor
