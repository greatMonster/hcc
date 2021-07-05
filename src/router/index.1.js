import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [

  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: 'dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: {
        title: '首页',
        icon: 'dashboard'
      }
    }]
  },
  {
    path: '/dispatching',
    component: Layout,
    redirect: 'dispatching/index',
    alwaysShow: true,
    name: 'dispatching',
    meta: {
      title: '实时管理',
      icon: 'star'
    },
    children: [{
      path: 'dispatching',
      component: () => import('@/views/dispatching/index'),
      name: 'Dispatching',
      meta: {
        title: '实时调度'
        // icon: 'table'
      }
    },
    // {
    //   path: 'Websoket',
    //   component: () => import('@/views/dispatching/websoket'),
    //   name: 'Websoket',
    //   meta: {
    //     title: 'websoket'
    //     // icon: 'table'
    //   }
    // },
    {
      path: 'shuttleBus',
      alwaysShow: true,
      component: () => import('@/views/RTM/shuttleBus'),
      name: 'RTMShuttleBus',
      meta: {
        title: '摆渡车派工'
      },
      children: [
        {
          path: 'ShuttleBus',
          component: () => import('@/views/RTM/shuttleBus/index'),
          name: 'ShuttleBus',
          meta: {
            title: '摆渡车派工'
          }
        }
      ]
    },
    {
      path: 'taskView',
      component: () => import('@/views/RTM/taskView/taskView'),
      name: 'TaskView',
      hidden: true,
      meta: {
        title: '航班任务'
      }
    },
    {
      path: 'checkIn',
      component: () => import('@/views/checkindesk'),
      name: 'CheckIn2',
      meta: {
        title: '值机柜台'
      },
      children: [
        {
          path: 'checkIn',
          component: () => import('@/views/checkindesk/checkindesk/index'),
          name: 'CheckIn',
          meta: {
            title: '柜台分布'
          }
        },
        {
          path: 'employeetasks',
          component: () => import('@/views/checkindesk/checkindesk/employeetasks'),
          name: 'Employeetasks',
          hidden: true,
          meta: {
            title: '员工任务'
          }
        },
        {
          path: 'forecasting',
          component: () => import('@/views/checkindesk/forecasting'),
          name: 'Forecasting',
          meta: {
            title: '资源预测'
          }
        }
      ]
    },
    {
      path: 'securityChannel',
      component: () => import('@/views/securityChannel/'),
      name: 'SecurityChannel',
      meta: {
        title: '安检通道'
      },
      children: [{
        path: 'securityChannel',
        component: () => import('@/views/securityChannel/securityChannel'),
        name: 'SecurityChannel1',
        meta: {
          title: '资源预测'
        }
      },
      {
        path: 'securityChannelgante',
        component: () => import('@/views/securityChannel/gante/index'),
        name: 'SecurityChannelgante',
        meta: {
          title: '甘特图'
        }
      }, {
        path: 'staffView',
        component: () => import('@/views/securityChannel/gante/staffView'),
        name: 'StaffView',
        hidden: true,
        meta: {
          title: '员工视图'
        }
      }
      ]
    },
    {
      path: 'seat',
      alwaysShow: true,
      component: () => import('@/views/seat/'),
      name: 'Seat',
      meta: {
        title: '席位分配'
      },
      children: [
        {
          path: 'seatgante',
          component: () => import('@/views/seat/gante/index'),
          name: 'Seatgante',
          meta: {
            title: '席位分配'
          }
        }
      ]
    },
    {
      path: 'warning',
      component: () => import('@/views/dispatching/warning/'),
      name: 'Warning',
      meta: {
        title: '预警'
        // icon: 'table'
      }
    },
    {
      path: 'flightInformation',
      component: () => import('@/views/dispatching/flightInformation/flightInformation'),
      name: 'FlightInformation',
      meta: {
        title: '航班动态'
        // icon: 'table'
      }
    },
    {
      path: 'ruleManagement',
      component: () => import('@/views/dispatching/ruleManagement/'),
      name: 'RuleManagement',
      meta: {
        title: '派工规则管理'
        // icon: 'table'
      }
    },
    {
      path: 'flightDetail',
      component: () => import('@/views/dispatching/flightDetail/'),
      name: 'FlightDetail',
      meta: {
        title: '航班动态详情'
        // icon: 'table'
      }
    },
    {
      path: 'targetDetail',
      component: () => import('@/views/dispatching/targetDetail/targetDetail'),
      name: 'TargetDetail',
      hidden: true,
      meta: {
        title: '任务细节'
        // icon: 'table'
      }
    }, {
      path: 'causeCode',
      component: () => import('@/views/ATM/causeCode'),
      name: 'CauseCode',
      meta: {
        title: '原因编码'
      },
      children: [{
        path: 'all',
        component: () => import('@/views/ATM/causeCode/all'),
        name: 'All',
        meta: {
          title: '原因描述'
        }
      },
      {
        path: 'userBehavior',
        component: () => import('@/views/ATM/causeCode/userBehavior'),
        name: 'UserBehavior',
        meta: {
          title: '任务状态'
        }
      }
      ]
    }
    ]
  },
  {
    path: '/HubManager',
    component: Layout,
    redirect: '/hubManager/hubManager',
    name: 'HubManager',
    meta: {
      title: 'HubManager',
      icon: 'example'
    },
    children: [{
      path: 'hubManager',
      name: 'HubManager',
      component: () => import('@/views/hubManager/hubManager'),
      meta: {
        title: '实时监控',
        icon: 'chart'
      }
    }]
  },
  {
    path: '/prepare',
    component: Layout,
    redirect: '/prepare/allPages/index',
    name: 'Prepare',
    meta: {
      title: '资源准备',
      icon: 'list'
    },
    children: [
      {
        path: 'flightPlan',
        component: () => import('@/views/prepare/flightPlan'),
        name: 'FlightPlan',
        meta: {
          title: '航班计划'
        }
      },
      {
        path: 'serviceStandard1',
        component: () => import('@/views/prepare/allPages/serviceStandard1/serviceStandard'),
        name: 'ServiceStandard1',
        meta: {
          title: '作业标准'
        }
      },
      {
        path: 'workload',
        component: () => import('@/views/prepare/allPages/workloadHidden'),
        name: 'Workload',
        meta: {
          title: '生成工作量'
        }
      },

      {
        path: 'compareDoc',
        component: () => import('@/views/prepare/compareDoc/compareDoc'),
        name: 'CompareDoc',
        hidden: true,
        meta: {
          title: '比较文档'
        }
      },
      // {
      //   path: 'setWorkRules',
      //   component: () => import('@/views/prepare/allPages/workRules'),
      //   name: 'SetWorkRules',
      //   meta: {
      //     title: '出勤规则设置'
      //   }
      // },
      {
        path: 'workRulesHidden',
        component: () => import('@/views/prepare/allPages/workRulesHidden/workRulesHidden'),
        name: 'WorkRulesHidden',
        meta: {
          title: '出勤规则'
        }
      },
      {
        path: 'makeShiftPlan',
        component: () => import('@/views/prepare/makeShiftPlan/makeShiftPlan'),
        name: 'MakeShiftPlan',
        meta: {
          title: '资源测算'
        }
      },
      // {
      //   path: 'workRulesGuide',
      //   hidden: true,
      //   component: () => import('@/views/prepare/setWorkRules/workRulesGuide/workRulesGuide'),
      //   name: 'WorkRulesGuide',
      //   meta: {
      //     title: '出勤规则设置向导'
      //   }
      // },
      {
        path: 'scheduleGenerator',
        component: () => import('@/views/prepare/scheduleGenerator'),
        name: 'ScheduleGenerator',
        meta: {
          title: '生成排班表'
        }
      },
      {
        path: 'shiftRule',
        name: 'ShiftRule',
        hidden: true,
        component: () => import('@/views/prepare/scheduleGenerator/shiftRule.vue'),
        meta: {
          title: '排班表编辑器向导',
          icon: ''
        }
      },
      {
        path: 'shiftOverview',
        component: () => import('@/views/prepare/shiftOverview/shiftOverview'),
        name: 'ShiftOverview',
        meta: {
          title: '排班概览'
        }
      },
      {
        path: 'staffOverview',
        component: () => import('@/views/prepare/staffOverview/staffOverview'),
        name: 'StaffOverview',
        meta: {
          title: '员工花名册'
        }
      },
      {
        path: 'teaManagement',
        component: () => import('@/views/prepare/TeaManagement/teaManagement.vue'),
        name: 'TeaManagement',
        meta: {
          title: '班组管理'
        }
      },
      {
        path: 'allPages',
        component: () => import('@/views/prepare/allPages/index'), // Parent router-view
        name: 'Menu1',
        meta: {
          title: '文件管理'
        },
        // redirect: '/prepare/allPages',
        children: [{
          path: 'flightSchedule',
          component: () => import('@/views/prepare/allPages/flightSchedule'),
          name: 'FlightSchedule',
          meta: {
            title: '航班计划'
          }
        },
        {
          path: 'serviceStandard1',
          component: () => import('@/views/prepare/allPages/serviceStandard1'),
          name: 'ServiceStandard1',
          meta: {
            title: '作业标准'
          }
        },
        {
          path: 'serviceStandard',
          component: () => import('@/views/prepare/allPages/serviceStandard1/serviceStandard'),
          hidden: true,
          name: 'ServiceStandard',
          meta: {
            title: '作业标准内容'
          }
        },
        {
          path: 'workload',
          component: () => import('@/views/prepare/allPages/workload'),
          name: 'Workload',
          meta: {
            title: '工作量'
          }
        },
        {
          path: 'workloadHidden',
          hidden: true,
          component: () => import('@/views/prepare/allPages/workloadHidden'),
          name: 'WorkloadHidden',
          meta: {
            title: '工作量内容'
          }
        },
        {
          path: 'staffInformation',
          component: () => import('@/views/prepare/allPages/staffInformation/staffInformation'),
          name: 'StaffInformation',
          meta: {
            title: '员工信息'
          }
        },
        {
          path: 'workRules',
          component: () => import('@/views/prepare/allPages/workRules'),
          name: 'WorkRules',
          meta: {
            title: '出勤规则'
          }
        },
        {
          path: 'shiftPlan',
          component: () => import('@/views/prepare/allPages/shiftPlan/shiftPlan'),
          name: 'ShiftPlan',
          meta: {
            title: '轮班计划'
          }
        },
        {
          path: 'shiftResultHidden',
          hidden: true,
          component: () => import('@/views/prepare/allPages/shiftResultHidden/shiftResultHidden'),
          name: 'ShiftResultHidden',
          meta: {
            title: '轮班计划结果'
          }
        },
        {
          path: 'shiftTable',
          component: () => import('@/views/prepare/allPages/shiftTable/shiftTable'),
          name: 'ShiftTable',
          meta: {
            title: '排班表'
          }
        }
        ]
      }
    ]
  },
  {
    path: '/visualizationScreen',
    component: Layout,
    redirect: '/visualizationScreen/visualizationScreen',
    name: 'VisualizationScreen',
    meta: {
      title: '可视化大屏',
      icon: 'eye-open'
    },
    children: [{
      path: 'visualizationScreen',
      name: 'VisualizationScreen',
      component: () => import('@/views/visualizationScreen/visualizationScreen'),
      meta: {
        title: '可视化大屏',
        icon: 'eye-open'
      }
    }]
  },
  {
    path: '/ATM',
    component: Layout,
    redirect: '/ATM/systemSetup/index',
    name: 'ADM',
    meta: {
      title: '基础数据设置',
      icon: 'tree'
    },
    children: [{
      path: 'systemSetup',
      component: () => import('@/views/ATM/systemSetup/index'), // Parent router-view
      name: 'SystemSetup',
      meta: {
        title: '系统设置'
      },
      children: [{
        path: 'siteInformation',
        component: () => import('@/views/ATM/systemSetup/siteInformation'),
        name: 'SiteInformation',
        meta: {
          title: '站点信息'
        }
      },
      {
        path: 'dailyRecord',
        hidden: true,
        component: () => import('@/views/ATM/systemSetup/dailyRecord'),
        name: 'DailyRecord',
        meta: {
          title: '日志'
        }
      }
      ]
    },
    {
      path: 'userManagement',
      component: () => import('@/views/ATM/userManagement'),
      name: 'UserManagement',
      meta: {
        title: '用户管理'
      }
    },
    {
      path: 'baseType',
      component: () => import('@/views/ATM/baseType'),
      name: 'BaseType',
      meta: {
        title: '基础类型'
      },
      children: [
        {
          path: 'busRules',
          component: () => import('@/views/ATM/baseType/busRules/index'),
          name: 'BusRules',
          meta: {
            title: '摆渡车派工作业标准'
          }
        },
        {
          path: 'checkInData/land',
          component: () => import('@/views/ATM/baseType/checkInData/land'),
          name: 'Land',
          meta: {
            title: '值机岛'
          }
        },
        {
          path: 'checkInData',
          component: () => import('@/views/ATM/baseType/checkInData/'),
          name: 'CheckInData',
          meta: {
            title: '值机柜台'
          }
        },
        {
          path: 'checkInData/set',
          component: () => import('@/views/ATM/baseType/checkInData/set'),
          name: 'Set',
          meta: {
            title: '值机柜台设置'
          }
        },
        {
          path: 'checkInRule',
          component: () => import('@/views/ATM/baseType/checkInData/rule'),
          name: 'CheckInData',
          meta: {
            title: '值机柜台派工规则'
          }
        },
        {
          path: 'securityChannel',
          component: () => import('@/views/ATM/baseType/securitychannel/index'),
          name: 'SecurityChannel2',
          meta: {
            title: '安检通道'
          }
        },
        {
          path: 'securityChannel/set',
          component: () => import('@/views/ATM/baseType/securitychannel/set'),
          name: 'SecurityChanneset',
          meta: {
            title: '安检通道设置'
          }
        },
        {
          path: 'securityChannelgante',
          component: () => import('@/views/ATM/baseType/securitychannel/gante'),
          name: 'SecurityChannelgante',
          meta: {
            title: '安检派工规则'
          }
        }, {
          path: 'department',
          component: () => import('@/views/ATM/baseType/department'),
          name: 'Department',
          meta: {
            title: '组织部门'
          }
        },
        {
          path: 'taskType',
          hidden: true,
          component: () => import('@/views/ATM/baseType/taskType'),
          name: 'TaskType',
          meta: {
            title: '任务类型'
          }
        },
        {
          path: 'workType',
          hidden: true,
          component: () => import('@/views/ATM/baseType/workType'),
          name: 'WorkType',
          meta: {
            title: '工作类型'
          }
        },
        {
          path: 'agreement',
          component: () => import('@/views/ATM/baseType/agreement'),
          name: 'Agreement',
          meta: {
            title: '员工合同类型'
          }
        },
        {
          path: 'agreementDtail',
          component: () => import('@/views/ATM/baseType/agreementDtail'),
          name: 'AgreementDtail',
          meta: {
            title: '员工合同详情'
          }
        },
        {
          path: 'skill',
          component: () => import('@/views/ATM/baseType/skill'),
          name: 'Skill',
          meta: {
            title: '技能'
          }
        },
        {
          path: 'role',
          component: () => import('@/views/ATM/baseType/role'),
          name: 'Role',
          meta: {
            title: '员工角色'
          }
        },
        {
          path: 'staff',
          component: () => import('@/views/ATM/baseType/staff'),
          name: 'Staff',
          meta: {
            title: '员工类型'
          }
        },
        {
          path: 'attendance',
          component: () => import('@/views/ATM/baseType/attendance'),
          name: 'Attendance',
          meta: {
            title: '员工缺勤类型定义'
          }
        },
        {
          path: 'shifType',
          component: () => import('@/views/ATM/baseType/shifType'),
          name: 'ShifType',
          meta: {
            title: '轮班类型'
          }
        },
        {
          path: 'equipmenType',
          component: () => import('@/views/ATM/baseType/equipmenType'),
          name: 'EquipmenType',
          meta: {
            title: '飞机机型'
          }
        },
        {
          path: 'aircraft_type',
          component: () => import('@/views/ATM/baseType/aircraftType'),
          name: 'AircraftType',
          meta: {
            title: '飞机标准类型'
          }
        },
        {
          path: 'attributeTypes',
          component: () => import('@/views/ATM/baseType/attributeTypes'),
          name: 'AttributeTypes',
          meta: {
            title: '属性类型'
          }
        },
        {
          path: 'attributeDefinition',
          component: () => import('@/views/ATM/baseType/attributeDefinition'),
          name: 'AttributeDefinition',
          meta: {
            title: '属性定义'
          }
        },
        {
          path: 'seat',
          component: () => import('@/views/ATM/baseType/seat'),
          name: 'Seat2',
          meta: {
            title: '席位强度'
          }
        },
        {
          path: 'seatSet',
          component: () => import('@/views/ATM/baseType/seatSet'),
          name: 'SeatSet',
          meta: {
            title: '席位设置'
          }
        }

      ]
    },
    // {
    //   path: 'causeCode',
    //   component: () => import('@/views/ATM/causeCode'),
    //   name: 'CauseCode',
    //   meta: {
    //     title: '原因编码'
    //   },
    //   children: [{
    //     path: 'all',
    //     component: () => import('@/views/ATM/causeCode/all'),
    //     name: 'All',
    //     meta: {
    //       title: '原因描述'
    //     }
    //   },
    //   {
    //     path: 'userBehavior',
    //     component: () => import('@/views/ATM/causeCode/userBehavior'),
    //     name: 'UserBehavior',
    //     meta: {
    //       title: '任务状态'
    //     }
    //   }
    //   ]
    // },
    {
      path: 'geography',
      component: () => import('@/views/ATM/geography'),
      name: 'Geography',
      meta: {
        title: '地理'
      },
      children: [{
        path: 'apron',
        component: () => import('@/views/ATM/geography/apron/index'),
        name: 'Apron',
        meta: {
          title: '机坪'
        }
      },
      {
        path: 'apron/posititon',
        component: () => import('@/views/ATM/geography/apron/posititon'),
        name: 'Posititon',
        meta: {
          title: '机位'
        }
      },
      {
        path: 'boardingate',
        component: () => import('@/views/ATM/geography/apron/boardingate'),
        name: 'Boardingate',
        meta: {
          title: '登机口'
        }
      },
      {
        path: 'position',
        component: () => import('@/views/ATM/geography/position'),
        name: 'Position',
        meta: {
          title: '位置'
        }
      },
      {
        path: 'definingDistance',
        component: () => import('@/views/ATM/geography/definingDistance'),
        name: 'DefiningDistance',
        meta: {
          title: '定义距离'
        }
      },
      {
        path: 'distanceRule',
        component: () => import('@/views/ATM/geography/distanceRule'),
        name: 'DistanceRule',
        meta: {
          title: '距离规则'
        }
      },
      {
        path: 'allDistance',
        component: () => import('@/views/ATM/geography/allDistance'),
        name: 'AllDistance',
        meta: {
          title: '所有距离'
        }
      }
      ]
    },
    {
      path: 'carrier',
      component: () => import('@/views/ATM/carrier'),
      name: 'Carrier',
      meta: {
        title: '航司'
      },
      children: [{
        path: 'organization',
        component: () => import('@/views/ATM/carrier/organization'),
        name: 'Organization',
        meta: {
          title: '航司信息'
        }
      },
      {
        path: 'agreement',
        component: () => import('@/views/ATM/carrier/agreement'),
        name: 'Agreement',
        meta: {
          title: '航司合同'
        }
      },
      {
        path: 'payable',
        component: () => import('@/views/ATM/carrier/payable'),
        name: 'Payable',
        meta: {
          title: '可计费项目'
        }
      }
      ]
    }
    ]
  },
  {
    path: '/sandbox',
    component: Layout,
    redirect: 'sandbox/sandbox',
    name: 'Sandbox',
    meta: {
      title: '沙盘',
      icon: 'example'
    },
    children: [{
      path: 'sandbox',
      name: 'Sandbox',
      component: () => import('@/views/sandbox/sandbox'),
      meta: {
        title: '沙盘',
        icon: 'example'
      }
    }]
  },
  // 404 page must be placed at the end !!!
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
