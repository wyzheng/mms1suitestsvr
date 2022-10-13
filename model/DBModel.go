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
	UpdateTime *string `json:"update_time" col:"update_time"`
	Template   *string `json:"template" col:"template"`
}
