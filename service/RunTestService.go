package service

import (
	"bytes"
	"encoding/json"
	"fmt"
	"git.woa.com/wego/wego2/xlog"
	"mms1suitestsvr/config"
	"mms1suitestsvr/dao"
	"mms1suitestsvr/model"
	"mms1suitestsvr/util"
	"os"
	"os/exec"
	"strconv"
	"strings"
	"time"
)

// RunTest 根据任务id和模板包名执行测试任务
func RunTest(taskId int, testId string, templateName string, times int) string {
	cmd := exec.Command("bash", "-c",
		"npx jest --json --outputFile=./static/res/reporter.json --template="+templateName+" --resPath="+testId)
	cmd.Dir = "./jest-puppeteer-ui-test"
	var stdout bytes.Buffer
	var stderr bytes.Buffer
	var err error

	cmd.Stdout = &stdout
	cmd.Stderr = &stderr

	if err = cmd.Run(); err != nil {
		xlog.Error(err)
	}

	xlog.Debugf(stdout.String())
	xlog.Error(stderr.String())

	//存储测试结果到cos
	fileContent, err := os.ReadFile("./jest-puppeteer-ui-test/static/res/reporter.json")
	err = SetCosFile("s1s/res/"+testId+"/result.json", fileContent)
	if err != nil {
		xlog.Errorf("[COS] set test result into cos failed, file %v", err)
	}

	//解析测试结果，存储到sql中
	err_num := ResDecodeSave("./jest-puppeteer-ui-test/static/res/"+testId+"/jest_result.json", &testId)

	// 解析成功失败数目：
	testRes := ""
	res := util.JsonDecodeRes(fileContent)
	testRes = fmt.Sprintf("%v_%v_%v_%v_%v", *res.NumFailedTestSuites, *res.NumPassedTestSuites, *res.NumFailedTests, *res.NumPassedTests, err_num)
	xlog.Debugf("%v_%v_%v_%v_%v", *res.NumFailedTestSuites, *res.NumPassedTestSuites, *res.NumFailedTests, *res.NumPassedTests, err_num)

	// 删除本地case文件转存json结果
	cmdStr := "rm -r ./__tests__/* && mv static/res/" + testId + "/jest_result.json static/res/" + testId + "/jest_result" + strconv.Itoa(times) + ".json"
	cmd = exec.Command("/bin/bash", "-c", cmdStr)
	cmd.Dir = "./jest-puppeteer-ui-test"

	if err = cmd.Run(); err != nil {
		xlog.Error(err)
	}
	//更新测试状态
	UpdateTestTask(taskId, &testRes, times)

	// 最后一波
	if times == -1 {
		AfterTest(testId)
	}

	return stdout.String()
}

func AfterTest(testId string) {
	//存储html结果到cos
	cmd := exec.Command("bash", "-c", "tar -zcvf "+testId+"report.tar.gz "+testId+"/*")
	cmd.Dir = "./jest-puppeteer-ui-test/static/res"

	if err := cmd.Run(); err != nil {
		xlog.Error(err)
	}
	fileContent, err := os.ReadFile("./jest-puppeteer-ui-test/static/res/" + testId + "/jest_html_reporters.html")
	err = SetCosFile("s1s/res/"+testId+"/report.html", fileContent)
	fileContent, err = os.ReadFile("./jest-puppeteer-ui-test/static/res/" + testId + "report.tar.gz")
	err = SetCosFile("s1s/res/"+testId+"/report.tar.gz", fileContent)
	if err != nil {
		xlog.Errorf("[COS] set html result into cos failed, file %v", err)
	}

	err = util.SendMsg(testId)
	if err != nil {
		xlog.Errorf("[wechat work] send message error %v", err)
	}

	task, err := dao.GetTestTaskByTestId(testId)
	if err != nil {
		xlog.Errorf("[SQL] get task err %v", err)
	}
	sendMessage(task, testId)
}

// ArchiveTeatCases 存档测试用例
func ArchiveTeatCases(versionId int) {

	cmd := exec.Command("bash", "-c", "tar -zcvf"+strconv.Itoa(versionId)+"-cases.tar.gz ./*")
	cmd.Dir = "../jest-puppeteer-ui-test/__tests__"

	if err := cmd.Run(); err != nil {
		xlog.Error(err)
	}
	fileContent, err := os.ReadFile("../jest-puppeteer-ui-test/__tests__/" + strconv.Itoa(versionId) + "-cases.tar.gz")
	err = SetCosFile("s1s/cases/"+strconv.Itoa(versionId)+"/cases.tar.gz", fileContent)
	if err != nil {
		xlog.Errorf("[COS] test cases archiving into cos failed, file %v", err)
	}
}

func UpdateTestTask(id int, res *string, times int) {
	task, err := dao.GetTestTaskById(id)

	if task.TestResult != nil {
		arr := strings.Split(*task.TestResult, "_")
		arr2 := strings.Split(*res, "_")
		resTmp := ""
		for i := 0; i < len(arr); i++ {
			num1, _ := strconv.Atoi(arr[i])
			num2, _ := strconv.Atoi(arr2[i])
			tmp := num1 + num2
			if i < len(arr)-1 {
				resTmp += fmt.Sprintf("%d", tmp)
				resTmp += "_"
			} else {
				resTmp += fmt.Sprintf("%d", tmp)
			}
		}
		res = &resTmp
	}
	status := config.S_TASK_TESTING
	if times == -1 {
		status = config.S_TAST_FINISH
	}

	cTime := time.Now().Format("2006-01-02 15:04:05")
	newTask := &model.TestTask{
		VersionId:  task.VersionId,
		Trigger:    task.Trigger,
		UpdateTime: &cTime,
		Status:     &status,
		Template:   task.Template,
		TestResult: res,
	}

	err = dao.UpdateDataTask(id, newTask)
	if err != nil {
		xlog.Errorf("[sql] update task failed, file %v", err)
	}
}

func sendMessage(res *model.TestTask, id string) {
	xlog.Debugf("[sql] generate robot message")
	message := fmt.Sprintf("hi，测试任务%v已完成 \n 点击查看详细测试报告：http://9.134.52.227:8080/#/reportDetail?id=%v", id)
	if res.TestResult != nil {
		arr := strings.Split(*res.TestResult, "_")
		nPassSuite, _ := strconv.Atoi(arr[0])
		nErrSuite, _ := strconv.Atoi(arr[1])
		numSite := nPassSuite + nErrSuite

		nPassCase, _ := strconv.Atoi(arr[2])
		nErrCase, _ := strconv.Atoi(arr[3])
		numCase := nPassCase + nErrCase

		message = fmt.Sprintf("hi，测试任务%v已完成，共计%v个测试合集，%v个测试用例，其中用例执行成功%v，失败%v \n 点击查看详细测试报告：http://9.134.52.227:8080/#/reportDetail?id=%v",
			id, numSite, numCase, nPassCase, nErrCase, id)

	}
	xlog.Debugf(message)
	textMsg := &model.TextMessage{
		Content: &message,
	}
	msgTyp := "text"
	msg := &model.Message{
		MsgType: &msgTyp,
		Text:    textMsg,
	}
	SendRobotMessage(msg)

}

// ResDecodeSave 解析以及存储case、suite粒度的测试结果
func ResDecodeSave(filePath string, testId *string) int {
	fileContent, err := os.ReadFile(filePath)
	if err != nil {
		xlog.Errorf(`decode json result error, error is %v`, err)
	}
	res := util.JsonDecodeRes(fileContent)
	errNum := 0
	//var testCaseTasks []*model.TestCaseTask

	if res.TestResults != nil {
		for i := 0; i < len(*res.TestResults); i++ {
			suitRes := (*res.TestResults)[i]
			status := ""
			if len(*suitRes.TestResults) == 0 {
				status = "fail"
			} else if suitRes.FailureMessage == nil {
				status = "success"
			} else {
				status = "fail+success"
			}
			fileName := strings.Split(*suitRes.TestFilePath, "__tests__/")[1]
			suiteId := strings.ReplaceAll(fileName, ".spec.ts", "")
			suiteId = strings.ReplaceAll(suiteId, "/", ".")

			testRes := fmt.Sprintf("%v_%v_%v_%v", *suitRes.NumPassingTests, *suitRes.NumFailingTests, *suitRes.NumPendingTests, *suitRes.NumTodoTests)
			testTaskSuite := &model.TestSuiteTask{
				TestId:     testId,
				SuiteId:    &suiteId,
				Status:     &status,
				StartTime:  suitRes.PerfStats.Start,
				EndTime:    suitRes.PerfStats.End,
				Duration:   suitRes.PerfStats.Runtime,
				TestResult: &testRes,
				FailureMsg: suitRes.FailureMessage,
			}
			_, err := dao.InsertTestSuiteTasks(testTaskSuite)
			if err != nil {
				xlog.Errorf(`[Dao] insert suite task error, error is %v`, err)
			}

			// case粒度的结果解析
			for j := 0; j < len(*suitRes.TestResults); j++ {
				var caseSingle = (*(*res.TestResults)[i].TestResults)[j]
				message := ""
				for k := 0; k < len(*caseSingle.FailureMessages); k++ {
					message += (*caseSingle.FailureMessages)[k]
				}
				if *(caseSingle.Status) == "errored" {
					errNum++
				}
				caseId := *caseSingle.CaseId
				attachInfo := ""
				if res.AttachInfos != nil {
					a := (*res.AttachInfos)[caseId]
					marshal, _ := json.Marshal(a)
					attachInfo = string(marshal)
				}
				var testCaseTask = &model.TestCaseTask{
					TestId:     testId,
					CaseId:     caseSingle.CaseId,
					Status:     caseSingle.Status,
					Duration:   caseSingle.Duration,
					FailureMsg: &message,
					FailureTag: caseSingle.FailureTag,
					AttachInfo: &attachInfo,
				}
				//testCaseTasks = append(testCaseTasks, testCaseTask)
				_, err := dao.InsertTestCaseTasks(testCaseTask)
				if err != nil {
					xlog.Errorf(`[Dao] insert case task error, error is %v`, err)
				}
			}
		}
	}
	return errNum
}
