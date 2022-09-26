package config

import (
	"fmt"
	"git.woa.com/wego/wego2/config"
	"git.woa.com/wego/wego2/xlog"
)

type CosConfig struct {
	Url       string
	Host      string
	SecretID  string
	SecretKey string
}

func GetCosConfig() (*CosConfig, error) {
	configPath := fmt.Sprintf("/home/qspace/mms1suitestsvr/etc/mms1suitestsvr.conf")
	xlog.Debugf("Read cos config path : %s", configPath)
	c, err := config.Parse(configPath)
	if err != nil {
		return nil, err
	}
	CosConfig := &CosConfig{}
	CosConfig.Url = c.GetString("cos", "url", "")
	CosConfig.Host = c.GetString("cos", "host", "")
	CosConfig.SecretID = c.GetString("cos", "sid", "")
	CosConfig.SecretKey = c.GetString("cos", "skey", "")

	return CosConfig, err
}
