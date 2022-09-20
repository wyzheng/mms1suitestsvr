package service

import (
	"bytes"
	"git.woa.com/wego/wego2/xlog"
	"mms1suitestsvr/model"
	"os"
	"os/exec"
)

func RunTest() string {
	cmd := exec.Command("bash", "-c", "npm run test:exportJson")
	cmd.Dir = "../jest-puppeteer-ui-test"
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

	fileName := "test.spec.ts.res"
	caseType := "box"

	file := &model.TestFile{
		FileName: &fileName,
		Tag:      &caseType,
	}
	fileContent, err := os.ReadFile("../jest-puppeteer-ui-test/static/res/reporter.json")

	CommitTestCases(file, fileContent)

	return stdout.String()
}
