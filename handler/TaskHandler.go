package handler

import (
	"encoding/json"
	"fmt"
	"git.woa.com/wego/wego2/xhttp"
	"git.woa.com/wego/wego2/xlog"
	huge "github.com/dablelv/go-huge-util"
	"mms1suitestsvr/config"
	"mms1suitestsvr/dao"
	"mms1suitestsvr/model"
	"mms1suitestsvr/service"
	"mms1suitestsvr/util"
	"mmtestgocommon/define"
	"mmtestgocommon/websvr"
	"net/http"
	"strconv"
	"strings"
	"time"
)

// ExecTest 执行测试任务
func ExecTest(w http.ResponseWriter, r *http.Request) {
	ww := w.(*xhttp.ResponseWriter)
	resp := websvr.CommResp{}
	xlog.Debugf("[Handler] deal with a request.")

	for {
		tasks, err := dao.GetTestTasks()
		if err != nil {
			xlog.Errorf("[Handler] Get params failed, err is %v", err)
			break
		}
		status := *tasks[0].Status
		if status == config.S_TAST_FINISH {
			break
		}
	}

	//从cos拉取模板
	templateParam := websvr.GetStringFromUri(r, "templateKey")

	templateParam = templateParam[1 : len(templateParam)-1]
	templateParams := strings.Split(templateParam, "},")
	xlog.Debugf("[Handler] templateParam is %v.", templateParams[0])
	param := ""
	if len(templateParams) == 1 {
		param = templateParams[0]
	} else {
		param = templateParams[0] + "}"
	}

	var cosRes model.CosRes
	json.Unmarshal([]byte(param), &cosRes) // 反序列化
	templateKey := *cosRes.ToPath
	xlog.Debugf("[Handler] template is %v.", templateKey)
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
	testId := time.Now().Format("20060102150405")
	trigger := "joycesong Manual"
	versionId := 1

	newTask := &model.TestTask{
		VersionId:  &versionId,
		Trigger:    &trigger,
		UpdateTime: &cTime,
		Status:     &config.S_NEW_TASK,
		Template:   &templateName,
		TestId:     &testId,
	}

	taskId, err := dao.InsertTestTask(newTask)
	if err != nil {
		xlog.Errorf("[Dao] Update test task failed! %v", err)
	}
	//获取测试用例
	caseFiles, err := dao.GetTestFiles()

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

	recordId, err := dao.InsertReleaseRecord(releaseRecord)
	if err != nil {
		xlog.Errorf("[Dao] insert release record failed! %v", err)
	}

	service.ArchiveTeatCases(recordId)

	resp.Ret = define.E_SUCCESS
	resp.Message = "Archiving over!"

	ww.MarshalJSON(resp)
	return
}

func GetTestTask(w http.ResponseWriter, r *http.Request) {
	ww := w.(*xhttp.ResponseWriter)
	resp := websvr.CommResp{}
	xlog.Debugf("[Handler] deal with a request.")

	taskArr, err := dao.GetTestTasks()
	if err != nil {
		xlog.Errorf("[Dao] get tasks failed! %v", err)
	}

	resp.Data = taskArr
	resp.Ret = define.E_SUCCESS
	resp.Message = "get all tasks!"

	ww.MarshalJSON(resp)
	return
}

func GetTestTaskReport(w http.ResponseWriter, r *http.Request) {
	ww := w.(*xhttp.ResponseWriter)
	xlog.Debugf("[Handler] deal with a request  GetTestTaskReport.")

	taskId := websvr.GetIntFromUri(r, "id")

	cosKey := "s1s/res/" + strconv.Itoa(taskId) + "/report.html"

	html, err := service.GetCosFile(cosKey)
	if err != nil {
		htmlStr := config.DefaultReportContent
		xlog.Errorf("GetFileFromCos error, err is %v", err)
		ww.Write([]byte(htmlStr))
		return
	}
	ww.Write(html)
	return
}
func GetTestCases(w http.ResponseWriter, r *http.Request) {
	ww := w.(*xhttp.ResponseWriter)
	resp := websvr.CommResp{}
	xlog.Debugf("[Handler] deal with a request.")

	taskArr, err := dao.GetAllTestFiles()
	if err != nil {
		xlog.Errorf("[Dao] get tasks failed! %v", err)
	}

	resp.Data = taskArr
	resp.Ret = define.E_SUCCESS
	resp.Message = "get all test cases!"

	ww.MarshalJSON(resp)
	return
}

func GetS1SResult(w http.ResponseWriter, r *http.Request) {
	ww := w.(*xhttp.ResponseWriter)
	resp := websvr.CommResp{}
	xlog.Debugf("[Handler] deal with a request of result.")
	decoder := json.NewDecoder(r.Body)

	// 用于存放参数key=value数据
	var params map[string]interface{}

	// 解析参数 存入map
	decoder.Decode(&params)

	url := service.GetUrl("mmsearchossopenapisvr", "GetSearchResultLite")
	resp.Data = fmt.Sprintf("%v", service.MMSearch(r, url))

	ww.MarshalJSON(resp)
	return
}
