package model

type TestFile struct {
	Id         *int    `json:"id" col:"id"`
	Tag        *string `json:"tag" col:"tag"`
	FileName   *string `json:"file_name" col:"file_name"`
	Owner      *string `json:"owner" col:"owner"`
	UpdateTime *string `json:"update_time" col:"update_time"`
}

type TestTask struct {
	Id         *int    `json:"id" col:"id"`
	Cases      *string `json:"cases" col:"cases"`
	Trigger    *string `json:"trigger" col:"trigger"`
	Status     *string `json:"status" col:"status"`
	UpdateTime *string `json:"update_time" col:"update_time"`
}
