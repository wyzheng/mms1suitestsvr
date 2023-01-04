package model

type Message struct {
	MsgType *string      `json:"msgtype"`
	Text    *TextMessage `json:"text"`
}

type TextMessage struct {
	Content *string `json:"content"`
}
