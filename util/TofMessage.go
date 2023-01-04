package util

import (
	"bytes"
	"crypto/sha256"
	"encoding/json"
	"fmt"
	"git.woa.com/wego/wego2/config"
	"git.woa.com/wego/wego2/xlog"
	"log"
	"math/rand"
	"mmtestgocommon/define"
	"mmtestgocommon/model"
	"net/http"
	"strconv"
	"time"
)

type TofConfig struct {
	passId string
	token  string
	server string
}

var tofConfig *TofConfig

// GetTofConfig  从配置文件中获取tof配置
func GetTofConfig() (*TofConfig, error) {
	configPath := fmt.Sprintf("/home/qspace/mms1suitestsvr/etc/mms1suitestsvr.conf")
	xlog.Debugf("Read tof config path : %s", configPath)
	c, err := config.Parse(configPath)
	if err != nil {
		return nil, err
	}
	tofConfig := &TofConfig{}
	tofConfig.passId = c.GetString("tof", "passId", "")
	tofConfig.token = c.GetString("tof", "host", "")
	tofConfig.server = c.GetString("tof", "server", "")
	return tofConfig, err
}

func init() {
	configContent, err := GetTofConfig()
	if err != nil {
		log.Println("Get tof conf error, err is", err)
		xlog.Errorf("Get tof conf error!, err is %v", err)
	}
	tofConfig = configContent
}

const API_TOF_SEND_RTX = "/ebus/tof4_msg/api/v1/Message/SendRTXInfo"

func RequestTof(url string, message interface{}) (ret int) {
	paasId := tofConfig.passId   // 应用id
	paasToken := tofConfig.token // 签名密钥
	server := tofConfig.server   // 接入点域名
	path := url                  // 接口path

	params, _ := json.Marshal(message)                // 接口入参
	timestamp := fmt.Sprintf("%d", time.Now().Unix()) // 生成时间戳，注意服务器的时间与标准时间差不能大于180秒
	rand.Seed(time.Now().Unix())
	r := rand.New(rand.NewSource(time.Now().Unix()))
	nonce := strconv.Itoa(r.Intn(4096)) // 随机字符串，十分钟内不重复即可
	signStr := fmt.Sprintf("%s%s%s%s", timestamp, paasToken, nonce, timestamp)
	sign := fmt.Sprintf("%X", sha256.Sum256([]byte(signStr))) // 输出大写的结果
	req, err := http.NewRequest("POST", server+path, bytes.NewReader(params))
	if err != nil {
		fmt.Println(err)
	}

	var httpClient = &http.Client{}
	// 设置鉴权参数
	req.Header.Add("x-rio-paasid", paasId)
	req.Header.Add("x-rio-nonce", nonce)
	req.Header.Add("x-rio-timestamp", timestamp)
	req.Header.Add("x-rio-signature", sign)

	rsp, _ := httpClient.Do(req)

	if err != nil {
		xlog.Errorf("Request tof failed! %v", err)
		return define.E_ITIL_MESSAGE_API_ERR
	}

	respBody := &bytes.Buffer{}
	_, err = respBody.ReadFrom(rsp.Body)
	if err != nil {
		xlog.Errorf("Read from tof response body failed! %v", err)
		return define.E_ITIL_MESSAGE_API_ERR
	}

	rsp.Body.Close()
	xlog.Debugf("Tof response , StatusCode : [%v], Header ; [%v], Body : [%v]\n",
		rsp.StatusCode, rsp.Header, respBody)
	fmt.Printf("Tof response , StatusCode : [%v], Header ; [%v], Body : [%v]\n",
		rsp.StatusCode, rsp.Header, respBody)
	if rsp.StatusCode != 200 {
		xlog.Errorf("Read from tof response not 200!")
		return define.E_ITIL_MESSAGE_API_ERR
	}

	return 0
}

func SendRtx(message model.RtxMessage) (ret int) {
	return RequestTof(API_TOF_SEND_RTX, message)
}
