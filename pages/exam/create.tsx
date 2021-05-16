import { AppBar, makeStyles, Tab, Tabs } from '@material-ui/core'
import { useKeycloak } from '@react-keycloak/ssr'
import { KeycloakInstance } from 'keycloak-js'
import Router, { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import AuthorExamDetailsTab from '../../src/components/Exam/author/AuthorExamDetailsTab'
import AuthorExamQuestionsTab from '../../src/components/Exam/author/AuthorExamQuestionsTab'
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
		let tempExamStartTime = new Date(examStartTime)
		tempExamStartTime.setSeconds(0)
		tempExamStartTime.setMilliseconds(0)

		let tempExamEndTime = new Date(examEndTime)
		tempExamEndTime.setSeconds(0)
		tempExamEndTime.setMilliseconds(0)

		let tempQuestionList = questionList.slice()
		for (let i = 0; i < tempQuestionList.length; i++) {
			// @ts-ignore
			tempQuestionList[i].questionId = i
		}

		fetch(`http://localhost:9000/author/module/${moduleId}/exams`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${keycloak?.token}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				examName: examName,
				noOfQuestions: questionList.length,
				examStartTime: tempExamStartTime,
				examEndTime: tempExamEndTime,
				questionList: tempQuestionList,
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

	const [examName, setExamName] = useState('')
	const [examStartTime, setExamStartTime] = useState(new Date())
	const [examEndTime, setExamEndTime] = useState(new Date())
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
					<AuthorExamDetailsTab
						examName={examName}
						setExamName={setExamName}
						examStartTime={examStartTime}
						setExamStartTime={setExamStartTime}
						examEndTime={examEndTime}
						setExamEndTime={setExamEndTime}
						saveButtonText={'Create'}
						saveFunction={createNewExam}
						cancelFunction={cancelExamCreation}
					/>
				)}
				{value === 1 && (
					<AuthorExamQuestionsTab
						questionList={questionList}
						setQuestionList={setQuestionList}
					/>
				)}
			</div>
		</Layout>
	)
}

export default create
