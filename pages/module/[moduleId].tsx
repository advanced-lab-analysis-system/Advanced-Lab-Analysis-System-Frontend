import { useRouter } from 'next/router'
import React from 'react'
import Layout from '../../src/Layout'

const modulePage = () => {
	const router = useRouter()
	const { moduleId } = router.query

	return <Layout>{moduleId}</Layout>
}

export default modulePage
