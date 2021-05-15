import { AppBar, makeStyles, Tab, Tabs } from '@material-ui/core'
import { useKeycloak } from '@react-keycloak/ssr'
import { KeycloakInstance } from 'keycloak-js'
import Router, { useRouter } from 'next/router'
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
	appBar: {
		zIndex: theme.zIndex.drawer + 1,
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
				noOfQuestions: questionList.length,
				examStartTime: examStartTime,
				examEndTime: examEndTime,
				questionList: questionList,
			}),
		}).then(() => router.push(`/module/${moduleId}`))
	}

	const handleTabChange = (
		event: React.ChangeEvent<{}>,
		newValue: number
	) => {
		setValue(newValue)
	}

	const cancelExamCreation = () => {
		router.push(`/module/${moduleId}`)
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
	const [questionList, setQuestionList] = useState([])

	return (
		<Layout>
			<div
				style={{
					flexGrow: 1,
				}}>
				<AppBar
					position='relative'
					color='secondary'
					className={classes.appBar}>
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
						examName={examName}
						setExamName={setExamName}
						examStartTime={examStartTime}
						setExamStartTime={setExamStartTime}
						examEndTime={examEndTime}
						setExamEndTime={setExamEndTime}
						createNewExam={createNewExam}
						cancelExamCreation={cancelExamCreation}
					/>
				)}
				{value === 1 && (
					<ExamQuestionsTab
						questionList={questionList}
						setQuestionList={setQuestionList}
					/>
				)}
			</div>
		</Layout>
	)
}

export default create
