package util

import (
	"encoding/json"
	"errors"
	"fmt"
	"git.woa.com/wego/wego2/xlog"
	huge "github.com/dablelv/go-huge-util"
	"mms1suitestsvr/model"
	comm_define "mmtestgocommon/define"
	comm_model "mmtestgocommon/model"
	comm_tools "mmtestgocommon/tools"
	"os"
	"strings"
)

// UnzipFile 解压文件
func UnzipFile(source string, dest string) error {
	err := huge.Unzip(source, dest)
	if err != nil {
		xlog.Errorf("[utils] Unzip file error, err is %v", err)
	}
	return err
}

// AssembleUser 拼接用户组
func AssembleUser(user string, msgType string) string {
	defaultWatcher := []string{"joycesong"}
	if !comm_tools.IsStrContain(defaultWatcher, user) {
		defaultWatcher = append(defaultWatcher, user)
	}

	if "DEVOPS" == msgType {
		return strings.Join(defaultWatcher, ",")
	}

	return strings.Join(defaultWatcher, ";")
}

// SendMsg 发送测试完成消息
func SendMsg(taskId int) error {
	msg := comm_model.RtxMessage{}
	user := "joycesong"
	msg.Sender = user
	msg.Receiver = AssembleUser(user, "TOF")
	msg.Title = "超级品专广告UI自动化测试"

	msg.MsgInfo = fmt.Sprintf(
		"任务%v已完成，点击查看测试报告：http://9.134.52.227:8080/#/reportDetail?id=%v",
		taskId, taskId)

	ret := comm_tools.SendRtx(msg)
	if ret != comm_define.E_SUCCESS {
		return errors.New("Send tof rtx msg failed!")
	}

	return nil
}

// JsonDecode 字符串解析json结构体
func JsonDecodeRes(content []byte) *model.TestRes {
	var jsonRes model.TestRes
	err := json.Unmarshal(content, &jsonRes)
	if err != nil {
		xlog.Errorf("[utils] json result decode error, err is %v", err)
	}
	return &jsonRes
}

func IsDirExist(dirPath string) bool {
	_, err := os.Stat(dirPath)
	return err == nil || os.IsExist(err)
}

func CreateDirIfNotExist(dirPath string) error {
	if _, err := os.Stat(dirPath); os.IsNotExist(err) {
		err = os.MkdirAll(dirPath, os.ModePerm)
		if err != nil {
			return err
		}
	}
	return nil
}
