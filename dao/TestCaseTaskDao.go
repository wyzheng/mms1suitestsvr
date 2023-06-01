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

// InsertTestCaseTasks 增加测试用例粒度的测试结果
func InsertTestCaseTasks(testCaseTask *model.TestCaseTask) (int, error) {
	xlog.Debug("[DAO]:Insert a test case task into db.")

	err, id := database.Insert(
		config.Mms1suitestDB,
		config.TestCaseTaskTable,
		testCaseTask,
	)

	return id, err
}

func GetTaskDetailsByTestId(testId int, suiteId string) ([]*model.TestResCaseWeb, error) {
	xlog.Debugf("[DAO]:Get test case task from db by %s.", testId)

	conditions := make(map[string]interface{})
	conditions["test_id"] = testId
	conditions["suite_id"] = suiteId

	list, err := JoinQuery(
		config.Mms1suitestDB,
		config.TestCaseTaskTable,
		conditions,
		&model.TestResCaseWeb{})

	if len(list) == 0 {
		return nil, errors.New("no test case task of this id")
	}
	var dataList []*model.TestResCaseWeb
	for _, item := range list {
		snap := &model.TestResCaseWeb{}
		snap = item.(*model.TestResCaseWeb)
		dataList = append(dataList, snap)
	}
	return dataList, err
}

func JoinQuery(db *sql.DB, table string, conditions map[string]interface{}, model interface{}) ([]interface{}, error) {

	ormOption := &orm.OrmOption{Table: table}
	ormModel, err := orm.NewOrm(ormOption, model)
	if err != nil {
		xlog.Errorf("Update database failed! Err : %v", err)
		return nil, err
	}

	sqlStr := "select A.*, B.*  from test_task_case as A join test_cases as B on A.case_id = B.case_id where "
	flag := false
	if conditions != nil {
		for condition := range conditions {
			value := conditions[condition]
			xlog.Debugf(" condition == limit: %v, condition: %v ", condition == "limit", condition)
			if condition != "limit" {
				if "string" == reflect.TypeOf(conditions[condition]).Name() {
					value = fmt.Sprintf("'%s'", value)
				}
				if flag {
					sqlStr = fmt.Sprintf("%s AND %s=%v", sqlStr, condition, value)
				} else {
					sqlStr = fmt.Sprintf("%s %s=%v", sqlStr, condition, value)
					flag = true
				}
			}

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
