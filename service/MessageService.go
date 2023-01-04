package service

import (
	"bytes"
	"encoding/json"
	"git.woa.com/wego/wego2/xlog"
	"mmtestgocommon/define"
	"net/http"
)

func SendRobotMessage(message interface{}) (ret int) {
	url := "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=f46d8f94-fd4b-4ac5-9524-0f458d6de75f"
	messageBytes, err := json.Marshal(message)
	if err != nil {
		xlog.Errorf("Umarshal message struct failed! %v", err)
		//fmt.Println("Umarshal message struct failed! err is", err)
		return define.E_ITIL_MESSAGE_API_ERR
	}

	reader := bytes.NewReader(messageBytes)
	request, err := http.NewRequest("POST", url, reader)
	if err != nil {
		xlog.Errorf("Make tof http request failed! %v", err)
		//fmt.Println("Make tof http request failed! err is", err)
		return define.E_ITIL_MESSAGE_API_ERR
	}
	request.Header.Set("Content-Type", "application/json")

	client := &http.Client{}

	resp, err := client.Do(request)

	if err != nil {
		xlog.Errorf("Request failed! %v", err)
		return define.E_ITIL_MESSAGE_API_ERR
	}

	respBody := &bytes.Buffer{}
	_, err = respBody.ReadFrom(resp.Body)
	if err != nil {
		xlog.Errorf("Read from tof response body failed! %v", err)
		return define.E_ITIL_MESSAGE_API_ERR
	}

	resp.Body.Close()
	if resp.StatusCode != 200 {
		xlog.Errorf("Read from tof response not 200!")
		return define.E_ITIL_MESSAGE_API_ERR
	}

	return 0
}
