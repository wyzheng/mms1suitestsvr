package tools

import (
	"bytes"
	"mms1suitestsvr/model"
	"regexp"
	"strings"
	"time"
)

// 使用正则表达式匹配所有的测试用例名称
func GetTestNames(content []byte, filepath string) ([]*model.TestCases, *model.TestFile) {
	cTime := time.Now().Format("2006-01-02 15:04:05")

	//descPatterns := []string{`\/\/@owner:(.*?)\s+\/\/@description:(.*?)\s+describe\("(.*?)",`, `\/\/@owner:(.*?)\s+describe\("(.*?)",`, `\/\/@description:(.*?)\s+describe\("(.*?)",`, `describe\("(.*?)",`}
	patternDesc := `\/\/@owner:(.*?)\s+\/\/@description:(.*?)\s+describe\("(.*?)",`
	reDesc := regexp.MustCompile(patternDesc)
	matchesDesc := reDesc.FindAllSubmatch([]byte(content), -1)
	println(len(matchesDesc))

	author := ""
	suiteDesc := ""
	for _, match := range matchesDesc {
		if len(match) >= 2 {
			author = string(match[1])
			suiteDesc = string(match[2])
		}
	}

	patternTest := `\/\/@description:(.*?)\s+test\("(.*?)",`
	reo := regexp.MustCompile(patternTest)
	matches0 := reo.FindAllSubmatch([]byte(content), -1)
	println(len(matches0))

	pref := strings.Split(filepath, "/")
	pref[len(pref)-1] = strings.Split(pref[len(pref)-1], ".")[0]
	ai := make([]interface{}, len(pref))
	for i, v := range pref {
		ai[i] = v
	}
	index := indexOf(pref, "__tests__")
	println(index)

	//包名
	module := ""
	for i := index + 1; i < len(pref); i++ {
		module += pref[i] + "."
	}
	suiteId := module[:len(module)-1]

	// 提取所有的测试用例对象
	var testCases []*model.TestCases
	for _, match := range matches0 {
		if len(match) >= 2 {
			caseId := module + string(match[2])
			desc := string(match[1])

			// 起始行号
			startLine := GetLine(content, match[2])
			var testcase = model.TestCases{
				CaseId:      &caseId,
				Owner:       &author,
				SuiteDesc:   &suiteDesc,
				Description: &desc,
				CreateTime:  &cTime,
				StartLine:   &startLine,
				SuiteId:     &suiteId,
			}
			testCases = append(testCases, &testcase)
		}
	}
	var testFile model.TestFile
	testFile.FileName = &strings.Split(filepath, "__tests__/")[1]
	testFile.Owner = &author
	testFile.UpdateTime = &cTime
	testFile.SuiteDesc = &suiteDesc
	testFile.SuiteId = &suiteId

	return testCases, &testFile
}

func indexOf(a []string, e string) int {
	n := len(a)
	var i = 0
	for ; i < n; i++ {
		if strings.Compare(a[i], e) == 0 {
			return i
		}
	}
	return -1
}

// GetLine 获取函数名在文件中的行号
func GetLine(content []byte, target []byte) int {
	subSlices := bytes.Split(content, target)
	startLine := 1
	for i := 0; i < len(subSlices)-1; i++ {
		startLine += bytes.Count(subSlices[i], []byte("\n"))
	}
	return startLine
}
