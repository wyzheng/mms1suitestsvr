package service

import (
	"git.woa.com/wego/wego2/xlog"
	"mms1suitestsvr/util"
	"path/filepath"
)

// GetCosFile 根据 cosKey 从 cos 中获取文件
func GetCosFile(cosKey string) ([]byte, error) {
	xlog.Debugf("GetCosFile cosKey is %s", cosKey)
	byteContext, err := util.GetFileFromCosByKey(cosKey)
	if err != nil {
		return nil, err
	}
	return byteContext, nil
}

// SetCosFile 保存文件到cos
func SetCosFile(cosKey string, fileContent []byte) error {
	xlog.Debugf("Set file into COS, cosKey is %s", cosKey)
	return util.SetInCos(cosKey, fileContent)
}

// DownloadCosFile 从cos中下载文件到指定位置
func DownloadCosFile(cosKey string, fileName string) error {
	xlog.Debugf("get file which cosKey is %s, into %s", cosKey, fileName)
	//判断文件夹是否存在，如果没有就新建
	paths, _ := filepath.Split(fileName)
	if !util.IsDirExist(paths) {
		err := util.CreateDirIfNotExist(paths)
		if err != nil {
			xlog.Errorf("mkdir %s failed, err is %s", paths, err)
		}
	}
	return util.GetFileFromCos(cosKey, fileName)
}
