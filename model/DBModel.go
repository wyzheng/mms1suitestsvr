package model

// TestFile 测试用例文件结构，定义测试文件基本信息
type TestFile struct {
	Id         *int    `json:"id" col:"id"`
	Tag        *string `json:"tag" col:"tag"`
	FileName   *string `json:"file_name" col:"file_name"`
	Owner      *string `json:"owner" col:"owner"`
	UpdateTime *string `json:"update_time" col:"update_time"`
	SuiteDesc  *string `json:"suite_desc" col:"suite_desc"` // 新增，增加suite描述
	SuiteId    *string `json:"suite_id" col:"suite_id"`
}

// TestTask 测试任务结构，定义测试任务基本信息
type TestTask struct {
	Id         *int    `json:"id" col:"id"`
	TestId     *string `json:"test_id" col:"test_id"` // 新增，比较清晰的记录任务执行时间等
	VersionId  *int    `json:"version_id" col:"version_id"`
	Trigger    *string `json:"trigger" col:"trigger"`
	Status     *string `json:"status" col:"status"`
	TestResult *string `json:"test_result" col:"test_result"`
	StartTime  *string `json:"start_time" col:"start_time"`
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

// TestTaskNew 新-测试任务结构，定义测试任务基本信息
type TestTaskNew struct {
	Id         *int    `json:"id" col:"id"`
	TestId     *string `json:"test_id" col:"test_id"` // 新增，比较清晰的记录任务执行时间等
	VersionId  *int    `json:"version_id" col:"version_id"`
	Trigger    *string `json:"trigger" col:"trigger"`
	Status     *string `json:"status" col:"status"`
	TestResult *string `json:"test_result" col:"test_result"`
	UpdateTime *string `json:"update_time" col:"update_time"`
	Template   *string `json:"template" col:"template"`
}

// TestCases 测试用例结构，定义测试用例基本信息
type TestCases struct {
	Id          *int    `json:"id" col:"id"`
	CaseId      *string `json:"case_id" col:"case_id"`
	Description *string `json:"description" col:"description"`
	Owner       *string `json:"owner" col:"owner"`
	SuiteDesc   *string `json:"suite_desc" col:"suite_desc"`
	CreateTime  *string `json:"create_time" col:"create_time"`
	UpdateTime  *string `json:"update_time" col:"update_time"`
	Comment     *string `json:"comment" col:"comment"`
	StartLine   *int    `json:"start_line" col:"start_line"`
	SuiteId     *string `json:"suite_id" col:"suite_id"`
}

// TestCaseTask 测试任务（case粒度）结构，定义测试任务&结果基本信息
type TestCaseTask struct {
	Id         *int    `json:"id" col:"id"`
	TestId     *string `json:"test_id" col:"test_id"`
	CaseId     *string `json:"case_id" col:"case_id"`
	Status     *string `json:"status" col:"status"`
	Duration   *int    `json:"duration" col:"duration"`
	FailureMsg *string `json:"failure_msg" col:"failure_msg"`
	FailureTag *string `json:"failure_tag" col:"failure_tag"`
	AttachInfo *string `json:"attach_info" col:"attach_info"`
}

type TestSuiteTask struct {
	Id         *int    `json:"id" col:"id"`
	TestId     *string `json:"test_id" col:"test_id"`
	SuiteId    *string `json:"suite_id" col:"suite_id"`
	Status     *string `json:"status" col:"status"`
	StartTime  *int    `json:"start_time" col:"start_time"`
	EndTime    *int    `json:"end_time" col:"end_time"`
	Duration   *int    `json:"duration" col:"duration"`
	TestResult *string `json:"test_result" col:"test_result"`
	FailureMsg *string `json:"failure_msg" col:"failure_msg"`
}
