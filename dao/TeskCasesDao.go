package dao

import (
	"git.woa.com/wego/wego2/xlog"
	"mms1suitestsvr/config"
	"mms1suitestsvr/model"
	"mmtestgocommon/database"
)

// InsertTestCases 增加测试用例
func InsertTestCases(testCases []*model.TestCases) (int, error) {
	xlog.Debug("[DAO]:Insert a test file into db.")
	id := 0
	for _, testCase := range testCases {
		_, id = database.Insert(
			config.Mms1suitestDB,
			config.TestCaseTale,
			testCase,
		)
	}

	return id, nil
}
