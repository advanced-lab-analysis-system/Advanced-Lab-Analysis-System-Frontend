export type ModuleData = {
	id: string
	moduleName: string
	moduleDescription: string
	originalAuthor: string
	authorList: Object
	examList: Array<string>
	batchList: Array<string>
}

export type ExamDataSummary = {
	id: string
	examName: string
	noOfQuestions: number
	examStartTime: Date
	examEndTime: Date
	authorId: string
}

export type CandidateExamData = {
	id: string
	examName: string
	noOfQuestions: number
	examStartTime: Date
	examEndTime: Date
	authorId: string
	status: string
	questionList: Array<QuestionData>
	timeRemaining: number
}

export type QuestionData = {
	questionId: string
	questionType: string
	question: Object
}
