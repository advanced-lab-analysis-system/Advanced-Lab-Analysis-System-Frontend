import create from 'zustand'

type ExamState = {
	inExam: boolean
	handleInExam: (newInExam: boolean) => void
}

const useExamStore = create<ExamState>((set) => ({
	inExam: false,
	handleInExam: (newInExam) => set(() => ({ inExam: newInExam })),
}))

export default useExamStore
