package dao

import (
	"errors"
	"git.woa.com/wego/wego2/xlog"
	"mms1suitestsvr/config"
	"mms1suitestsvr/model"
	"mmtestgocommon/database"
)

// InsertTestTask 增加一条测试任务
func InsertTestTask(testTask *model.TestTask) (int, error) {
	xlog.Debug("[DAO]:Insert a test file into db.")

	err, id := database.Insert(
		config.Mms1suitestDB,
		config.TestTaskTable,
		testTask,
	)
	return id, err
}

// UpdateDataTask 更新测试任务
func UpdateDataTask(id int, testTask *model.TestTask) error {
	xlog.Debugf("[DAO]:Update test task.")

	conditions := make(map[string]interface{})

	conditions["id"] = id

	err := database.Update(
		config.Mms1suitestDB,
		config.TestTaskTable,
		conditions,
		testTask,
	)
	return err
}

// GetTestTasks 获取所有测试文件名称
func GetTestTasks() ([]*model.TestTask, error) {
	xlog.Debugf("[DAO]:Get a test file from db by %s.")

	err, list := database.Query(
		config.Mms1suitestDB,
		config.TestTaskTable,
		nil,
		&model.TestTask{},
		"id",
		false)

	if len(list) == 0 {
		return nil, errors.New("no test file of this name")
	}
	var dataList []*model.TestTask
	for _, item := range list {
		snap := &model.TestTask{}
		snap = item.(*model.TestTask)
		dataList = append(dataList, snap)
	}
	return dataList, err
}
