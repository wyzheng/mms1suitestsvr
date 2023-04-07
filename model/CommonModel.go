package model

// ExecTestReq 测试服务接口请求结构体
type ExecTestReq struct {
	TemplateKey *string `json:"template_key"`
}

// CosRes cos存储返回结果结构体
type CosRes struct {
	FromPath *string `json:"fromPath"`
	ToPath   *string `json:"toPath"`
	Cost     *int    `json:"cost"`
	Url      *string `json:"url"`
}

// TestRes 测试任务的json结果保存
type TestRes struct {
	NumFailedTestSuites *int `json:"numFailedTestSuites"`
	NumFailedTests      *int `json:"numFailedTests"`
	NumPassedTestSuites *int `json:"numPassedTestSuites"`
	NumPassedTests      *int `json:"numPassedTests"`
	TestResults         *[]TestResSingleSuite
}

type TestResSingleSuite struct {
	NumFailingTests *int             `json:"numFailingTests"`
	NumPassingTests *int             `json:"numPassingTests"`
	NumPendingTests *int             `json:"numPendingTests"`
	NumTodoTests    *int             `json:"numTodoTests"`
	PerfStats       *interface{}     `json:"perfStats"`
	TestFilePath    *string          `json:"testFilePath"`
	FailureMessage  *string          `json:"failureMessage"`
	TestResults     *[]TestResSingle `json:"testResults"`
}

type TestResSingle struct {
	AncestorTitles  *[]string `json:"ancestorTitles"`
	Duration        *int      `json:"duration"`
	FailureMessages *[]string `json:"failureMessages"`
	FailureTag      *string   `json:"failureTag"`
	FullName        *string   `json:"fullName"`
	Status          *string   `json:"status"`
	Title           *string   `json:"title"`
	CaseId          *string   `json:"caseId"`
}

type TestResCaseWeb struct {
	Id          *int    `json:"id" col:"id"`
	TestId      *string `json:"test_id" col:"test_id"`
	CaseId      *string `json:"case_id" col:"case_id"`
	Status      *string `json:"status" col:"status"`
	Duration    *int    `json:"duration" col:"duration"`
	FailureTag  *string `json:"failure_tag" col:"failure_tag"`
	Description *string `json:"description" col:"description"`
	Owner       *string `json:"owner" col:"owner"`
}
