package model

type ExecTestReq struct {
	TemplateKey *string `json:"template_key"`
}

type CosRes struct {
	FromPath *string `json:"fromPath"`
	ToPath   *string `json:"toPath"`
	Cost     *int    `json:"cost"`
	Url      *string `json:"url"`
}
