import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  // {
  //   path: '/register',
  //   component: () => import('@/views/register/register'),
  //   hidden: true
  // },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/pass',
    component: () => import('@/views/password'),
    hidden: true
  },

  {
    path: '',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      // name: '',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '主页',icon: 'tree'}
    }]
  },

  {
    path: '',
    component: Layout,
    redirect: '/task/list',
    name: '任务',
    meta: { title: '任务', icon: 'example' },
    children: [
      {
        path: 'task/list',
        name: '任务列表',
        component: () => import('@/views/task/list'),
        meta: { title: '任务列表', icon: 'table' }
      },
      {
        path: 'task/create',
        name: '创建任务',
        component: () => import('@/views/task/create'),
        meta: { title: '创建任务', icon: 'form' }
      },
      {
        path: 'task/edit/:id',
        name: '修改任务',
        component: () => import('@/views/task/edit'),
        meta: { title: '修改任务', icon: 'el-icon-s-order' },
        hidden:true
      },
      {
				path: "task/view/:id", 
				name: "任务详情",
				meta: { title: "任务详情", icon: "fa fa-list-alt" },
				component: () => import("@/views/task/view"),
				hidden:true
			}
    ]
  },
  {
    path: '/activity',
    component: Layout,
    redirect: '/activity/courselist',
    name: '任课',
    meta: { title: '任课', icon: 'nested' },
    children: [
      {
        path: '/activity/courselist',
        name: '任课列表',
        component: () => import('@/views/activitylist/courselist'),
        meta: { title: '任课列表', icon: 'table' }
      },
      {
        path: '/activity/coursedispatch',
        name: '任课安排',
        component: () => import('@/views/activity/coursedispatch'),
        meta: { title: '任课安排', icon: 'form' }
      },
    ]
  },

  // {
  //   path: 'external-link',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
  //       meta: { title: 'External Link', icon: 'link' }
  //     }
  //   ]
  // },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  mode: 'history', // require service support
  base: '/openedu/admin/',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
