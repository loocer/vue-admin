import dashboard from "../pages/dashboard.vue";
import NotFoundView from "../components/404.vue";
import menuList from "../pages/sys/menu.vue";
import role from "../pages/sys/role/index.vue";
import resource from "../pages/sys/resource.vue";
import login from "../pages/login.vue";
import app from "../App.vue";
import sysUser from "../pages/sys/admin/index.vue";
import userAdd from "../pages/sys/userAdd.vue";
import resetPwd from "../pages/resetPwd.vue";
import department from '../pages/sys/department/index.vue'
import permissions from '../pages/sys/permissions.vue'

import award from '../pages/award'
import awardAdd from '../pages/award/add.vue'
import awardModify from '../pages/award/modify.vue'
import awardSearch from '../pages/award/awards.vue'
import awardsLog from '../pages/award/awardsLog'

import awardMonitoring from '../pages/awardMonitoring/awardMonitoring'
import awardMonitoringException from '../pages/awardMonitoring/awardMonitoring/exception'

import awardException from '../pages/awardMonitoring/awardException'

import merchant from '../pages/recharge/merchant'
import addmerchant from '../pages/recharge/merchant/add'
import merchantDetails from '../pages/recharge/merchant/details'
import merchantModify from '../pages/recharge/merchant/modify'
import rechargeChannel from '../pages/recharge/rechargeChannel'
import addrechargeChannel from '../pages/recharge/rechargeChannel/add'
import scamaTest from '../pages/scamaTest'

// Routes
const routes = [
  {path: '/login', component: login},
  {
    path: '/test', component: app, children: [
      {path: '*', component: NotFoundView}
    ]
  },
  {
    path: '', component: app, children: [
      {path: '/resetPwd', component: resetPwd},
      {path: '/index', component: dashboard},
      {path: '/sys/menuList', component: menuList},
      {path: '/permissions', component: permissions},
      {path: '/sys/department', component: department},
      {path: '/sys/roleList', component: role},
      {path: '/sys/admin', component: sysUser},
      {path: '/sys/userAdd', component: userAdd},
      {path: '/sys/resource', component: resource},

      {path: '/award',component:award},
      {path: '/award/add',component:awardAdd},
      {path: '/award/modify',component:awardModify},
      {path: '/award/award-search', component: awardSearch},

      {path: '/awardMonitoring',component:awardMonitoring},
      {path: '/awardMonitoring/award-exception', component: awardMonitoringException},
      {path: '/awardMonitoring/award-log', component: awardsLog},
      {path: '/awardException',component:awardException},

      {path: '/merchant',component:merchant},
      {path: '/merchant/add',component:addmerchant},
      {path: '/merchant/details',component:merchantDetails},
      {path: '/merchant/modify',component:merchantModify},
      {path: '/rechargeChannel',component:rechargeChannel},
      {path: '/rechargeChannel/add',component:addrechargeChannel}
    ]
  },
  {path: '/scama-test', component: scamaTest},
  {path: '*', component: app}
]


export default routes

