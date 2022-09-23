package service

import (
	"bytes"
	"git.woa.com/wego/wego2/xlog"
	"os"
	"os/exec"
	"strconv"
)

func RunTest(taskId int, templateName string) string {
	cmd := exec.Command("bash", "-c", "--json --outputFile=./static/res/reporter.json --template="+templateName)
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
	err = SetCosFile("s1s/"+strconv.Itoa(taskId)+"result.json", fileContent)
	if err != nil {
		xlog.Errorf("[COS] seet test result into cos failed, file %v", err)
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
