package handler

import (
	"fmt"
	"mms1suitestsvr/service"
	"net/http"
)

// todo
func ExecTest(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, service.RunTest())
}
