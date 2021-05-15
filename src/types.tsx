export type ModuleData = {
	id: string
	moduleName: string
	moduleDescription: string
	originalAuthor: string
	authorList: Object
	examList: Array<string>
	batchList: Array<string>
}

export type Batch = {
	id: string
	batchName: string
	batchDescription: string
	moduleList: Array<string>
	candidateList: Array<string>
	status: string
}

export type ExamData = {
	id: string
	examName: string
	noOfQuestions: number
	examStartTime: string
	examEndTime: string
	authorId: string
	status: string
	questionList: Array<CodingQuestionData | MCQQuestionData>
}

export type ExamDataSummary = {
	id: string
	examName: string
	noOfQuestions: number
	examStartTime: string
	examEndTime: string
	authorId: string
	status: string
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

export interface QuestionData {
	questionId: string
	questionType: string
	statement: string
}

export interface MCQQuestionData extends QuestionData {
	options: Array<string>
}

export interface CodingQuestionData extends QuestionData {
	languagesAccepted: Array<Language>
	timeLimit: number
	memoryLimit: number
}

export interface Language {
	id: number
	name: string
}
