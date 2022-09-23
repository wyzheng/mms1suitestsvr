package util

import (
	"git.woa.com/wego/wego2/xlog"
	huge "github.com/dablelv/go-huge-util"
)

// 解压文件

func UnzipFile(source string, dest string) error {
	err := huge.Unzip(source, dest)
	if err != nil {
		xlog.Errorf("[utils] Unzip file error, err is %v", err)
	}
	return err
}
