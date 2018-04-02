import axios from "../common/axios";
import * as api from "../api";
import defaultValue from "./default";
import {formateMenueData} from '../common/utils'

export function login (params) {
  return new Promise((resolve, reject) => {
    axios.post(api.LOGIN, params).then(response => {
      resolve(response.data);
    }, err => {
      resolve(err);
    })
      .catch((error) => {
        resolve(error)
      })
  })
}
export function getMenues () {
  return new Promise((resolve, reject) => {
    axios.get(api.SYS_MENU_LIST).then(response => {
      let d = formateMenueData(response.data.result.rows)
      resolve(d);
    }, err => {
      resolve("失败了！");
    })
      .catch((error) => {
        resolve("失败了！")
      })
  })
}
export function menueTree (params) {
  return new Promise((resolve, reject) => {
    axios.put(api.MSG_TOP_TEN, { params }).then(response => {
      console.log(response)
      let d = formateMenueData(response.data.result)
      resolve(d);
    }, err => {
      resolve(defaultValue.msgList);
    })
      .catch((error) => {
        resolve(defaultValue.msgList)
      })
  })
}


export function menuList (params) {
  return new Promise((resolve, reject) => {
    axios.get(api.SYS_MENU_LIST, { params }).then(response => {
      resolve(response.data.result.rows);
    }, err => {
      resolve(defaultValue.menuList);
    })
      .catch((error) => {
        resolve(defaultValue.menuList)
      })
  })
}

export function getFrontPermissions (params) {
  return new Promise((resolve, reject) => {
    axios.get(api.SYS_FRONTEND_PERMISSION_ALL).then(response => {
      resolve(response.data);
    }, err => {
      resolve(err);
    })
      .catch((error) => {
        resolve(defaultValue.menuList)
      })
  })
}

export function permissionsList (params) {
  return new Promise((resolve, reject) => {
    axios.put(api.SYS_PERMISSION_TREE, { params }).then(response => {
      resolve(response.data.result);
    }, err => {
      resolve(defaultValue.menuList);
    })
      .catch((error) => {
        resolve(defaultValue.menuList)
      })
  })
}

export function resourcePtree (params) {
  return new Promise((resolve, reject) => {
    axios.put(api.SYS_ADMINFRONTENDPERMISSION_GET, params).then(response => {
      resolve(response.data.result);
    }, err => {
      resolve(defaultValue.resource);
    })
      .catch((error) => {
        resolve(defaultValue.resource)
      })
  })
}

export function roleTree (params) {
  return new Promise((resolve, reject) => {
    axios.put(api.SYS_ROLE_TREE, params).then(response => {
      resolve(response.data);
    }, err => {
      resolve(defaultValue.roleList);
    })
      .catch((error) => {
        resolve(defaultValue.roleList)
      })
  })
}

export function adminList (params) {
  return new Promise((resolve, reject) => {
    axios.put(api.SYS_ADMINS_GET, params).then(response => {
      console.log(response)
      resolve(response.data.result);
    }, err => {
      resolve('获取数据失败哦');
    })
      .catch((error) => {
        resolve('获取数据失败哦')
      })
  })
}

export function logList (params) {
  return new Promise((resolve, reject) => {
    axios.put(api.SYS_ADMINS_LOG + params.adminId + '/logs', params).then(response => {
      console.log(response)
      resolve(response.data);
    }, err => {
      resolve('获取数据失败哦');
    })
      .catch((error) => {
        resolve('获取数据失败哦')
      })
  })
}

export function adminRoleList (params) {
  return new Promise((resolve, reject) => {
    axios.put(api.SYS_ADMIN_ROLE_GET, params).then(response => {
      console.log(response)
      resolve(response.data.result);
    }, err => {
      resolve('获取数据失败哦');
    })
      .catch((error) => {
        resolve('获取数据失败哦')
      })
  })
}

export function adminDepartmentList (params) {
  return new Promise((resolve, reject) => {
    axios.put(api.SYS_DEPARTMENT_GET,  params ).then(response => {
      resolve(response.data.result);
    }, err => {
      resolve('获取数据失败哦');
    })
      .catch((error) => {
        resolve('获取数据失败哦')
      })
  })
}
export function adminDepartmentTree (params) {
  return new Promise((resolve, reject) => {
    axios.put(api.SYS_DEPARTMENT_TREE, {}).then(response => {
      console.log(response)
      resolve(response.data.result);
    }, err => {
      resolve('获取数据失败哦');
    })
      .catch((error) => {
        resolve('获取数据失败哦')
      })
  })
}
