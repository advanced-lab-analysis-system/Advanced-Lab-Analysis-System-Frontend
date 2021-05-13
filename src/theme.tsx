import { createMuiTheme } from '@material-ui/core/styles'

// Create a theme instance.
const theme = createMuiTheme({
	palette: {
		type: 'light',
		background: {
			default: '#ECEFF1',
		},
		secondary: {
			main: '#ff1744',
		},
	},
})

export default theme
