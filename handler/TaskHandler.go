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
		if status != config.S_NEW_TASK {
			break
		}
	}

	//从cos拉取模板
	templateParam := websvr.GetStringFromUri(r, "templateKey")
	pNum := websvr.GetIntFromUri(r, "pnum")

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
		VersionId: &versionId,
		Trigger:   &trigger,
		StartTime: &cTime,
		Status:    &config.S_NEW_TASK,
		Template:  &templateName,
		TestId:    &testId,
	}

	taskId, err := dao.InsertTestTask(newTask)
	if err != nil {
		xlog.Errorf("[Dao] Update test task failed! %v", err)
	}
	//获取测试用例
	caseFiles, err := dao.GetTestFiles()

	if err != nil {
		xlog.Errorf("Get test file names failed! %v", err)
		newTask.Status = &config.S_TAST_ERROR
		err = dao.UpdateDataTask(taskId, newTask)
		if err != nil {
			return
		}
	}

	//先串行
	times := len(caseFiles) % pNum
	//执行测试任务，存储测试结果
	newTask.Status = &config.S_TASK_TESTING
	err = dao.UpdateDataTask(taskId, newTask)
	for j := 0; j <= times; j++ {
		if (j+1)*pNum > len(caseFiles) {
			for i := pNum * j; i < len(caseFiles); i++ {
				err = service.GetTestCase(caseFiles[i], "./jest-puppeteer-ui-test/__tests__/"+caseFiles[i])
				xlog.Debugf("Get test file %v", caseFiles[(pNum*j)+i])
				if err != nil {
					xlog.Errorf("[COS] download test case %v from cos failed, file %v", caseFiles[i], err)
					newTask.Status = &config.S_TAST_ERROR
					err = dao.UpdateDataTask(taskId, newTask)
					return
				}
			}
			go service.RunTest(taskId, testId, templateName[0:pos], -1)
		} else {
			for i := 0; i < pNum; i++ {
				for i := pNum * j; i < len(caseFiles); i++ {
					err = service.GetTestCase(caseFiles[(pNum*j)+i], "./jest-puppeteer-ui-test/__tests__/"+caseFiles[(pNum*j)+i])
					xlog.Debugf("Get test file %v", caseFiles[(pNum*j)+i])
					if err != nil {
						xlog.Errorf("[COS] download test case %v from cos failed, file %v", caseFiles[(pNum*j)+i], err)
						newTask.Status = &config.S_TAST_ERROR
						err = dao.UpdateDataTask(taskId, newTask)
						return
					}
				}
				go service.RunTest(taskId, testId, templateName[0:pos], j)
			}
		}
	}
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

	var params map[string]interface{}
	decoder.Decode(&params)

	url := service.GetUrl("mmsearchossopenapisvr", "GetSearchResultLite")
	resp.Data = fmt.Sprintf("%v", service.MMSearch(params, url))

	ww.MarshalJSON(resp)
	return
}

// GetTestCaseTaskDetail for web 获取case粒度的测试任务信息
func GetTestCaseTaskDetail(w http.ResponseWriter, r *http.Request) {
	ww := w.(*xhttp.ResponseWriter)
	resp := websvr.CommResp{}
	xlog.Debugf("[Handler] deal with a request.")

	testId := websvr.GetIntFromUri(r, "id")
	suiteId := websvr.GetStringFromUri(r, "suite_id")
	taskCaseArr, err := dao.GetTaskDetailsByTestId(testId, suiteId)
	if err != nil {
		xlog.Errorf("[Dao] get tasks failed! %v", err)
	}

	resp.Data = taskCaseArr
	resp.Ret = define.E_SUCCESS
	resp.Message = "get all test cases!"

	ww.MarshalJSON(resp)
	return
}

func GetTestTaskByTestId(w http.ResponseWriter, r *http.Request) {
	ww := w.(*xhttp.ResponseWriter)
	resp := websvr.CommResp{}
	xlog.Debugf("[Handler] deal with a request.")

	testId := websvr.GetStringFromUri(r, "id")

	taskArr, err := dao.GetTestTaskByTestId(testId)
	if err != nil {
		xlog.Errorf("[Dao] get tasks failed! %v", err)
	}

	resp.Data = taskArr
	resp.Ret = define.E_SUCCESS
	resp.Message = "get all tasks!"

	ww.MarshalJSON(resp)
	return
}

// GetTestCaseTaskDetail for web 获取case粒度的测试任务信息
func GetTestSuiteTaskDetail(w http.ResponseWriter, r *http.Request) {
	ww := w.(*xhttp.ResponseWriter)
	resp := websvr.CommResp{}
	xlog.Debugf("[Handler] deal with a request.")

	testId := websvr.GetIntFromUri(r, "id")
	println(testId)
	taskCaseArr, err := dao.GetSuiteTaskDetailsByTestId(testId)
	if err != nil {
		xlog.Errorf("[Dao] get tasks failed! %v", err)
	}

	resp.Data = taskCaseArr
	resp.Ret = define.E_SUCCESS
	resp.Message = "get all test cases!"

	ww.MarshalJSON(resp)
	return
}
