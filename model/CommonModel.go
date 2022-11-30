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

// 测试任务的json结果保存
type TestRes struct {
	NumFailedTestSuites *int `json:"numFailedTestSuites"`
	NumFailedTests      *int `json:"numFailedTests"`
	NumPassedTestSuites *int `json:"numPassedTestSuites"`
	NumPassedTests      *int `json:"numPassedTests"`
}
