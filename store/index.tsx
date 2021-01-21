import create from 'zustand'

type UserState = {
	username: string
	fullname: string
	accessToken: string
	isLoggedIn: boolean
	role: string
	addAccessToken: (newAccessToken: string) => void
	addUsername: (newUsername: string) => void
	addFullname: (newFullname: string) => void
	addRole: (newRole: string) => void
	handleIsLoggedIn: (newIsLoggedIn: boolean) => void
	clearUserData: () => void
}

const useUserStore = create<UserState>((set) => ({
	username: '',
	fullname: '',
	accessToken: 'Bearer ',
	isLoggedIn: false,
	role: '',
	addAccessToken: (newAccessToken) => set((state) => ({ accessToken: state.accessToken + newAccessToken })),
	addUsername: (newUsername) => set(() => ({ username: newUsername })),
	addFullname: (newFullname) => set(() => ({ fullname: newFullname })),
	addRole: (newRole) => set(() => ({ role: newRole })),
	handleIsLoggedIn: (newIsLoggedIn) => set(() => ({ isLoggedIn: newIsLoggedIn })),
	clearUserData: () => set({ username: '', fullname: '', accessToken: '' }),
}))

export default useUserStore
