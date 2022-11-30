package model

// TestFile 测试用例文件结构，定义测试文件基本信息
type TestFile struct {
	Id         *int    `json:"id" col:"id"`
	Tag        *string `json:"tag" col:"tag"`
	FileName   *string `json:"file_name" col:"file_name"`
	Owner      *string `json:"owner" col:"owner"`
	UpdateTime *string `json:"update_time" col:"update_time"`
}

// TestTask 测试任务结构，定义测试任务基本信息
type TestTask struct {
	Id         *int    `json:"id" col:"id"`
	VersionId  *int    `json:"version_id" col:"version_id"`
	Trigger    *string `json:"trigger" col:"trigger"`
	Status     *string `json:"status" col:"status"`
	TestResult *string `json:"test_result" col:"test_result"`
	UpdateTime *string `json:"update_time" col:"update_time"`
	Template   *string `json:"template" col:"template"`
}

// ReleaseRecord 上线发布记录结构，定义上线记录的基本信息
type ReleaseRecord struct {
	Id           *int    `json:"id" col:"id"`
	TemplateName *string `json:"template_name" col:"template_name"`
	User         *string `json:"user" col:"user"`
	RecordTime   *string `json:"record_time" col:"record_time"`
}
