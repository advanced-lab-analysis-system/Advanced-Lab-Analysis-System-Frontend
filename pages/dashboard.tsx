import React, { useEffect, useState } from 'react'
import Layout from '../src/Layout'

import Router from 'next/router'

import { Container, Paper, Typography } from '@material-ui/core'

import useUserStore from '../store'

const dashboard = () => {
	const accessToken = useUserStore((state) => state.accessToken)
	const isLoggedIn = useUserStore((state) => state.isLoggedIn)

	const [exams, setExams] = useState([])

	const getExams = () => {
		fetch('http://localhost:9000/candidate/exams', {
			method: 'GET',
			headers: {
				Authorization: accessToken,
			},
		})
			.then((response) => response.json())
			.then((res) => {
				setExams(res)
			})
	}

	useEffect(() => {
		if (!isLoggedIn) Router.push('/auth/signin')
		else getExams()
	}, [])

	return (
		<>
			{isLoggedIn && exams && (
				<Layout>
					<Container maxWidth='md'>
						<Typography variant='h5'>Exams</Typography>
						{exams.map((item, key) => (
							<Paper>{item.examId}</Paper>
						))}
					</Container>
				</Layout>
			)}
			{!isLoggedIn && <>Loading...</>}
		</>
	)
}

export default dashboard
