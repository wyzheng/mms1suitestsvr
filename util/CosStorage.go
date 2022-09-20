package util

import (
	"context"
	"fmt"
	"git.woa.com/wego/wego2/xlog"
	"github.com/tencentyun/cos-go-sdk-v5"
	"io"
	"log"
	"mms1suitestsvr/config"
	"net/http"
	"net/url"
	"strings"
)

var cosConfig *config.CosConfig

func init() {
	configContent, err := config.GetCosConfig()
	if err != nil {
		log.Println("Get es conf error, err is", err)
		xlog.Errorf("Get es conf error!, err is %v", err)
	}
	cosConfig = configContent
}

func GetFileFromCos(keyName string, localFilePath string) error {
	out, err := GetPolarisIpPort()
	if err != nil {
		xlog.Errorf("[GetFileFromCos]GetPolarisIpPort error, error is %v", err)
		return err
	}
	urlProxy := fmt.Sprintf("http://%s", out)
	xlog.Debugf("GetPolarisIpPort is %s", urlProxy)

	u, _ := url.Parse(urlProxy) // 设置IP和PORT
	b := &cos.BaseURL{
		BucketURL: u,
	}
	client := cos.NewClient(b, &http.Client{
		Transport: &cos.AuthorizationTransport{
			SecretID:  cosConfig.SecretID,
			SecretKey: cosConfig.SecretKey,
		},
	})
	client.Host = cosConfig.Host // 设置HOST
	resp, err := client.Object.Get(context.Background(), keyName, nil)
	if err != nil {
		xlog.Errorf("get cos client error, error is %v", err)
	}
	_, err = io.ReadAll(resp.Body)
	if err != nil {
		xlog.Errorf("get cos file error, error is %v", err)
	}
	resp.Body.Close()
	_, err = client.Object.GetToFile(context.Background(), keyName, localFilePath, nil)
	if err != nil {
		xlog.Errorf("get cos file error, error is %v", err)
	}
	return err
}

func GetFileFromCosByKey(keyName string) ([]byte, error) {
	out, err := GetPolarisIpPort()
	if err != nil {
		xlog.Errorf("[GetFileFromCos]GetPolarisIpPort error, error is %v", err)
		return nil, err
	}
	urlProxy := fmt.Sprintf("http://%s", out)
	xlog.Debugf("GetPolarisIpPort is %s", urlProxy)

	u, _ := url.Parse(urlProxy) // 设置IP和PORT
	b := &cos.BaseURL{
		BucketURL: u,
	}
	client := cos.NewClient(b, &http.Client{
		Transport: &cos.AuthorizationTransport{
			SecretID:  cosConfig.SecretID,
			SecretKey: cosConfig.SecretKey,
		},
	})
	client.Host = cosConfig.Host // 设置HOST
	resp, err := client.Object.Get(context.Background(), keyName, nil)
	if err != nil {
		xlog.Errorf("get cos client error, error is %v", err)
		return nil, err
	}

	respStr, err := io.ReadAll(resp.Body)

	defer resp.Body.Close()

	return respStr, err
}

func SetInCos(key string, contextStr []byte) error {
	out, err := GetPolarisIpPort()
	if err != nil {
		xlog.Errorf("[GetFileFromCos]GetPolarisIpPort error, error is %v", err)
		return err
	}
	urlProxy := fmt.Sprintf("http://%s", out)
	xlog.Debugf("GetPolarisIpPort is %s", urlProxy)

	u, _ := url.Parse(urlProxy) // 设置IP和PORT
	b := &cos.BaseURL{
		BucketURL: u,
	}
	client := cos.NewClient(b, &http.Client{
		Transport: &cos.AuthorizationTransport{
			SecretID:  cosConfig.SecretID,
			SecretKey: cosConfig.SecretKey,
		},
	})
	client.Host = cosConfig.Host // 设置HOST
	// 通过字符串上传对象
	f := strings.NewReader(string(contextStr))

	_, err = client.Object.Put(context.Background(), key, f, nil)
	if err != nil {
		xlog.Errorf("SetInCos error, err is %v", err)
		return err
	}
	return nil
}
