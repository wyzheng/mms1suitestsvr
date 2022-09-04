package handler

import (
	"bytes"
	"fmt"
	"log"
	"net/http"
	"os/exec"
)

func ExecTest(w http.ResponseWriter, r *http.Request) {
	cmd := exec.Command("bash", "-c", "npm run test")
	cmd.Dir = "./jest-puppeteer-ui-test"
	var stdout bytes.Buffer
	var stderr bytes.Buffer
	var err error

	cmd.Stdout = &stdout
	cmd.Stderr = &stderr

	if err = cmd.Run(); err != nil {
		log.Println(err)
	}

	fmt.Print(stdout.String())
	fmt.Print(stderr.String())
	fmt.Fprintf(w, stdout.String())
}
