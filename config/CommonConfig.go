package config

// 定义若干测试任务状态
var S_NEW_TASK = "NEW_TEST_TASK"

var S_TASK_TESTING = "TASK_TESTING"
var S_TAST_FINISH = "TASK_TEST_FINISHED"

const DefaultReportContent = `<!DOCTYPE html>
				<html lang="en">
				<head>
					<style type="text/css">
						div{
							height: 200px;
							text-align: center; 
							line-height: 200px;
						}
					</style>
				</head>
				<body>
					<div class="box3">报告丢失了...</div>
				</body>
				</html>`
