import {
	Container,
	Grid,
	Paper,
	makeStyles,
	Button,
	TextField,
	FormControl,
	Checkbox,
	FormControlLabel,
	FormGroup,
	FormHelperText,
	FormLabel,
} from '@material-ui/core'
import { useKeycloak } from '@react-keycloak/ssr'
import { KeycloakInstance } from 'keycloak-js'
import Router from 'next/router'
import React, { useEffect, useState } from 'react'
import Loading from '../../src/components/Loading'
import Layout from '../../src/Layout'
import { Batch } from '../../src/types'

const useStyles = makeStyles((theme) => ({
	rootContainer: {
		marginTop: theme.spacing(2),
		marginBottom: theme.spacing(2),
	},
	rootPaper: {
		padding: theme.spacing(2),
	},
	createButton: {
		marginLeft: theme.spacing(2),
	},
}))

const index = () => {
	const { keycloak } = useKeycloak<KeycloakInstance>()

	const classes = useStyles()

	const [batches, setBatches] = useState<Array<Batch>>([])

	const [loading, setLoading] = useState(true)

	const getAllBatches = () => {
		fetch(`http://localhost:9000/author/batches`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${keycloak?.token}`,
			},
		})
			.then((response) => response.json())
			.then((res: Array<Batch>) => {
				if (res.length === 0) {
					setLoading(false)
				} else {
					setBatches(res)
				}
			})
	}

	const createNewModule = () => {
		const selectedBatchesList: Array<string> = []
		batches.forEach((batch) => {
			// @ts-ignore
			if (selectedBatches[batch.id]) selectedBatchesList.push(batch.id)
		})
		fetch(`http://localhost:9000/author/modules`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${keycloak?.token}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				moduleName: moduleName,
				moduleDescription: moduleDescription,
				batchList: selectedBatchesList,
				authorList: {},
				examList: [],
			}),
		}).then(() => Router.push('/dashboard'))
	}

	useEffect(() => {
		if (keycloak?.authenticated) getAllBatches()
	}, [keycloak?.authenticated])

	useEffect(() => {
		if (batches.length !== 0) {
			let tempAllBatches = {}
			batches.forEach((batch) => {
				// @ts-ignore
				tempAllBatches[batch.id] = false
			})
			setSelectedBatches(tempAllBatches)
			setLoading(false)
		}
	}, [batches])

	const useInput = (initialValue: any) => {
		const [value, setValue] = useState(initialValue)
		function handleChange(e: { target: { value: any } }) {
			setValue(e.target.value)
		}
		return [value, handleChange]
	}

	const handleCheckBoxChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setSelectedBatches({
			...selectedBatches,
			[event.target.name]: event.target.checked,
		})
	}

	const [moduleName, setModuleName] = useInput('')

	const [moduleDescription, setModuleDescription] = useInput('')

	const [selectedBatches, setSelectedBatches] = useState<Object>({})

	if (!loading) {
		return (
			<Layout>
				<Container className={classes.rootContainer}>
					<Grid container spacing={2}>
						<Grid item xs={12} container direction='row-reverse'>
							<Grid item className={classes.createButton}>
								<Button
									variant='contained'
									color='primary'
									onClick={() => createNewModule()}>
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
						<Grid item xs={12} md={8}>
							<Paper
								className={classes.rootPaper}
								variant='outlined'>
								<TextField
									id='module-name'
									label='Name'
									variant='outlined'
									fullWidth
									color='primary'
									margin='normal'
									onChange={setModuleName}
								/>
								<TextField
									id='module-description'
									label='Description'
									fullWidth
									multiline
									rows={8}
									variant='outlined'
									margin='normal'
									onChange={setModuleDescription}
								/>
							</Paper>
						</Grid>
						<Grid item xs={12} md={4}>
							<Paper
								className={classes.rootPaper}
								variant='outlined'>
								<FormControl component='fieldset'>
									<FormLabel>
										Select Batches for Module
									</FormLabel>
									<FormGroup
										style={{
											display: 'flex',
											flexDirection: 'row',
											justifyContent: 'space-between',
										}}>
										{batches.map((batch) => (
											<FormControlLabel
												control={
													<Checkbox
														checked={
															// @ts-ignore
															selectedBatches[
																batch.id
															]
														}
														onChange={
															handleCheckBoxChange
														}
														name={batch.id}
													/>
												}
												label={batch.batchName}
											/>
										))}
									</FormGroup>
								</FormControl>
							</Paper>
						</Grid>
					</Grid>
				</Container>
			</Layout>
		)
	}

	return (
		<Layout>
			<Loading />
		</Layout>
	)
}

export default index
