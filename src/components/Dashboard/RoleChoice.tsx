import { Grid, Button } from '@material-ui/core'
import React from 'react'
import Layout from '../../Layout'

const RoleChoice = ({
	roleList,
	setCurrRole,
}: {
	roleList: Array<string>
	setCurrRole: any
}) => {
	return (
		<Layout>
			<Grid container>
				{roleList.map((role) => (
					<Grid
						item
						xs
						style={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
						}}>
						<Button
							variant='contained'
							color='secondary'
							onClick={() => {
								setCurrRole(role)
							}}>
							{role}
						</Button>
					</Grid>
				))}
			</Grid>
		</Layout>
	)
}

export default RoleChoice
