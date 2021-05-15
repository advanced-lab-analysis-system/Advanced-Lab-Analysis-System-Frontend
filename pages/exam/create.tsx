import { AppBar, makeStyles, Tab, Tabs } from '@material-ui/core'
import { useKeycloak } from '@react-keycloak/ssr'
import { KeycloakInstance } from 'keycloak-js'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import ExamDetailsTab from '../../src/components/Exam/ExamDetailsTab'
import ExamQuestionsTab from '../../src/components/Exam/ExamQuestionsTab'
import Layout from '../../src/Layout'

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

const create = () => {
	const router = useRouter()
	const { moduleId } = router.query
	const { keycloak } = useKeycloak<KeycloakInstance>()

	const [value, setValue] = useState(0)

	const classes = useStyles()

	const createNewExam = () => {
		fetch(`http://localhost:9000/author/module/${moduleId}/exams`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${keycloak?.token}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				examName: examName,
				noOfQuestions: 0,
				examStartTime: examStartTime,
				examEndTime: examEndTime,
				questionList: [],
			}),
		})
	}

	const handleTabChange = (
		event: React.ChangeEvent<{}>,
		newValue: number
	) => {
		setValue(newValue)
	}

	const useInput = (initialValue: any) => {
		const [value, setValue] = useState(initialValue)
		function handleChange(e: { target: { value: any } }) {
			setValue(e.target.value)
		}
		return [value, handleChange]
	}

	const [examName, setExamName] = useInput('')
	const [examStartTime, setExamStartTime] = useState(new Date().toISOString())
	const [examEndTime, setExamEndTime] = useState(new Date().toISOString())

	return (
		<Layout>
			<div style={{ flexGrow: 1 }}>
				<AppBar position='static' color='secondary'>
					<Tabs
						value={value}
						onChange={handleTabChange}
						indicatorColor='primary'
						aria-label='Exam Tabs'>
						<Tab label='Details' />
						<Tab label='Questions' />
					</Tabs>
				</AppBar>
				{value === 0 && (
					<ExamDetailsTab
						setExamName={setExamName}
						examStartTime={examStartTime}
						setExamStartTime={setExamStartTime}
						examEndTime={examEndTime}
						setExamEndTime={setExamEndTime}
					/>
				)}
				{value === 1 && <ExamQuestionsTab />}
			</div>
		</Layout>
	)
}

export default create
