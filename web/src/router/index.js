import Vue from 'vue';
import Router from 'vue-router';
import TestCases from '@/components/views/TestCases';
import TestTask from '@/components/views/TestTask';
import ReportDetail from '@/components/views/ReportDetail';
import UITestResult from "../components/views/result/UITestResult";
import InterfaceTestResult from "../components/views/result/InterfaceTestResult";
import DialTestResult from "../components/views/result/DialTestResult";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/testCases',
      name: 'TestCases',
      component: TestCases
    },
    {
      path: '/testTask',
      name: 'TestTask',
      component: TestTask
    },
    {
      path: '/reportDetail',
      name: 'ReportDetail',
      component: ReportDetail
    },
    {
      path: '/res/uiTestResult',
      name: 'UITestResult',
      component: UITestResult
    },
    {
      path: '/res/interfaceTestResult',
      name: 'InterfaceTestResult',
      component: InterfaceTestResult
    },
    {
      path: '/res/dialTestResult',
      name: 'DialTestResult',
      component: DialTestResult
    }
  ]
});
