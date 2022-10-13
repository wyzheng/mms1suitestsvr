package service

import (
	"bytes"
	"git.woa.com/wego/wego2/xlog"
	"os"
	"os/exec"
	"strconv"
)

// RunTest 根据任务id和模板包名执行测试任务
func RunTest(taskId int, templateName string) string {
	cmd := exec.Command("bash", "-c",
		"npx jest --json --outputFile=./static/res/reporter.json --template="+templateName+" --resPath="+strconv.Itoa(taskId))
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
	err = SetCosFile("s1s/"+strconv.Itoa(taskId)+"/result.json", fileContent)
	if err != nil {
		xlog.Errorf("[COS] set test result into cos failed, file %v", err)
	}

	//存储html结果到cos
	cmd = exec.Command("bash", "-c", "tar -zcvf "+strconv.Itoa(taskId)+"report.tar.gz "+strconv.Itoa(taskId)+"/*")
	cmd.Dir = "./jest-puppeteer-ui-test/static/res"

	if err = cmd.Run(); err != nil {
		xlog.Error(err)
	}
	fileContent, err = os.ReadFile("./jest-puppeteer-ui-test/static/res/" + strconv.Itoa(taskId) + "report.tar.gz")
	err = SetCosFile("s1s/"+strconv.Itoa(taskId)+"/report.tar.gz", fileContent)
	if err != nil {
		xlog.Errorf("[COS] set html result into cos failed, file %v", err)
	}

	/*// 删除本地模板/case/结果文件
	cmdStr := "rm -r ./__tests__ && rm ./static/res/reporter.json && rm -r ./asset/" + templateName
	cmd := exec.Command("/bin/bash", "-c", cmdStr)
	cmd.Dir = "../jest-puppeteer-ui-test"

	if err = cmd.Run(); err != nil {
		xlog.Error(err)
	}*/

	return stdout.String()
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
