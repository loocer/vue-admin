import Vue from "vue";
import Vuex from "vuex";
import types from "./mutation-types";
 import * as sysApi from '../services/sys'
import defaultValue from "../services/default";
import * as api from "../api";
import { getCurrentMenu, getSessionKey, formateMenueData, formatePermissionsData,formateDepartmentData} from '../common/utils'

Vue.use(Vuex)

const store = new Vuex.Store({
  strict: true,  // process.env.NODE_ENV !== 'production', 直接修改state 抛出异常
  state: {
    loading: false,
    menuList: {},
    sidebar: {
      collapsed: getSessionKey('state.sidebar.collapsed','false')==='true',
      show: getSessionKey('state.sidebar.show','true')==='true',
    },
    device: {
      isMobile: false
    },
    permissionsTree:[],
    userInfo:{name:'佚名'},
    currentMenus:[],
    admins:[],
    adminRolesTree:[],
    adminDepartmentTree:[],
    adminFps:null
  },
  getters: {
    loading: state => state.loading,
    menuList: state => state.menuList,
    sidebar: state => state.sidebar,
    permissionsTree: state => state.permissionsTree,
    userInfo:state => state.userInfo,
    device:state => state.device,
    currentMenus:state => state.currentMenus,
    admins:state => state.admins,
    adminRolesTree:state => state.adminRolesTree,
    adminDepartmentTree:state => state.adminDepartmentTree,
    adminFps:state => state.adminFps
  },
  mutations: {
    //只能同步的函数
    [types.TOGGLE_DEVICE] (state, isMobile) {
      state.device.isMobile = isMobile
    },
    [types.TOGGLE_LOADING] (state) {
      state.loading = !state.loading
    },
    [types.LOAD_MENU] (state, menu) {
      state.menuList = menu;
    },
    [types.LOAD_PERMISSIONSTREE] (state, permissionsTree) {
      state.permissionsTree = permissionsTree;
    },
    [types.LOAD_ADMINS] (state, admins) {
      state.admins = admins;
    },
    [types.LOAD_CURRENT_MENU] (state, menu) {
      state.currentMenus = menu;
    },
    [types.SET_USER_INFO] (state, info) {
      state.userInfo = info;
    },
    [types.LOAD_ADMINROLES] (state, adminRolesTree) {
      state.adminRolesTree = adminRolesTree;
    },
    [types.LOAD_ADMINDEPARTMENT_TREE] (state, adminDepartmentTree) {
      state.adminDepartmentTree = adminDepartmentTree;
    },
    [types.TOGGLE_SIDEBAR] (state, collapsed) {
      if (collapsed == null) collapsed = !state.sidebar.collapsed;
      state.sidebar.collapsed = collapsed;
      window.sessionStorage.setItem("state.sidebar.collapsed",collapsed)
    },
    [types.TOGGLE_SIDEBAR_SHOW] (state,show) {
      if (show == null) state.sidebar.show = !state.sidebar.show;
      else{
        state.sidebar.show = show;
      }
      window.sessionStorage.setItem("state.sidebar.show",state.sidebar.show)
    },
    [types.FRONTEND_PERMISSION_ALLS] (state,fp) {
      state.adminFps = fp;
    }
  }, actions: {
    //异步的函数
    toggleLoading: ({commit}) => commit(types.TOGGLE_LOADING),
    loadMenuList: ({commit}) => {
      sysApi.menueTree({}).then(res => {
          commit(types.LOAD_MENU, res);
        })
    },
    loadAdmins:({commit}) => {
      sysApi.adminList({}).then(res => {
        commit(types.LOAD_ADMINS, res.data);
      })
    },
    loadAdminRolesTree:({commit}) => {
      sysApi.roleTree({}).then(res => {
        commit(types.LOAD_ADMINROLES, res.data);
      })
    },
    loadAdminDepartmentTree:({commit}) => {
      sysApi.adminDepartmentTree({}).then(res => {
        commit(types.LOAD_ADMINDEPARTMENT_TREE, formateDepartmentData(res.data));
      })
    },
    loadFpsAll:({commit}) => {
      sysApi.getFrontPermissions({}).then(res => {
        commit(types.FRONTEND_PERMISSION_ALLS, res.result.rows);
      })
    },
    permissionsTree:({commit}) => {
      sysApi.permissionsList({}).then(res => {
        commit(types.LOAD_PERMISSIONSTREE, formatePermissionsData(res));
      })
    },
    changeCurrentMenu: ({state,commit},{path,matched,fullPath}) => {
      const a = getCurrentMenu(fullPath,state.menuList);
      commit(types.LOAD_CURRENT_MENU, a.reverse());
    }
  },
})

export default store
