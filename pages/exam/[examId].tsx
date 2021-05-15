import React, { useEffect, useState } from 'react'

import { useRouter } from 'next/router'

import Layout from '../../src/Layout'
import Loading from '../../src/components/Loading'
import CandidateExamLayout from '../../src/components/Exam/candidate/CandidateExamLayout'
import { useUserStore } from '../../store'
import AuthorExamLayout from '../../src/components/Exam/author/AuthorExamLayout'

const exam = () => {
	const router = useRouter()
	const { examId, moduleId } = router.query

	const currRole = useUserStore((state) => state.currRole)

	const [loading, setLoading] = useState(true)

	useEffect(() => {
		if (currRole === null) router.push('/dashboard')
	}, [])

	if (!loading) {
		if (currRole === 'CANDIDATE')
			return (
				<CandidateExamLayout
					examId={examId}
					loading={loading}
					setLoading={setLoading}
				/>
			)
		if (currRole === 'AUTHOR')
			return (
				<AuthorExamLayout
					examId={examId}
					moduleId={moduleId}
					loading={loading}
					setLoading={setLoading}
				/>
			)
	}
	return (
		<Layout>
			<Loading />
		</Layout>
	)
}

export default exam
