package tools

import (
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

	module := ""

	for i := index + 1; i < len(pref); i++ {
		module += pref[i] + "."
	}
	// 提取所有的测试用例对象
	var testCases []*model.TestCases
	for _, match := range matches0 {
		if len(match) >= 2 {
			caseId := module + string(match[2])
			desc := string(match[1])
			var testcase = model.TestCases{
				CaseId:      &caseId,
				Owner:       &author,
				SuiteDesc:   &suiteDesc,
				Description: &desc,
				CreateTime:  &cTime,
			}
			testCases = append(testCases, &testcase)
		}
	}
	var testFile model.TestFile
	testFile.FileName = &strings.Split(filepath, "__tests__/")[1]
	testFile.Owner = &author
	testFile.UpdateTime = &cTime

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
