export type ExamData = {
	examId: string
	batchId: string
	examName: string
	subject: string
	noOfQuestions: number
	examStartTime: Date
	examEndTime: Date
	author: string
	status: string
}

export type ExamDataAndQuestions = {
	examId: string
	batchId: string
	examName: string
	subject: string
	noOfQuestions: number
	examStartTime: Date
	examEndTime: Date
	author: string
	status: string
	questions: Array<QuestionData>
}

export type QuestionData = {
	questionId: string
	questionType: string
	question: Object
}
