package dao

import (
	"git.woa.com/wego/wego2/xlog"
	"mms1suitestsvr/config"
	"mms1suitestsvr/model"
	"mmtestgocommon/database"
)

// InsertReleaseRecord 增加一条上线记录
func InsertReleaseRecord(releaseRecord *model.ReleaseRecord) (int, error) {
	xlog.Debug("[DAO]:Insert a release record into db.")

	err, id := database.Insert(
		config.Mms1suitestDB,
		config.ReleaseRecordTable,
		releaseRecord,
	)
	return id, err
}
