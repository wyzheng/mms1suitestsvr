package service

import (
	"bytes"
	"encoding/json"
	"fmt"
	"git.woa.com/wego/wego2/config"
	"git.woa.com/wego/wego2/xlog"
	"math/rand"
	"net/http"
	"strings"
)

// GetIpPort 获取ip和端口地址
func GetIpPort(module string) []string {
	var ipList [][]string
	env := []string{"shanghai", "shenzhen", "hk", "camel"}
	for _, v := range env {
		c, err := config.Parse(fmt.Sprintf(`/home/qspace/etc/route/%v/%v_route.conf`, v, module))
		//println(v)
		//c, err := config.Parse(fmt.Sprintf(`./config.conf`))
		if err != nil {
			xlog.Errorf(fmt.Sprintf("%v", err))
			continue
		}
		values := c.GetValues()
		for key, _ := range values {
			if strings.Index(key, "server") != -1 {
				conf, _ := c.GetSection(key)
				for k1, _ := range conf {
					if k1 == "ip" {
						item := []string{c.GetString(key, k1, ""), c.GetString(key, "port", "0")}
						ipList = append(ipList, item)
					} else if k1 == "svr_ip" {
						item := []string{c.GetString(key, "svr_ip", "0"), c.GetString(key, "svr_port", "0")}
						ipList = append(ipList, item)
					}
				}
			}
		}
	}
	return ipList[rand.Intn(1000)%len(ipList)]
}

func GetUrl(module string, funcName string) string {
	server := GetIpPort(module)
	xlog.Debugf(`http://%v:%v/%v`, server[0], server[1], funcName)
	if server[0] != "0" && server[1] != "0" {
		return fmt.Sprintf(`http://%v:%v/%v`, server[0], server[1], funcName)
	}
	return ""
}

func MMSearch(data interface{}, url string) *bytes.Buffer {
	uin := "3192443972"
	messageBytes, err := json.Marshal(data)
	if err != nil {
		xlog.Errorf("Umarshal message struct failed! %v", err)
	}

	xlog.Debugf("%v", data)

	reader := bytes.NewReader(messageBytes)
	request, err := http.NewRequest("POST", url, reader)
	if err != nil {
		xlog.Errorf("Make tof http request failed! %v", err)
	}
	request.Header.Set("Content-Type", "application/json")
	request.Header.Set("Accept", "*/*")
	request.Header.Set("Cookie", fmt.Sprintf(`uin=%v;uid=%v`, uin, uin))

	client := &http.Client{}

	resp, err := client.Do(request)

	if err != nil {
		xlog.Errorf("Request failed! %v", err)
	}

	respBody := &bytes.Buffer{}
	_, err = respBody.ReadFrom(resp.Body)
	if err != nil {
		xlog.Errorf("Read from tof response body failed! %v", err)
	}

	resp.Body.Close()

	if resp.StatusCode == 200 {
		return respBody
	} else {
		return nil
	}
}
