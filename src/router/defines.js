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
        {
          path: 'teachers',
          name: 'home-teachers',
          icon: 'home',
          label: '名师专栏',
          component: () => import('../views/home/teachers.vue')
        },
        {
          path: 'network',
          name: 'home-network',
          icon: 'home',
          label: '网络相关要求',
          component: () => import('../views/home/network.vue')
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
          redirect: '/manage/index/course',
          component: () => import('../views/course/index.vue'),
          children: [
            {
              path: 'course',
              name: 'manage-index-course',
              icon: 'ios-bell',
              label: '课程信息',
              component: () => import('../views/course/student/index.vue')
            },
            {
              path: 'chapter',
              name: 'manage-index-chapter',
              icon: 'ios-bell',
              label: '课程学习',
              component: () => import('../views/course/student/chapter.vue')
            },
            {
              path: 'lab',
              name: 'manage-index-lab',
              icon: 'ios-bell',
              label: '在线实验',
              component: () => import('../views/course/student/lab.vue')
            },
            {
              path: 'exam',
              name: 'manage-index-exam',
              icon: 'ios-bell',
              label: '实验报告',
              component: () => import('../views/course/student/test.vue')
            },
            {
              path: 'statistics',
              name: 'manage-index-statistics',
              icon: 'ios-bell',
              label: '课程成绩',
              component: () => import('../views/course/student/statistics.vue')
            },
            {
              path: 'studentgrade',
              name: 'manage-index-studentgrade',
              icon: 'ios-bell',
              label: '学生评分',
              component: () => import('../views/course/student/studentgrade.vue')
            },
            {
              path: 'question',
              name: 'manage-index-question',
              icon: 'ios-bell',
              label: '问卷调查',
              component: () => import('../views/course/student/question.vue')
            },
            {
              path: 'discuss',
              name: 'manage-index-discuss',
              icon: 'ios-bell',
              label: '话题讨论',
              component: () => import('../views/course/student/discuss.vue')
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
              path: 'index',
              name: 'manage-course-index',
              icon: 'ios-bell',
              label: '课程设置',
              component: () => import('../views/course/teacher/index.vue')
            },
            {
              path: 'statistics',
              name: 'manage-course-statistics',
              icon: 'ios-bell',
              label: '成绩统计',
              component: () => import('../views/course/teacher/statistics.vue')
            },
            {
              path: 'chapter',
              name: 'manage-course-chapter',
              icon: 'ios-bell',
              label: '章节编辑',
              component: () => import('../views/course/teacher/chapter.vue')
            },
            {
              path: 'device',
              name: 'manage-course-device',
              icon: 'ios-bell',
              label: '实验设备',
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
              path: 'testlib',
              name: 'manage-course-testlib',
              icon: 'ios-bell',
              label: '题库配置',
              component: () => import('../views/course/teacher/testlib.vue')
            },
            {
              path: 'testtemplate',
              name: 'manage-course-testtemplate',
              icon: 'ios-bell',
              label: '报告与问卷配置',
              component: () => import('../views/course/teacher/testtemplate.vue')
            },
            {
              path: 'test',
              name: 'manage-course-test',
              icon: 'ios-bell',
              label: '实验报告评分',
              component: () => import('../views/course/teacher/test.vue')
            },
            {
              path: 'question',
              name: 'manage-course-question',
              icon: 'ios-bell',
              label: '问卷调查结果',
              component: () => import('../views/course/teacher/question.vue')
            },
            {
              path: 'comment',
              name: 'manage-course-comment',
              icon: 'ios-bell',
              label: '课程评价',
              component: () => import('../views/course/teacher/comment.vue')
            },
            {
              path: 'notice',
              name: 'manage-course-notice',
              icon: 'ios-bell',
              label: '公告设置',
              component: () => import('../views/course/teacher/notice.vue')
            },
            {
              path: 'discuss',
              name: 'manage-course-discuss',
              icon: 'ios-bell',
              label: '话题讨论',
              component: () => import('../views/course/teacher/discuss.vue')
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
