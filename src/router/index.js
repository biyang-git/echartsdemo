import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)//在vue中注入router
//配置路由路径
const routes = [
  {
    path: '/',
    meta: {
      title: 'helloWorld'
    },
    component: () => import('@/components/HelloWorld')
  },
  {
    path: '/linechart01',
    meta: {
      title: 'helloWorld'
    },
    component: () => import('@/components/linechart/linechart01')
  }
]
var router = new Router({
  'mode': 'hash',
  routes
})

export default router;