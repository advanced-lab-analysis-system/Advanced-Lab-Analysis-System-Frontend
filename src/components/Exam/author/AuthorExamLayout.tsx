import { AppBar, makeStyles, Tab, Tabs } from '@material-ui/core'
import { useKeycloak } from '@react-keycloak/ssr'
import { KeycloakInstance } from 'keycloak-js'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import AuthorExamDetailsTab from './AuthorExamDetailsTab'
import AuthorExamQuestionsTab from './AuthorExamQuestionsTab'
import Layout from '../../../Layout'
import { ExamData } from '../../../types'
import Loading from '../../Loading'

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

const AuthorExamLayout = ({
	moduleId,
	examId,
	loading,
	setLoading,
}: {
	moduleId: string
	examId: string
	loading: boolean
	setLoading: any
}) => {
	const router = useRouter()
	const { keycloak } = useKeycloak<KeycloakInstance>()

	const [value, setValue] = useState(0)

	const classes = useStyles()

	const updateExamData = () => {
		fetch(`http://localhost:9000/author/exam/${examId}`, {
			method: 'PUT',
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
		})
	}

	const getAuthorExamData = () => {
		fetch(`http://localhost:9000/author/exam/${examId}`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${keycloak?.token}`,
			},
		})
			.then((response) => response.json())
			.then((res: ExamData) => {
				setExamName(res.examName)
				setExamStartTime(res.examStartTime)
				setExamEndTime(res.examEndTime)
				setQuestionList(res.questionList)
			})
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
	const [questionList, setQuestionList] = useState<Array<any>>()

	useEffect(() => {
		getAuthorExamData()
	}, [])

	useEffect(() => {
		if (questionList !== undefined) setLoading(false)
	}, [questionList])

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
						saveButtonText={'Update'}
						saveFunction={updateExamData}
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

export default AuthorExamLayout
