package Dao

import (
	"git.woa.com/wego/wego2/xlog"
	"mms1suitestsvr/config"
	"mms1suitestsvr/model"
	"mmtestgocommon/database"
)

func InsertTestTask(testTask *model.TestTask) (int, error) {
	xlog.Debug("[DAO]:Insert a test file into db.")

	err, id := database.Insert(
		config.Mms1suitestDB,
		config.TestTaskTable,
		testTask,
	)
	return id, err
}

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
	if err != nil {
		xlog.Errorf("Update test task failed! %v", err)
	}
	return err
}
