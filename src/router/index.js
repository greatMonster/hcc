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
      name: '首页',
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
      hidden: true,
      meta: {
        title: '实时调度'
        // icon: 'table'
      }
    },
    {
      path: 'shuttleBus',
      alwaysShow: true,
      component: () => import('@/views/RTM/shuttleBus'),
      name: 'RTMShuttleBus',
      meta: {
        title: '摆渡车派工'
      },
      // hidden: true,
      children: [{
        path: 'ShuttleBus',
        component: () => import('@/views/RTM/shuttleBus/index'),
        name: 'ShuttleBus',
        meta: {
          title: '摆渡车派工'
        }
      }]
    },
    {
      path: 'standard',
      hidden: true,
      component: () => import('@/views/RTM/standard/index'),
      name: 'ShuttleBustandard',
      meta: {
        title: '摆渡车派工标准'
      }
    },
    {
      path: 'loadAndUnload',
      alwaysShow: true,
      component: () => import('@/views/RTM/loadAndUnload'),
      name: 'LoadAndUnload',
      meta: {
        title: '装卸派工'
      },
      // hidden: true,
      children: [{
        path: 'loadAndUnload',
        component: () => import('@/views/RTM/loadAndUnload/index'),
        meta: {
          title: '装卸派工'
        }
      }]
    },
    {
      path: 'standardNew',
      component: () => import('@/views/RTM/standardNew'),
      name: 'StandardNew',
      meta: {
        title: '派工作业标准'
      }
    },
    {
      path: 'serviceStandard',
      alwaysShow: true,
      component: () => import('@/views/RTM/realTimeJobRules/'),

      meta: {
        title: '派工作业标准'
      },
      // hidden: true,
      children: [{
        path: 'serviceStandard',
        component: () => import('@/views/RTM/realTimeJobRules/index'),

        meta: {
          title: '派工作业标准'
        }
      }
      ]
    },
    {
      path: 'detail',
      component: () => import('@/views/RTM/realTimeJobRules/components/detail'),
      name: 'Detail',
      meta: {
        title: '添加任务模板'
      }
    },
    {
      path: 'clean',
      alwaysShow: true,
      component: () => import('@/views/RTM/clean'),
      name: 'Clean1',
      meta: {
        title: '清洁派工'
      },
      // hidden: true,
      children: [{
        path: 'clean',
        component: () => import('@/views/RTM/clean/index'),
        name: 'Clean',
        meta: {
          title: '清洁派工'
        }
      }]
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
      children: [{
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
        path: 'deskTasks',
        component: () => import('@/views/checkindesk/deskTasks/index'),
        name: 'DeskTasks',
        hidden: true,
        meta: {
          title: '柜台任务'
        }
      },
      {
        path: 'deskTaskList',
        component: () => import('@/views/checkindesk/checkindesk/taskList'),
        name: 'DeskTaskList',
        meta: {
          title: '任务列表'
        }
      },
      {
        path: 'boarding',
        component: () => import('@/views/checkindesk/boarding/index'),
        name: 'boarding',
        hidden: true,
        meta: {
          title: '登机口派工'
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
      path: 'guardPoint',
      component: () => import('@/views/guardPoint'),
      name: 'GuardPoint1',
      meta: {
        title: '监护'
      },
      children: [{
        path: 'guardPoint',
        component: () => import('@/views/guardPoint/guardPoint/index'),
        name: 'GuardPoint',
        meta: {
          title: '值守点分布'
        }
      },
      {
        path: 'employeetasks1',
        component: () => import('@/views/guardPoint/guardPoint/employeetasks'),
        name: 'Employeetasks1',
        hidden: true,
        meta: {
          title: '员工视角'
        }
      },
      {
        path: 'guardPoint2',
        component: () => import('@/views/guardPoint/guardTasks/index'),
        name: 'GuardPoint2',
        hidden: true,
        meta: {
          title: '值守点视角'
        }
      },
      {
        path: 'setGuardTask',
        component: () => import('@/views/guardPoint/setGuardTask/index'),
        name: 'SetGuardTask',
        hidden: true,
        meta: {
          title: '设置任务'
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
      // hidden: true,
      children: [
        {
          path: 'securityDispatching',
          component: () => import('@/views/securityChannel/dispatching/index'),
          name: 'SecurityDispatching',
          meta: {
            title: '安检派工'
          }
        },
        {
          path: 'channelEmployeeTasks',
          component: () => import('@/views/securityChannel/dispatching/employeetasks'),
          name: 'ChannelEmployeeTasks',
          meta: {
            title: '员工视角'
          }
        },
        {
          path: 'channelTasks',
          component: () => import('@/views/securityChannel/channelView'),
          name: 'ChannelTasks',
          meta: {
            title: '安检通道视角'
          }
        },
        {
          path: 'dispatchingList',
          component: () => import('@/views/securityChannel/dispatching/taskList'),
          name: 'DispatchingList',
          meta: {
            title: '派工列表'
          }
        },
        {
          path: 'securityChannel',
          component: () => import('@/views/securityChannel/securityChannel'),
          name: 'SecurityChannel1',
          meta: {
            title: '资源预测'
          }
        },
        {
          path: 'forecasting',
          component: () => import('@/views/securityChannel/forecasting/forecastings'),
          name: 'forecasting',
          meta: {
            title: '安检通道预测'
          }
        },
        {
          path: 'parameter',
          component: () => import('@/views/securityChannel/forecasting/parameter'),
          hidden: true,
          meta: {
            title: '预测参数'
          }
        },
        {
          path: 'passengerFlow',
          component: () => import('@/views/securityChannel/forecasting/passengerFlow'),
          hidden: true,
          meta: {
            title: '旅客流量'
          }
        },
        {
          path: 'operationPage',
          component: () => import('@/views/securityChannel/forecasting/passengerFlow/operationPage'),
          name: 'operationPage'
        }, {
          path: 'detailsPage',
          component: () => import('@/views/securityChannel/forecasting/passengerFlow/details'),
          name: 'DetailsPage',
          meta: {
            title: '详情'
          }
        }, {
          path: 'addPage',
          component: () => import('@/views/securityChannel/forecasting/parameter/addPage.vue'),
          name: 'AddPage',
          hidden: true,
          meta: {
            title: '新增'
          }
        },
        {
          path: 'details',
          component: () => import('@/views/securityChannel/forecasting/parameter/detailPage.vue'),
          name: 'Details',
          hidden: true,
          meta: {
            title: '详情'
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
      children: [{
        path: 'seatgante',
        component: () => import('@/views/seat/gante/index'),
        name: 'Seatgante',
        meta: {
          title: '席位分配'
        }
      }]
    },
    {
      path: 'targetDetail',
      component: () => import('@/views/dispatching/targetDetail/targetDetail'),

      hidden: true,
      meta: {
        title: '任务细节'
        // icon: 'table'
      }
    }
    ]
  },
  {
    path: '/HubManager',
    component: Layout,
    redirect: '/hubManager/hubManager',
    name: 'HubM',
    hidden: true,
    meta: {
      title: 'HubManager',
      icon: 'example'
    },
    children: [{
      path: 'hubManager',
      name: 'HubManager',
      component: () => import('@/views/hubManager/hubManager'),
      hidden: true,
      meta: {
        title: '实时监控',
        icon: 'chart'
      }
    },
    {
      path: 'earlyWarning',
      name: 'earlyWarning',
      component: () => import('@/views/hubManager/earlyWarning'),
      hidden: true,
      meta: {
        title: '任务预警'
      }
    },
    {
      path: 'tandemNode',
      name: 'tandemNode',
      component: () => import('@/views/hubManager/tandemNode'),
      meta: {
        title: '串联节点'
      }
    },
    {
      path: 'SecurityTemplate',
      name: 'SecurityTemplate',
      component: () => import('@/views/hubManager/SecurityTemplate'),
      meta: {
        title: '保障模板'
      }
    },
    {
      path: 'supportNode',
      name: 'supportNode',
      component: () => import('@/views/hubManager/supportNode'),
      meta: {
        title: '保障节点'
      }
    },
    {
      path: 'details',
      name: 'details',
      component: () => import('@/views/hubManager/earlyWarning/details'),
      hidden: true,
      meta: {
        title: '任务详细'
      }
    }]
  },
  {
    path: '/RTM',
    component: Layout,
    name: '航班动态',
    meta: {
      title: '航班动态',
      icon: ''
    },
    children: [{
      path: 'flightDynamics',
      name: 'FlightDynamics',
      component: () => import('@/views/RTM/flightDynamics'),
      meta: {
        title: '航班动态',
        icon: ''
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
    children: [{
      path: 'flightPlan',
      component: () => import('@/views/prepare/flightPlan'),
      name: 'FlightPlan',
      hidden: true,
      meta: {
        title: '航班计划'
      }
    },
    {
      path: 'flightPlanNew',
      component: () => import('@/views/prepare/flightPlanNew'),
      name: 'FlightPlanNew',
      hidden: true,
      meta: {
        title: '新的航班计划'
      }
    },
    {
      path: 'flightPlanNew/sharedFlights',
      component: () => import('@/views/prepare/flightPlanNew/sharedFlights'),
      name: 'SharedFlights',
      hidden: true,
      meta: {
        title: '共享航班'
      }
    },
    {
      path: 'flightPlan/relationPage',
      component: () => import('@/views/prepare/flightPlan/relationPage'),
      hidden: true,
      name: 'relationPage',
      meta: {
        title: '关联航班详情'
      }
    },
    {
      path: 'flightPlan/shareFlight',
      component: () => import('@/views/prepare/flightPlan/shareFlight'),
      hidden: true,
      name: 'shareFlight',
      meta: {
        title: '共享航班详情'
      }
    },
    {
      path: 'flightPlan/associatedflights',
      component: () => import('@/views/prepare/flightPlan/associatedflights'),

      hidden: true,
      meta: {
        title: '航班关联'
      }
    },
    {
      path: 'serviceStandard1',
      component: () => import('@/views/prepare/allPages/serviceStandard1/serviceStandard'),
      hidden: true,
      meta: {
        title: '作业标准'
      }
    },
    {
      path: 'workload',
      component: () => import('@/views/prepare/allPages/workloadHidden'),

      meta: {
        title: '生成工作量'
      }
    },

    {
      path: 'compareDoc',
      component: () => import('@/views/prepare/compareDoc/compareDoc'),

      hidden: true,
      meta: {
        title: '比较文档'
      }
    },
    {
      path: 'workRulesHidden',
      component: () => import('@/views/prepare/allPages/workRulesHidden/workRulesHidden'),

      hidden: true,
      meta: {
        title: '出勤规则'
      }
    },
    {
      path: 'makeShiftPlan',
      component: () => import('@/views/prepare/makeShiftPlan/makeShiftPlan'),

      meta: {
        title: '资源测算'
      }
    },
    {
      path: 'scheduleGenerator',
      component: () => import('@/views/prepare/scheduleGenerator'),

      meta: {
        title: '生成排班表'
      }
    },
    {
      path: 'shiftRule',

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

      meta: {
        title: '员工日历'
      }
    },
    {
      path: 'changeLog',
      component: () => import('@/views/prepare/shiftOverview/components/changeLog'),

      meta: {
        title: '日志状态变更'
      }
    },
    {
      path: 'staffOverview',
      component: () => import('@/views/prepare/staffOverview/staffOverview'),

      meta: {
        title: '员工花名册'
      }
    },
    {
      path: 'teaManagement',
      component: () => import('@/views/prepare/TeaManagement/teaManagement.vue'),

      // hidden: true,
      meta: {
        title: '班组管理'
      }
    },
    {
      path: 'allPages',
      component: () => import('@/views/prepare/allPages/index'), // Parent router-view

      meta: {
        title: '文件管理'
      },
      // redirect: '/prepare/allPages',
      children: [{
        path: 'flightSchedule',
        component: () => import('@/views/prepare/allPages/flightSchedule'),

        meta: {
          title: '航班计划'
        }
      },
      {
        path: 'flightScheduleNew',
        component: () => import('@/views/prepare/allPages/flightScheduleNew'),

        meta: {
          title: '新的航班计划'
        }
      },
      {
        path: 'serviceStandard1',
        component: () => import('@/views/prepare/allPages/serviceStandard1'),

        meta: {
          title: '作业标准'
        }
      },
      {
        path: 'Validitypage',
        component: () => import('@/views/prepare/allPages/serviceStandard1/Validitypage'),

        hidden: true,
        meta: {
          title: '校验结果'
        }
      },
      {
        path: 'serviceStandard',
        component: () => import('@/views/prepare/allPages/serviceStandard1/serviceStandard'),
        hidden: true,

        meta: {
          title: '作业标准内容'
        }
      },
      {
        path: 'workload',
        component: () => import('@/views/prepare/allPages/workload'),

        meta: {
          title: '工作量'
        }
      },
      {
        path: 'workloadMerge',
        component: () => import('@/views/prepare/allPages/workload/workloadMerge'),

        meta: {
          title: '工作量合成'
        }
      },
      {
        path: 'workloadHidden',
        hidden: true,
        component: () => import('@/views/prepare/allPages/workloadHidden'),

        meta: {
          title: '工作量内容'
        }
      },
      {
        path: 'workloadHidden/merge',
        hidden: true,
        component: () => import('@/views/prepare/allPages/workloadHidden/merge'),

        meta: {
          title: '工作量内容'
        }
      },
      {
        path: 'workloadHidden/mergeIndex',
        hidden: true,
        component: () => import('@/views/prepare/allPages/workloadHidden/mergeIndex'),

        meta: {
          title: '合并工作量'
        }
      },
      {
        path: 'staffInformation',
        component: () => import('@/views/prepare/allPages/staffInformation/staffInformation'),

        hidden: true,
        meta: {
          title: '员工信息'
        }
      },
      {
        path: 'workRules',
        component: () => import('@/views/prepare/allPages/workRules'),

        meta: {
          title: '出勤规则'
        }
      },
      {
        path: 'allPages/workRulesHiddeninner',
        component: () => import('@/views/prepare/allPages/workRulesHidden/ruleTemplate'),

        meta: {
          title: '出勤规则模板'
        }
      },
      {
        path: 'shiftPlan',
        component: () => import('@/views/prepare/allPages/shiftPlan/shiftPlan'),

        meta: {
          title: '轮班计划'
        }
      },
      {
        path: 'shiftResultHidden',
        hidden: true,
        component: () => import('@/views/prepare/allPages/shiftResultHidden/shiftResultHidden'),

        meta: {
          title: '轮班计划结果'
        }
      },
      {
        path: 'shiftTable',
        component: () => import('@/views/prepare/allPages/shiftTable/shiftTable'),

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

    meta: {
      title: '可视化大屏',
      icon: 'eye-open'
    },
    hidden: true,
    children: [{
      path: 'visualizationScreen',

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
    name: 'ATM',
    meta: {
      title: '基础数据设置',
      icon: 'tree'
    },
    children: [{
      path: 'systemSetup',
      component: () => import('@/views/ATM/systemSetup/index'), // Parent router-view

      meta: {
        title: '系统设置'
      },
      children: [{
        path: 'siteInformation',
        component: () => import('@/views/ATM/systemSetup/siteInformation'),

        meta: {
          title: '站点信息'
        }
      },
      {
        path: 'dailyRecord',
        hidden: true,
        component: () => import('@/views/ATM/systemSetup/dailyRecord'),

        meta: {
          title: '日志'
        }
      }
      ]
    },
    {
      path: 'userManagement',
      component: () => import('@/views/ATM/userManagement'),

      // hidden: true,
      meta: {
        title: '用户管理'
      }
    },
    {
      path: 'roleManagement',
      component: () => import('@/views/ATM/roleManagement'),

      // hidden: true,
      meta: {
        title: '角色管理'
      }
    },
    {
      path: 'operationLog',
      component: () => import('@/views/ATM/operationLog'),

      // hidden: true,
      meta: {
        title: '系统操作日志'
      }
    },
    {
      path: 'editAdd',
      component: () => import('@/views/ATM/roleManagement/editAdd')

    },
    {
      path: 'baseType',
      component: () => import('@/views/ATM/baseType'),

      meta: {
        title: '基础类型'
      },
      children: [{
        path: 'busRules',
        component: () => import('@/views/ATM/baseType/busRules/index'),

        meta: {
          title: '摆渡车派工作业标准'
        }
      },
      {
        path: 'checkInData/land',
        component: () => import('@/views/ATM/baseType/checkInData/land'),

        meta: {
          title: '值机岛'
        }
      },
      {
        path: 'checkInData/securityCheck',
        component: () => import('@/views/ATM/baseType/checkInData/securityCheck'),

        meta: {
          title: '安检区域'
        }
      },
      {
        path: 'checkInData',
        component: () => import('@/views/ATM/baseType/checkInData/'),

        meta: {
          title: '值机柜台'
        }
      },
      {
        path: 'checkInData/passageway',
        component: () => import('@/views/ATM/baseType/checkInData/passageway'),

        meta: {
          title: '安检通道'
        }
      },
      {
        path: 'checkInData/Checkservice',
        component: () => import('@/views/ATM/baseType/checkInData/Checkservice'),

        meta: {
          title: '服务类型'
        }
      },
      {
        path: 'checkInData/Securityservice',
        component: () => import('@/views/ATM/baseType/checkInData/Securityservice'),

        meta: {
          title: '服务类型'
        }
      },
      {
        path: 'checkInData/set',
        hidden: true,
        component: () => import('@/views/ATM/baseType/checkInData/set'),

        meta: {
          title: '值机柜台设置'
        }
      },
      {
        path: 'checkInRule',
        hidden: true,
        component: () => import('@/views/ATM/baseType/checkInData/rule'),

        meta: {
          title: '值机柜台派工规则'
        }
      },
      {
        path: 'securityChannel',
        component: () => import('@/views/ATM/baseType/securitychannel/index'),

        meta: {
          title: '安检通道'
        }
      },
      {
        path: 'securityChannel/set',
        component: () => import('@/views/ATM/baseType/securitychannel/set'),

        meta: {
          title: '安检通道设置'
        }
      },
      {
        path: 'securityChannelgante',
        component: () => import('@/views/ATM/baseType/securitychannel/gante'),

        meta: {
          title: '安检派工规则'
        }
      },
      {
        path: 'navLine',
        component: () => import('@/views/ATM/baseType/navLine/index'),

        meta: {
          title: '航线管理'
        }
      }, {
        path: 'department',
        component: () => import('@/views/ATM/baseType/department'),

        meta: {
          title: '组织部门'
        }
      }, {
        path: 'arrivalpoint',
        component: () => import('@/views/ATM/baseType/arrivalpoint'),

        meta: {
          title: '到达点'
        }
      },
      {
        path: 'taskTemplate',
        component: () => import('@/views/ATM/baseType/taskTemplate'),

        meta: {
          title: '任务模板'
        }
      },
      {
        path: 'subtaskTemplate',
        component: () => import('@/views/ATM/baseType/subtaskTemplate'),

        meta: {
          title: '子任务模板'
        }
      },
      {
        path: 'taskType',
        // hidden: true,
        component: () => import('@/views/ATM/baseType/taskType'),

        meta: {
          title: '任务类型'
        }
      },
      {
        path: 'workType',
        hidden: false,
        component: () => import('@/views/ATM/baseType/workType'),

        meta: {
          title: '工作类型'
        }
      },
      {
        path: 'agreement',
        component: () => import('@/views/ATM/baseType/agreement'),

        meta: {
          title: '员工合同类型'
        }
      },
      {
        path: 'agreementDtail',
        component: () => import('@/views/ATM/baseType/agreementDtail'),

        meta: {
          title: '员工合同详情'
        }
      },
      {
        path: 'skill',
        component: () => import('@/views/ATM/baseType/skill'),

        meta: {
          title: '技能'
        }
      },
      {
        path: 'assessmentReport',
        component: () => import('@/views/ATM/baseType/assessmentReport'),

        meta: {
          title: '考核报表'
        }
      },
      {
        path: 'role',
        component: () => import('@/views/ATM/baseType/role'),

        meta: {
          title: '员工角色'
        }
      },
      {
        path: 'staff',
        component: () => import('@/views/ATM/baseType/staff'),

        meta: {
          title: '员工类型'
        }
      },
      {
        path: 'attendance',
        component: () => import('@/views/ATM/baseType/attendance'),

        meta: {
          title: '员工缺勤类型定义'
        }
      },
      {
        path: 'baselineType',
        component: () => import('@/views/ATM/baseType/baselineType'),

        meta: {
          title: '基线类型'
        }
      },
      {
        path: 'shifType',
        component: () => import('@/views/ATM/baseType/shifType'),

        meta: {
          title: '轮班类型'
        }
      },
      {
        path: 'equipmenType',
        component: () => import('@/views/ATM/baseType/equipmenType'),

        meta: {
          title: '飞机机型'
        }
      },
      {
        path: 'aircraft_type',
        component: () => import('@/views/ATM/baseType/aircraftType'),

        meta: {
          title: '飞机标准类型'
        }
      },
      {
        path: 'attributeTypes',
        component: () => import('@/views/ATM/baseType/attributeTypes'),

        meta: {
          title: '属性类型'
        }
      },
      {
        path: 'attributeDefinition',
        component: () => import('@/views/ATM/baseType/attributeDefinition'),

        meta: {
          title: '属性定义'
        }
      },
      {
        path: 'seat',
        component: () => import('@/views/ATM/baseType/seat'),

        meta: {
          title: '席位强度'
        }
      },
      {
        path: 'seatSet',
        component: () => import('@/views/ATM/baseType/seatSet'),

        meta: {
          title: '席位设置'
        }
      }

      ]
    },
    {
      path: 'geography',
      component: () => import('@/views/ATM/geography'),

      meta: {
        title: '地理'
      },
      children: [{
        path: 'apron',
        component: () => import('@/views/ATM/geography/apron/index'),

        meta: {
          title: '机坪'
        }
      },
      {
        path: 'apron/posititon',
        component: () => import('@/views/ATM/geography/apron/posititon'),

        meta: {
          title: '机位'
        }
      },
      {
        path: 'boardingate',
        component: () => import('@/views/ATM/geography/apron/boardingate'),

        meta: {
          title: '登机口'
        }
      },
      {
        path: 'position',
        component: () => import('@/views/ATM/geography/position'),

        // hidden: true,
        meta: {
          title: '位置'
        }
      },
      {
        path: 'definingDistance',
        component: () => import('@/views/ATM/geography/definingDistance'),

        meta: {
          title: '定义距离'
        }
      },
      {
        path: 'guardPoint',
        component: () => import('@/views/ATM/geography/guardPoint'),

        meta: {
          title: '值守点'
        }
      },
      {
        path: 'distanceRule',
        component: () => import('@/views/ATM/geography/distanceRule'),

        // hidden: true,
        meta: {
          title: '距离规则'
        }
      },
      {
        path: 'terminal',
        component: () => import('@/views/ATM/geography/terminal'),

        // hidden: true,
        meta: {
          title: '航站楼'
        }
      },
      {
        path: 'natureFlight',
        component: () => import('@/views/ATM/geography/natureFlight'),

        // hidden: true,
        meta: {
          title: '航班性质'
        }
      },
      {
        path: 'allDistance',
        component: () => import('@/views/ATM/geography/allDistance'),

        // hidden: true,
        meta: {
          title: '所有距离'
        }
      }
      ]
    },
    {
      path: 'carrier',
      component: () => import('@/views/ATM/carrier'),

      meta: {
        title: '航司'
      },
      children: [{
        path: 'organization',
        component: () => import('@/views/ATM/carrier/organization'),

        meta: {
          title: '航司信息'
        }
      }, {
        path: 'correlateBusiness',
        component: () => import('@/views/ATM/carrier/organization/correlateBusiness'),

        hidden: true,
        meta: {
          title: '关联航司信息'
        }
      },
      {
        path: 'agreement',
        component: () => import('@/views/ATM/carrier/agreement'),

        meta: {
          title: '航司合同'
        }
      },
      {
        path: 'payable',
        component: () => import('@/views/ATM/carrier/payable'),

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
    hidden: true,
    children: [{
      path: 'sandbox',

      component: () => import('@/views/sandbox/sandbox'),
      meta: {
        title: '沙盘',
        icon: 'example'
      }
    }]
  },
  // New menu
  {
    path: '/vehicle',
    component: Layout,
    redirect: '/vehicle/shuttleBus/dispatching',
    name: 'Vehicle',
    meta: {
      title: '特车',
      icon: ''
    },
    children: [
      {
        path: 'shuttleBus',
        component: () => import('@/views/vehicle/shuttleBus/index'), // Parent router-view

        meta: { title: '摆渡车' },
        redirect: '/vehicle/shuttleBus/dispatching',
        children: [
          {
            path: 'serviceStandard',
            component: () => import('@/views/vehicle/shuttleBus/serviceStandard'),

            meta: { title: '作业标准' }
          },
          {
            path: 'busType',
            component: () => import('@/views/vehicle/shuttleBus/busType'),

            meta: { title: '摆渡车类型' }
          },
          {
            path: 'busRelated',
            component: () => import('@/views/vehicle/shuttleBus/busRelated'),
            name: 'BusRelated',
            meta: { title: '舱车关联' }
          },
          {
            path: 'targetDetail',
            component: () => import('@/views/vehicle/shuttleBus/dispatching/targetDetail/targetDetail'),

            hidden: true,
            meta: {
              title: '任务详情'
              // icon: 'table'
            }
          },
          {
            path: 'dispatching',
            component: () => import('@/views/vehicle/shuttleBus/dispatching'),

            meta: { title: '派工' }
          },
          {
            path: 'dispatching/skillMaintenance',
            component: () => import('@/views/vehicle/shuttleBus/dispatching/skillMaintenance'),

            meta: { title: '员工技能维护' }
          }, {
            path: 'taskView',
            component: () => import('@/views/vehicle/shuttleBus/taskView/taskView'),

            hidden: true,
            meta: {
              title: '航班任务'
            }
          }
        ]
      },
      {
        path: 'specialVehicle',
        component: () => import('@/views/vehicle/specialVehicle/index'), // Parent router-view
        name: 'specialVehicle',
        meta: { title: '特车' },
        redirect: '/vehicle/specialVehicle/dispatching',
        children: [
          {
            path: 'serviceStandard',
            component: () => import('@/views/vehicle/specialVehicle/serviceStandard'),

            meta: { title: '作业标准' }
          },
          {
            path: 'targetDetail',
            component: () => import('@/views/vehicle/specialVehicle/dispatching/targetDetail/targetDetail'),

            hidden: true,
            meta: {
              title: '任务详情'
              // icon: 'table'
            }
          },
          {
            path: 'dispatchRule',
            component: () => import('@/views/vehicle/specialVehicle/dispatching/dispatchRule'),

            hidden: true,
            meta: {
              title: '派工规则'
              // icon: 'table'
            }
          },
          {
            path: 'dispatching',
            component: () => import('@/views/vehicle/specialVehicle/dispatching'),

            meta: { title: '派工' }
          }, {
            path: 'taskView',
            component: () => import('@/views/vehicle/specialVehicle/taskView/taskView'),

            hidden: true,
            meta: {
              title: '任务列表'
            }
          }
        ]
      }
    ]
  },
  {
    path: '/newcheckIn',
    component: Layout,
    redirect: 'newcheckIn/newcheckIn',
    meta: {
      title: '值机',
      icon: ''
    },
    children: [{
      path: '/',
      component: () => import('@/views/newCheckindesk/forecasting'),

      meta: {
        title: '资源预测'
      },
      children: [{
        path: 'forecasting',
        component: () => import('@/views/newCheckindesk/forecasting/forecastings'),

        meta: {
          title: '资源预测'
        }
      }, {
        path: 'parameter',
        component: () => import('@/views/newCheckindesk/forecasting/parameter'),

        hidden: true,
        meta: {
          title: '预测参数'
        }
      }, {
        path: 'addPage',
        component: () => import('@/views/newCheckindesk/forecasting/parameter/addPage.vue'),

        hidden: true,
        meta: {
          title: '新增'
        }
      },
      {
        path: 'details',
        component: () => import('@/views/newCheckindesk/forecasting/parameter/detailPage.vue'),

        hidden: true,
        meta: {
          title: '详情'
        }
      },
      {
        path: 'passengerFlow',
        component: () => import('@/views/newCheckindesk/forecasting/passengerFlow'),

        meta: {
          title: '旅客流量'
        }
      },
      {
        path: 'operationPage',
        component: () => import('@/views/newCheckindesk/forecasting/passengerFlow/operationPage')

      }, {
        path: 'detailsPage',
        component: () => import('@/views/newCheckindesk/forecasting/passengerFlow/details'),

        meta: {
          title: '详情'
        }
      }
      ]
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
      path: 'baseType',
      component: () => import('@/views/ATM/baseType'),
      name: 'BaseType',
      meta: {
        title: '基础类型'
      },
      children: [{
        path: 'checkInData/indexBackup',
        component: () => import('@/views/ATM/baseType/checkInData/indexBackup'),

        meta: {
          title: '值机柜台'
        }
      }, {
        path: 'gateDistance/setRegion',
        component: () => import('@/views/ATM/baseType/gateDistance/setRegion'),

        meta: {
          title: '创建区域'
        }
      }, {
        path: 'gateDistance/regionDistance',
        component: () => import('@/views/ATM/baseType/gateDistance/regionDistance'),

        meta: {
          title: '区域间距离'
        }
      }, {
        path: 'gateDistance/dotDistance',
        component: () => import('@/views/ATM/baseType/gateDistance/dotDistance'),

        meta: {
          title: '点间距离'
        }
      }]
    }]
  },
  {
    path: '/prepare',
    component: Layout,
    redirect: '/prepare/allPages/index',

    meta: {
      title: '资源准备',
      icon: 'list'
    },
    children: [{
      path: 'workloadNew',
      component: () => import('@/views/prepare/allPages/workloadNew'),

      meta: {
        title: '工作量'
      }
    },
    {
      path: 'addIndex',
      component: () => import('@/views/prepare/allPages/workloadNew/addIndex'),

      meta: {
        title: '生成工作量'
      }
    }, {
      path: 'importFile',
      component: () => import('@/views/prepare/allPages/workloadNew/importFile'),

      hidden: true,
      meta: {
        title: '工作量导入'
      }
    },
    {
      path: 'workloadHiddenNew',
      hidden: true,
      component: () => import('@/views/prepare/allPages/workloadHiddenNew'),

      meta: {
        title: '工作量内容'
      }
    },
    {
      path: 'workloadHiddenNew/modifyWorkload',
      hidden: true,
      component: () => import('@/views/prepare/allPages/workloadHiddenNew/modifyWorkload'),

      meta: {
        title: '修改工作量'
      }
    },
    {
      path: 'workloadHiddenNew/mergeIndex',
      hidden: true,
      component: () => import('@/views/prepare/allPages/workloadHiddenNew/mergeIndex'),

      meta: {
        title: '合并工作量'
      }
    },
    {
      path: 'workloadHiddenNew/splitIndex',
      hidden: true,
      component: () => import('@/views/prepare/allPages/workloadHiddenNew/splitIndex'),

      meta: {
        title: '拆分工作量'
      }
    },
    {
      path: 'workRulesNew',
      hidden: true,
      component: () => import('@/views/prepare/allPages/workRulesNew'),

      meta: {
        title: '出勤规则'
      }
    }, {
      path: 'workRulesHiddenNew',
      hidden: true,
      component: () => import('@/views/prepare/allPages/workRulesHiddenNew'),

      meta: {
        title: '规则添加'
      }
    }, {
      path: 'shiftTableNew',
      component: () => import('@/views/prepare/allPages/shiftTableNew'),

      meta: {
        title: '排班表'
      }
    }, {
      path: 'scheduleGeneratorNew',
      component: () => import('@/views/prepare/scheduleGeneratorNew'),

      meta: {
        title: '生成排班表'
      }
    }, {
      path: 'addPage',
      hidden: true,
      component: () => import('@/views/prepare/allPages/shiftTableNew/addPage'),

      meta: {
        title: '新增排班表'
      }
    }, {
      path: 'scheduleDetails',
      hidden: true,
      component: () => import('@/views/prepare/compareDocNew/scheduleDetails'),

      meta: {
        title: '基于工作量的排班表详情'
      }
    }, {
      path: 'mouldDetails',
      hidden: true,
      component: () => import('@/views/prepare/compareDocNew/scheduleDetails/mouldDetails'),

      meta: {
        title: '基于模板的排班表详情'
      }
    }, {
      path: 'compareDocNew',
      hidden: true,
      component: () => import('@/views/prepare/compareDocNew'),

      meta: {
        title: '比较覆盖和kpi'
      }
    }, {
      path: 'copy',
      hidden: true,
      component: () => import('@/views/prepare/scheduleGeneratorNew/copy.vue'),

      meta: {
        title: '复制排班表'
      }
    }
    ]
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
