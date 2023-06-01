package dao

import (
	"database/sql"
	"errors"
	"fmt"
	"git.woa.com/wego/wego2/database/orm"
	"git.woa.com/wego/wego2/xlog"
	"mms1suitestsvr/config"
	"mms1suitestsvr/model"
	"mmtestgocommon/database"
	"reflect"
)

// InsertTestSuiteTasks 增加测试用例粒度的测试结果
func InsertTestSuiteTasks(testSuiteTask *model.TestSuiteTask) (int, error) {
	xlog.Debug("[DAO]:Insert a test  into db.")

	err, id := database.Insert(
		config.Mms1suitestDB,
		config.TestSuiteTaskTable,
		testSuiteTask,
	)

	return id, err
}

func GetSuiteTaskDetailsByTestId(testID int) ([]*model.TestResSuiteWeb, error) {
	xlog.Debugf("[DAO]:Get test case task from db by %s.", testID)

	conditions := make(map[string]interface{})
	conditions["test_id"] = testID

	list, err := joinQuery(
		config.Mms1suitestDB,
		config.TestSuiteTaskTable,
		conditions,
		&model.TestResSuiteWeb{})

	if len(list) == 0 {
		return nil, errors.New("no test case task of this id")
	}
	var dataList []*model.TestResSuiteWeb
	for _, item := range list {
		snap := &model.TestResSuiteWeb{}
		snap = item.(*model.TestResSuiteWeb)
		dataList = append(dataList, snap)
	}
	return dataList, err
}

func joinQuery(db *sql.DB, table string, conditions map[string]interface{}, model interface{}) ([]interface{}, error) {

	ormOption := &orm.OrmOption{Table: table}
	ormModel, err := orm.NewOrm(ormOption, model)
	if err != nil {
		xlog.Errorf("Update database failed! Err : %v", err)
		return nil, err
	}

	sqlStr := "select A.*, B.*  from test_task_suite as A join test_file as B on A.suite_id = B.suite_id where "
	for condition := range conditions {
		value := conditions[condition]
		xlog.Debugf(" condition == limit: %v, condition: %v ", condition == "limit", condition)
		if condition != "limit" {
			if "string" == reflect.TypeOf(conditions[condition]).Name() {
				value = fmt.Sprintf("'%s'", value)
			}
			sqlStr = fmt.Sprintf("%s %s=%v", sqlStr, condition, value)
		}
	}

	list, err := db.Query(sqlStr)

	if err != nil {
		xlog.Errorf("Query database failed! Err : %v", err)
	}

	var respList []interface{}
	if list == nil {
		xlog.Debugf("[dao]Query result is null, sql is %s", sqlStr)
		return nil, nil
	}
	println(list.Columns())
	for list.Next() {
		ptr := reflect.New(reflect.TypeOf(model).Elem()).Interface()
		err = ormModel.Scan(list, ptr)
		if err != nil {
			xlog.Errorf("Scan result list from row to interface failed!Err : %v", err)
			return nil, err
		}
		respList = append(respList, ptr)
	}
	return respList, err
}
