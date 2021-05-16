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

	useEffect(() => {
		if (currRole === null) router.push('/dashboard')
	}, [])

	if (currRole === 'CANDIDATE') return <CandidateExamLayout examId={examId} />
	if (currRole === 'AUTHOR')
		return <AuthorExamLayout examId={examId} moduleId={moduleId} />
	return (
		<Layout>
			<Loading />
		</Layout>
	)
}

export default exam
