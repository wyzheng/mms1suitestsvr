import Vue from 'vue'
import Router from 'vue-router'
import TestCases from '@/components/views/TestCases'
import TestTask from '@/components/views/TestTask'
import ReportDetail from '@/components/views/ReportDetail'
Vue.use(Router)

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
  ]
})
