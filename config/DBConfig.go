package config

import (
	"git.woa.com/wego/wego2/database/orm"
	"mms1suitestsvr/model"
	"mmtestgocommon/database"
)

var Mms1suitestDB = database.InitDataBaseMysql("/home/qspace/mms1suitestsvr/etc/mms1suitestsvr.conf")

var TestFileTable = "test_file"
var TestTaskTable = "test_task"
var ReleaseRecordTable = "release_record"

var TestCaseTale = "test_cases"
var TestCaseTaskTable = "test_task_case"
var TestTaskNewTable = "test_task_new"

var ormTestFile = &orm.OrmOption{Table: TestFileTable}
var TestFileModel, _ = orm.NewOrm(ormTestFile, &model.TestFile{})

var ormTestTask = &orm.OrmOption{Table: TestTaskTable}
var TestTaskModel, _ = orm.NewOrm(ormTestTask, &model.TestTask{})

var ormReleaseRecord = &orm.OrmOption{Table: ReleaseRecordTable}
var ReleaseRecordModel, _ = orm.NewOrm(ormReleaseRecord, &model.ReleaseRecord{})

var ormTestCase = &orm.OrmOption{Table: TestCaseTale}
var TestCaseModel, _ = orm.NewOrm(ormTestCase, &[]model.TestCases{})

var ormTestCaseTask = &orm.OrmOption{Table: TestCaseTaskTable}
var TestCaseTaskModel, _ = orm.NewOrm(ormTestCaseTask, &model.TestCaseTask{})

var ormTestTaskNew = &orm.OrmOption{Table: TestTaskNewTable}
var TestTaskNewModel, _ = orm.NewOrm(ormTestTaskNew, &model.TestTaskNew{})
