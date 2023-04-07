package handler

import (
	"git.woa.com/wego/wego2/xhttp"
	"git.woa.com/wego/wego2/xlog"
	"io/ioutil"
	"mms1suitestsvr/dao"
	"mms1suitestsvr/tools"
	"mmtestgocommon/websvr"
	"net/http"
)

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
	_, err = dao.InsertTestCases(cases)
	if err != nil {
		xlog.Errorf("InsertTestCases  error is %v", err)
	}
	_, err = dao.InsertTestFile(testFile)
	if err != nil {
		xlog.Errorf("InsertTestFile  error is %v", err)
	}

	ww.MarshalJSON(resp)
	return
}
