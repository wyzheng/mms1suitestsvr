package handler

import (
	"fmt"
	"git.woa.com/wego/wego2/xhttp"
	"git.woa.com/wego/wego2/xlog"
	"io/ioutil"
	"mms1suitestsvr/dao"
	"mms1suitestsvr/service"
	"mms1suitestsvr/tools"
	"mmtestgocommon/websvr"
	"net/http"
	"strings"
)

const FileGitCosDir = "s1s_test"

func UploadCase(w http.ResponseWriter, r *http.Request) {
	ww := w.(*xhttp.ResponseWriter)
	resp := websvr.CommResp{}
	xlog.Debugf("[Handler] deal with a request of result.")
	if r.Method != "POST" {
		w.WriteHeader(http.StatusBadRequest)
		xlog.Errorf("Invalid request method")
		return
	}

	file, _, err := r.FormFile("file")
	filePath := websvr.GetStringFromUri(r, "path")
	fileName := strings.Split(filePath, "__tests__/")[1]

	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		xlog.Errorf("Error retrieving file")
		return
	}
	defer file.Close()

	fileBytes, err := ioutil.ReadAll(file)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		xlog.Errorf("Error reading file")
		return
	}

	cases, testFile := tools.GetTestNames(fileBytes, filePath)

	//todo 这里要先删掉然后再存起来？ -- 好像也不行，加个状态？

	_, err = dao.InsertTestCases(cases)
	if err != nil {
		xlog.Errorf("InsertTestCases  error is %v", err)
	}

	// 更新测试文件
	res, err := dao.GetTestFileBySuiteId(*testFile.SuiteId)
	if res != nil {
		err := dao.UpdateTestFileBySuiteId(*testFile.SuiteId, testFile)
		if err != nil {
			xlog.Errorf("Update TestFile  error is %v", err)
		}
	} else {
		_, err = dao.InsertTestFile(testFile)
		if err != nil {
			xlog.Errorf("InsertTestFile  error is %v", err)
		}
	}
	// 更新到cos
	cosKey := fmt.Sprintf("%s/latest/%s", FileGitCosDir, fileName)
	err = service.SetCosFile(cosKey, fileBytes)

	if err != nil {
		xlog.Errorf("[COS] test cases archiving into cos failed, file %v", err)
	}

	ww.MarshalJSON(resp)
	return
}
