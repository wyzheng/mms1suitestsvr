package handler

import (
	"encoding/json"
	"fmt"
	"git.woa.com/wego/wego2/xhttp"
	"git.woa.com/wego/wego2/xlog"
	huge "github.com/dablelv/go-huge-util"
	"mms1suitestsvr/Dao"
	"mms1suitestsvr/config"
	"mms1suitestsvr/model"
	"mms1suitestsvr/service"
	"mms1suitestsvr/util"
	"mmtestgocommon/define"
	"mmtestgocommon/websvr"
	"net/http"
	"strings"
	"time"
)

// ExecTest 执行测试任务
func ExecTest(w http.ResponseWriter, r *http.Request) {
	ww := w.(*xhttp.ResponseWriter)
	resp := websvr.CommResp{}
	xlog.Debugf("[Handler] deal with a request.")

	//从cos拉取模板
	templateParam := websvr.GetStringFromUri(r, "templateKey")

	var cosRes model.CosRes
	json.Unmarshal([]byte(templateParam[1:len(templateParam)-1]), &cosRes) // 反序列化
	templateKey := *cosRes.ToPath
	fmt.Println(templateKey)

	tmp := strings.Split(templateKey, "/")
	templateName := tmp[len(tmp)-1]

	err := util.GetFileFromCos(templateKey, "./jest-puppeteer-ui-test/asset/"+templateName)
	if err != nil {
		xlog.Errorf("[Handler] Get params failed, err is %v", err)
		return
	}

	pos := strings.Index(templateName, ".")

	//解压
	err = huge.Unzip("./jest-puppeteer-ui-test/asset/"+templateName, "./jest-puppeteer-ui-test/asset/"+templateName[0:pos])
	if err != nil {
		xlog.Errorf("[Handler] Unzip template zip error, err is %v", err)
		return
	}

	// 新建测试任务
	cTime := time.Now().Format("2006-01-02 15:04:05")
	trigger := "joycesong Manual"
	versionId := 1

	newTask := &model.TestTask{
		VersionId:  &versionId,
		Trigger:    &trigger,
		UpdateTime: &cTime,
		Status:     &config.S_NEW_TASK,
		Template:   &templateName,
	}

	taskId, err := Dao.InsertTestTask(newTask)
	if err != nil {
		xlog.Errorf("[Dao] Update test task failed! %v", err)
	}
	//获取测试用例
	caseFiles, err := Dao.GetTestFiles()

	if err != nil {
		xlog.Errorf("Get test file names failed! %v", err)
	}

	for i := range caseFiles {
		err = service.GetTestCase(caseFiles[i], "./jest-puppeteer-ui-test/__tests__/"+caseFiles[i])
		xlog.Debugf("Get test file %v", caseFiles[i])
		if err != nil {
			xlog.Errorf("[COS] download test case %v from cos failed, file %v", caseFiles[i], err)
			return
		}
	}
	//执行测试任务，存储测试结果
	go service.RunTest(taskId, templateName[0:pos])

	resp.Ret = define.E_SUCCESS
	resp.Message = "testing!"

	ww.MarshalJSON(resp)
	return
}

// CaseArchive 归档测试用例
func CaseArchive(w http.ResponseWriter, r *http.Request) {
	ww := w.(*xhttp.ResponseWriter)
	resp := websvr.CommResp{}
	xlog.Debugf("[Handler] deal with a request.")

	cTime := time.Now().Format("2006-01-02 15:04:05")
	templateName := websvr.GetStringFromUri(r, "templateName")
	user := websvr.GetStringFromUri(r, "user")

	releaseRecord := &model.ReleaseRecord{
		TemplateName: &templateName,
		RecordTime:   &cTime,
		User:         &user,
	}

	recordId, err := Dao.InsertReleaseRecord(releaseRecord)
	if err != nil {
		xlog.Errorf("[Dao] insert release record failed! %v", err)
	}

	service.ArchiveTeatCases(recordId)

	resp.Ret = define.E_SUCCESS
	resp.Message = "Archiving over!"

	ww.MarshalJSON(resp)
	return
}
