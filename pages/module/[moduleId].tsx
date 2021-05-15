import { useRouter } from 'next/router'
import React from 'react'
import Loading from '../../src/components/Loading'
import {
	CandidateModulePage,
	AuthorModulePage,
} from '../../src/components/Module'

import Layout from '../../src/Layout'
import { useUserStore } from '../../store'

const modulePage = () => {
	const router = useRouter()
	const { moduleId } = router.query

	const currRole = useUserStore((state) => state.currRole)

	if (currRole === 'CANDIDATE')
		return <CandidateModulePage moduleId={moduleId} />
	if (currRole === 'AUTHOR') return <AuthorModulePage moduleId={moduleId} />

	return (
		<Layout>
			<Loading />
		</Layout>
	)
}

export default modulePage
