package main

import (
	"fmt"
	"git.woa.com/wego/wego2/xhttp"
	"git.woa.com/wego/wego2/xlog"
	"git.woa.com/wego/wxg/whttp"
	"log"
	"mms1suitestsvr/handler"
	"mmtestgocommon/websvr"
	"net/http"
	"os"
	"time"
)

func main() {

	OssAttrID := 19674

	balancer := (&whttp.BalancerBuilder{
		OssAttrID: OssAttrID,
		MaxConn:   0,
		MaxQueue:  0,
	}).Build()

	tracer := (&whttp.TracerBuilder{
		OssAttrID: OssAttrID,
	}).Build()

	hb := &whttp.HandlerBuilder{
		Tracer: tracer,
	}

	mux := &xhttp.ServePrefixMux{
		Tracer: tracer,
	}

	websvr.AddCgi(websvr.Cgi{
		HandBuild: hb,
		Mux:       mux,
		CgiHandle: http.HandlerFunc(handler.ExecTest),
		CmdId:     1,
		CgiName:   "ExecTest",
		Pattern:   "/cgi/ExecTest",
	})

	websvr.AddCgi(websvr.Cgi{
		HandBuild: hb,
		Mux:       mux,
		CgiHandle: http.HandlerFunc(handler.CaseArchive),
		CmdId:     2,
		CgiName:   "CaseArchive",
		Pattern:   "/cgi/CaseArchive",
	})

	websvr.AddCgi(websvr.Cgi{
		HandBuild: hb,
		Mux:       mux,
		CgiHandle: http.HandlerFunc(handler.GetTestTask),
		CmdId:     3,
		CgiName:   "GetTestTask",
		Pattern:   "/cgi/GetTestTask",
	})
	websvr.AddCgi(websvr.Cgi{
		HandBuild: hb,
		Mux:       mux,
		CgiHandle: http.HandlerFunc(handler.GetTestTaskReport),
		CmdId:     4,
		CgiName:   "GetTestTaskReport",
		Pattern:   "/cgi/GetTestTaskReport",
	})
	websvr.AddCgi(websvr.Cgi{
		HandBuild: hb,
		Mux:       mux,
		CgiHandle: http.HandlerFunc(handler.GetTestCases),
		CmdId:     4,
		CgiName:   "GetTestCases",
		Pattern:   "/cgi/GetTestCases",
	})

	// init svr
	svr := &xhttp.Server{
		Server: http.Server{
			//临时端口号，上线后按正式分配到的端口填
			Addr:    ":19674",
			Handler: mux,

			ReadHeaderTimeout: 2 * time.Second,
			WriteTimeout:      10 * time.Second,
			IdleTimeout:       60 * time.Second,
		},
		Balancer: balancer,
		Tracer:   tracer,
	}

	output := &xlog.HourSplitFileWriter{
		OutputDir:  "/home/qspace/mms1suitestsvr/log",
		NamePrefix: "mms1suitestsvr",
		NameSuffix: ".log",

		MaxSizePerFile: 1024 * 1024 * 1024,

		UseBufio: false,
	}

	e := output.Init()
	log.Printf("output Init %v\n", e)
	defer output.Close() // if use UseBufio, flush on exit

	logger := xlog.NewColorLogger(output, xlog.Ldebug, xlog.Ldate|xlog.Ltime|xlog.Lshortfile|xlog.Lcolor)
	xlog.SetLogger(logger) // set default logger to colorLogger
	xlog.SetLevel(xlog.Ldebug)

	// also set output to log package.
	log.SetFlags(log.Ldate | log.Ltime | log.Lshortfile)
	log.SetOutput(output)

	fmt.Fprintf(os.Stderr,
		"****************************\nStart epheimdallchecksvr!\n****************************\n")
	log.Fatal(svr.ListenAndServe())
	fmt.Printf(
		"****************************\nStop epheimdallchecksvr!\n****************************\n")
}
