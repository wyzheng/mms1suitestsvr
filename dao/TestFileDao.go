package dao

import (
	"errors"
	"git.woa.com/wego/wego2/xlog"
	"mms1suitestsvr/config"
	"mms1suitestsvr/model"
	"mmtestgocommon/database"
)

// InsertTestFile 增加一个测试用例文件
func InsertTestFile(testFile *model.TestFile) (int, error) {
	xlog.Debug("[DAO]:Insert a test file into db.")

	err, id := database.Insert(
		config.Mms1suitestDB,
		config.TestFileTable,
		testFile,
	)
	return id, err
}

// GetTestFileByName 获取测试文件对象
func GetTestFileByName(name string) (*model.TestFile, error) {
	xlog.Debugf("[DAO]:Get a test file from db by %s.", name)

	conditions := make(map[string]interface{})
	conditions["file_name"] = name
	xlog.Debugf(name)
	err, list := database.Query(
		config.Mms1suitestDB,
		config.TestFileTable,
		conditions,
		&model.TestFile{},
		"id",
		false)

	if err != nil {
		xlog.Errorf("Get test file by name failed! %v", err)
	}
	if len(list) == 0 {
		return nil, errors.New("no test file of this name")
	}
	return list[0].(*model.TestFile), err
}

// GetTestFiles 获取所有测试文件名称
func GetTestFiles() ([]string, error) {
	xlog.Debugf("[DAO]:Get a test file from db by %s.")

	err, list := database.Query(
		config.Mms1suitestDB,
		config.TestFileTable,
		nil,
		&model.TestFile{},
		"id",
		false)

	if len(list) == 0 {
		return nil, errors.New("no test file of this name")
	}
	var dataList []string
	for _, item := range list {
		snap := &model.TestFile{}
		snap = item.(*model.TestFile)
		dataList = append(dataList, *snap.FileName)
	}
	return dataList, err
}
