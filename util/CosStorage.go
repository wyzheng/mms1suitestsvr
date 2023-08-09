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
	"os"
	"path"
	"strings"
	"sync"
)

var cosConfig *config.CosConfig

func init() {
	configContent, err := config.GetCosConfig()
	if err != nil {
		log.Println("Get cos conf error, err is", err)
		xlog.Errorf("Get cos conf error!, err is %v", err)
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

func download(wg *sync.WaitGroup, c *cos.Client, keysCh <-chan []string) {
	defer wg.Done()
	for keys := range keysCh {
		key := keys[0]
		filename := keys[1]
		_, err := c.Object.GetToFile(context.Background(), key, filename, nil)
		if err != nil {
			fmt.Println(err)
		}
	}
}

// BatchDownloadFromCos 批量下载文件 prefix 不需要右边的斜杠，localDir需要右面的斜杠
func BatchDownloadFromCos(prefix string, localDir string) error {
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

	// 多线程执行
	keysCh := make(chan []string, 3)
	var wg sync.WaitGroup
	threadpool := 3
	for i := 0; i < threadpool; i++ {
		wg.Add(1)
		go download(&wg, client, keysCh)
	}
	isTruncated := true
	marker := ""
	for isTruncated {
		opt := &cos.BucketGetOptions{
			Prefix:       prefix,
			Marker:       marker,
			EncodingType: "url", // url 编码
		}
		// 列出目录
		v, _, err := client.Bucket.Get(context.Background(), opt)
		if err != nil {
			fmt.Println(err)
			break
		}
		for _, c := range v.Contents {
			key, _ := cos.DecodeURIComponent(c.Key) //EncodingType: "url"，先对 key 进行 url decode
			fileKey := strings.ReplaceAll(key, "s1s_test/latest", "")
			fmt.Printf(fileKey)
			localFile := ""
			if key[0] == '/' {
				localFile = localDir + fileKey
			} else {
				localFile = localDir + "/" + fileKey
			}
			if _, err := os.Stat(path.Dir(localFile)); err != nil && os.IsNotExist(err) {
				os.MkdirAll(path.Dir(localFile), os.ModePerm)
			}
			// 以/结尾的key（目录文件）不需要下载
			if strings.HasSuffix(localFile, "/") {
				continue
			}
			keysCh <- []string{key, localFile}
		}
		marker, _ = cos.DecodeURIComponent(v.NextMarker) // EncodingType: "url"，先对 NextMarker 进行 url decode
		isTruncated = v.IsTruncated
	}
	close(keysCh)
	wg.Wait()

	return nil
}
