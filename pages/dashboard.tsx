import React, { useEffect, useState } from 'react'
import Layout from '../src/Layout'

import { useKeycloak } from '@react-keycloak/ssr'
import { KeycloakInstance } from 'keycloak-js'
import { useUserStore } from '../store'

import CandidateDashboard from '../src/components/Dashboard/CandidateDashboard'
import RoleChoice from '../src/components/Dashboard/RoleChoice'
import AuthorDashboard from '../src/components/Dashboard/AuthorDashboard'
import Loading from '../src/components/Loading'

const dashboard = () => {
	const { keycloak } = useKeycloak<KeycloakInstance>()

	const [loading, setLoading] = useState<boolean>(true)

	const [roleList, setRoleList] = useState<Array<string> | null>(null)

	const currRole = useUserStore((state) => state.currRole)
	const setCurrRole = useUserStore((state) => state.setCurrRole)

	useEffect(() => {
		if (keycloak?.authenticated) {
			let origRoleList = keycloak.realmAccess?.roles
			let newRoleList: Array<string> = []
			// @ts-ignore
			origRoleList.forEach((role) => {
				if (role === 'CANDIDATE' || role === 'AUTHOR') {
					newRoleList.push(role)
				}
			})
			setRoleList(newRoleList)
		}
	}, [keycloak?.authenticated])

	useEffect(() => {
		if (roleList !== null) {
			if (roleList.length === 0) {
				alert('not a valid account')
			} else if (roleList.length > 1) {
				setLoading(false)
			} else {
				setCurrRole(roleList[0])
			}
		}
	}, [roleList])

	// TODO: need to split into separate module

	if (
		!loading &&
		roleList !== null &&
		roleList.length > 1 &&
		currRole === null
	)
		return <RoleChoice roleList={roleList} setCurrRole={setCurrRole} />

	if (currRole === 'CANDIDATE') return <CandidateDashboard />

	if (currRole === 'AUTHOR') return <AuthorDashboard />

	return (
		<Layout>
			<Loading />
		</Layout>
	)
}

export default dashboard
