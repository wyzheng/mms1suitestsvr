package service

import (
	"fmt"
	"git.woa.com/wego/wego2/xlog"
	"mms1suitestsvr/model"
)

const FileGitCosDir = "s1s_test"

func CommitTestCases(file *model.TestFile, fileContent []byte) {
	xlog.Debug("commit test cases into cos, file %v", *file.FileName)

	cosKey := fmt.Sprintf("%s/latest/%s", FileGitCosDir, *file.FileName)

	err := SetCosFile(cosKey, fileContent)
	if err != nil {
		xlog.Errorf("commit test cases into cos failed, file %v", *file.FileName)
	}
}

func GetTestCase(fileName string, localPath string) error {
	xlog.Debug("dowload test cases from cos, file %v", fileName)

	cosKey := fmt.Sprintf("%s/latest/%s", FileGitCosDir, fileName)
	err := DownloadCosFile(cosKey, localPath)

	return err
}
