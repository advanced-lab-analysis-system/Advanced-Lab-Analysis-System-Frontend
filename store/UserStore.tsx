import create from 'zustand'

type UserState = {
	currRole: string | null
	setCurrRole: (newRole: string) => void
}

const useUserStore = create<UserState>((set) => ({
	currRole: null,
	setCurrRole: (newRole) => set(() => ({ currRole: newRole })),
}))

export default useUserStore
