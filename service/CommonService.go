package service

import (
	"git.woa.com/wego/wego2/xlog"
	"mms1suitestsvr/util"
)

func GetCosFile(cosKey string) ([]byte, error) {
	xlog.Debugf("GetCosFile cosKey is %s", cosKey)
	byteContext, err := util.GetFileFromCosByKey(cosKey)
	if err != nil {
		xlog.Errorf("GetFileFromCos error, err is %v", err)
		return nil, err
	}
	return byteContext, nil
}

func SetCosFile(cosKey string, fileContent []byte) error {
	xlog.Debugf("Set file into COS, cosKey is %s", cosKey)
	return util.SetInCos(cosKey, fileContent)
}

func DownloadCosFile(cosKey string, fileName string) error {
	xlog.Debugf("get file which cosKey is %s, into %s", cosKey, fileName)
	return util.GetFileFromCos(cosKey, fileName)
}
