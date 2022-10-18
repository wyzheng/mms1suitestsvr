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

var ormTestFile = &orm.OrmOption{Table: TestFileTable}
var TestFileModel, _ = orm.NewOrm(ormTestFile, &model.TestFile{})

var ormTestTask = &orm.OrmOption{Table: TestTaskTable}
var TestTaskModel, _ = orm.NewOrm(ormTestTask, &model.TestTask{})

var ormReleaseRecord = &orm.OrmOption{Table: ReleaseRecordTable}
var ReleaseRecordModel, _ = orm.NewOrm(ormReleaseRecord, &model.ReleaseRecord{})
