package util

import (
	"fmt"
	"git.woa.com/polaris/polaris-go/api"
	"git.woa.com/wego/wego2/xlog"
	"log"
	"sync/atomic"
)

var polarisClient api.ConsumerAPI

func init() {
	log.Printf("Init polarisClient\n")
	cfg := api.NewConfiguration()

	if err := api.ConfigLoggers(fmt.Sprintf("/data/qspace/mms1suitestsvr/log"), api.ErrorLog); nil != err {
		//do error handle
		xlog.Errorf("Init polaris error, err is", err)
	}

	//创建consumerAPI实例
	//注意该实例所有方法都是协程安全，一般用户进程只需要创建一个consumerAPI,重复使用即可
	//切勿每次调用之前都创建一个consumerAPI
	//设置直接埋点地址与设置jointPoint不能同时生效
	var err error
	polarisClient, err = api.NewConsumerAPIByConfig(cfg)
	if nil != err {
		xlog.Errorf("Init Es error, error is %v", err)
	}
}

func GetPolarisIpPort() (string, error) {
	service := "979393:196608"
	namespace := "Production"
	consumer := polarisClient
	var flowId uint64
	var getInstancesReq *api.GetOneInstanceRequest
	getInstancesReq = &api.GetOneInstanceRequest{}
	getInstancesReq.FlowID = atomic.AddUint64(&flowId, 1)
	getInstancesReq.Namespace = namespace
	getInstancesReq.Service = service
	//进行服务发现，获取单一服务实例
	getInstResp, err := consumer.GetOneInstance(getInstancesReq)
	if nil != err {
		xlog.Errorf("fail to sync GetOneInstance, err is %v", err)
		return "", err
	}
	targetInstance := getInstResp.Instances[0]
	xlog.Debugf("sync instance is id=%s, address=%s:%d\n",
		targetInstance.GetId(), targetInstance.GetHost(), targetInstance.GetPort())
	out := fmt.Sprintf("%s:%d", targetInstance.GetHost(), targetInstance.GetPort())
	return out, nil

}
