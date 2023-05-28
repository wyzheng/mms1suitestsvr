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
	AttachInfos         *map[string]interface{} `json:"attachInfos"`
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
	AttachInfo  *string `json:"attach_info" col:"attach_info"`
	SuiteDesc   *string `json:"suite_desc" col:"suite_desc"`
	FailureMsg  *string `json:"failure_msg" col:"failure_msg"`
	StartLine   *int    `json:"start_line" col:"start_line"`
}

type TAttachObject struct {
	Description *string `json:"description"`
	CreateTime  *string `json:"createTime"`
	ExtName     *string `json:"extName"`
	FilePath    *string `json:"filePath"`
	FileName    *string `json:"fileName"`
	CaseId      *string `json:"caseId"`
}
