//需要权限验证的路由
export const appRouter = {
  path: '/',
  name: 'root',
  component: () => import('../views/index.vue'),
  redirect: '/home',
  meta: {
    menuShow: false
  },
  children: [
    {
      path: 'home',
      name: 'home',
      icon: 'home',
      label: '学生',
      redirect: '/home/index',
      component: () => import('../views/main.vue'),
      children: [
        {
          path: 'index',
          name: 'home-index',
          icon: 'ios-bell',
          label: '首页',
          component: () => import('../views/home/index.vue')
        },
        {
          path: 'course',
          name: 'home-course',
          icon: 'home',
          label: '课程',
          component: () => import('../views/course/detail.vue')
        },
        {
          path: 'search',
          name: 'home-search',
          icon: 'home',
          label: '搜索',
          component: () => import('../views/home/search.vue')
        },
        {
          path: 'subject',
          name: 'home-subject',
          icon: 'home',
          label: '话题',
          component: () => import('../views/course/subject.vue')
        },
      ]
    },
    {
      path: 'manage',
      name: 'manage',
      icon: 'home',
      label: '管理中心',
      redirect: '/manage/index',
      component: () => import('../views/manage.vue'),
      children: [
        {
          path: 'index',
          name: 'manage-index',
          icon: 'ios-bell',
          label: '课程首页',
          redirect: '/manage/index/notice',
          component: () => import('../views/course/index.vue'),
          children: [
            {
              path: 'notice',
              name: 'manage-index-notice',
              icon: 'ios-bell',
              label: '课程公告',
              component: () => import('../views/course/notice.vue')
            },
            {
              path: 'standard',
              name: 'manage-index-standard',
              icon: 'ios-bell',
              label: '评分标准',
              component: () => import('../views/course/standard.vue')
            },
            {
              path: 'chapter',
              name: 'manage-index-chapter',
              icon: 'ios-bell',
              label: '课程学习',
              component: () => import('../views/course/chapter.vue')
            },
            {
              path: 'lab',
              name: 'manage-index-lab',
              icon: 'ios-bell',
              label: '在线实验',
              component: () => import('../views/course/lab.vue')
            },
            {
              path: 'exam',
              name: 'manage-index-exam',
              icon: 'ios-bell',
              label: '实验报告',
              component: () => import('../views/course/test.vue')
            },
            {
              path: 'discuss',
              name: 'manage-index-discuss',
              icon: 'ios-bell',
              label: '讨论区',
              component: () => import('../views/course/discuss.vue')
            },
          ]
        },
        {
          path: 'system',
          name: 'manage-system',
          icon: 'ios-bell',
          label: '系统维护',
          redirect: '/manage/system/course',
          component: () => import('../views/system/index.vue'),
          children: [
            {
              path: 'course',
              name: 'manage-system-course',
              icon: 'ios-bell',
              label: '课程管理',
              component: () => import('../views/centerteacher/list.vue')
            },
            {
              path: 'user',
              name: 'manage-system-user',
              icon: 'ios-bell',
              label: '用户管理',
              component: () => import('../views/system/user.vue')
            },
            {
              path: 'device',
              name: 'manage-system-device',
              icon: 'ios-bell',
              label: '设备管理',
              component: () => import('../views/system/device.vue')
            },
            {
              path: 'camera',
              name: 'manage-system-camera',
              icon: 'ios-bell',
              label: '摄像头管理',
              component: () => import('../views/system/camera.vue')
            },
            {
              path: 'srs',
              name: 'manage-system-srs',
              icon: 'ios-bell',
              label: 'srs管理',
              component: () => import('../views/system/srs.vue')
            },
            {
              path: 'picture',
              name: 'manage-system-picture',
              icon: 'ios-bell',
              label: '图片管理',
              component: () => import('../views/system/picture.vue')
            },
            {
              path: 'setting',
              name: 'manage-system-setting',
              icon: 'ios-bell',
              label: '系统设置',
              component: () => import('../views/system/setting.vue')
            }
          ]
        },
        {
          path: 'center',
          name: 'manage-center',
          icon: 'ios-bell',
          label: '个人中心',
          redirect: '/manage/center/list',
          component: () => import('../views/center/sindex.vue'),
          children: [
            {
              path: 'list',
              name: 'manage-center-list',
              icon: 'ios-bell',
              label: '学习记录',
              component: () => import('../views/centerstudent/list.vue')
            },
            {
              path: 'device',
              name: 'manage-center-device',
              icon: 'ios-bell',
              label: '我的预约',
              component: () => import('../views/centerstudent/device.vue')
            },
            {
              path: 'test',
              name: 'manage-center-test',
              icon: 'ios-bell',
              label: '作业与测验',
              component: () => import('../views/centerstudent/test.vue')
            },
            {
              path: 'reply',
              name: 'manage-center-reply',
              icon: 'ios-bell',
              label: '话题回复',
              component: () => import('../views/centerstudent/reply.vue')
            },
            {
              path: 'info',
              name: 'manage-center-info',
              icon: 'ios-bell',
              label: '个人信息',
              component: () => import('../views/center/info.vue')
            }
          ]
        },
        {
          path: 'config',
          name: 'manage-config',
          icon: 'ios-bell',
          label: '个人中心(老师)',
          redirect: '/manage/config/list',
          component: () => import('../views/center/tindex.vue'),
          children: [
            {
              path: 'list',
              name: 'manage-config-list',
              icon: 'ios-bell',
              label: '课程管理',
              component: () => import('../views/centerteacher/list.vue')
            },
            {
              path: 'reply',
              name: 'manage-config-reply',
              icon: 'ios-bell',
              label: '话题回复',
              component: () => import('../views/centerstudent/reply.vue')
            },
            {
              path: 'statistics',
              name: 'manage-config-statistics',
              icon: 'ios-bell',
              label: '数据统计',
              component: () => import('../views/centerteacher/statistics.vue')
            },
            {
              path: 'info',
              name: 'manage-config-info',
              icon: 'ios-bell',
              label: '个人信息',
              component: () => import('../views/center/info.vue')
            }
          ]
        },
        {
          path: 'guest',
          name: 'manage-guest',
          icon: 'ios-bell',
          label: '个人中心',
          component: () => import('../views/centerstudent/list.vue')
        },
        {
          path: 'course',
          name: 'manage-course',
          icon: 'ios-bell',
          label: '课程中心',
          redirect: '/manage/course/index',
          component: () => import('../views/centerteacher/index.vue'),
          children: [
            {
              path: 'notice',
              name: 'manage-course-notice',
              icon: 'ios-bell',
              label: '公告',
              component: () => import('../views/centerteacher/notice.vue')
            },
            {
              path: 'index',
              name: 'manage-course-index',
              icon: 'ios-bell',
              label: '章节',
              component: () => import('../views/centerteacher/course.vue')
            },
            {
              path: 'device',
              name: 'manage-course-device',
              icon: 'ios-bell',
              label: '设备',
              component: () => import('../views/centerteacher/device.vue')
            },
            {
              path: 'simulation',
              name: 'manage-course-simulation',
              icon: 'ios-bell',
              label: '仿真实验',
              component: () => import('../views/centerteacher/simulation.vue')
            },
            {
              path: 'test',
              name: 'manage-course-test',
              icon: 'ios-bell',
              label: '作业与测验',
              component: () => import('../views/centerteacher/test.vue')
            },
            {
              path: 'discuss',
              name: 'manage-course-discuss',
              icon: 'ios-bell',
              label: '讨论区',
              component: () => import('../views/centerteacher/discuss.vue')
            }
          ]
        }
      ]
    }
  ]
}

//不需要权限验证的通用路由
export const commonRouters = [
  // {
  //   path: '/home',
  //   name: 'home',
  //   label: '登录',
  //   component: () => import('../views/main.vue')
  // },
  {
    path: '/login',
    name: 'login',
    label: '登录',
    component: () => import('../views/login')
  },
  {
    path: '/register',
    name: 'register',
    label: '注册',
    component: () => import('../views/login/register.vue')
  },
  {
    path: '/403',
    name: 'error-403',
    label: '403权限不足',
    component: () => import('../views/error/403.vue')
  },
  {
    path: '/500',
    name: 'error-500',
    label: '500-服务端错误',
    component: () => import('../views/error/500.vue')
  },
  {
    path: '/*',
    name: 'error-404',
    label: '404-页面不存在',
    component: () => import('../views/error/404.vue')
  },
]

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
  appRouter,
  ...commonRouters,
];
