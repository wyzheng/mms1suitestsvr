package util

import (
	"errors"
	"fmt"
	"git.woa.com/wego/wego2/xlog"
	huge "github.com/dablelv/go-huge-util"
	comm_define "mmtestgocommon/define"
	comm_model "mmtestgocommon/model"
	comm_tools "mmtestgocommon/tools"
	"strings"
)

// 解压文件

func UnzipFile(source string, dest string) error {
	err := huge.Unzip(source, dest)
	if err != nil {
		xlog.Errorf("[utils] Unzip file error, err is %v", err)
	}
	return err
}

/**
 * @Description 拼接用户组
 **/
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

/**
 * @Description 发送告警
 **/
func SendMsg(taskId int) error {
	msg := comm_model.RtxMessage{}
	user := "joycesong"
	msg.Sender = user
	msg.Receiver = AssembleUser(user, "TOF")
	msg.Title = "超级品专广告UI自动化测试"

	msg.MsgInfo = fmt.Sprintf(
		"任务%v已完成",
		taskId)

	ret := comm_tools.SendRtx(msg)
	if ret != comm_define.E_SUCCESS {
		return errors.New("Send tof rtx msg failed!")
	}

	return nil
}
