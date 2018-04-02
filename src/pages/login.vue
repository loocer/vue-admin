<template lang="html">
    <el-col :span="12" :offset="6">
      <div class="login">
        <div class="login-form">
          <div class="card-block">
            <h1><P class="text-center">B</P> </h1>
            <div class="input-group m-b-1">
              <span class="input-group-addon"><i class="fa fa-user"></i></span>
              <input type="text" class="form-control" placeholder="user name" v-model="form.account">
            </div>
            <div class="input-group m-b-2">
              <span class="input-group-addon"><i class="fa fa-lock"></i></span>
              <input type="password" class="form-control" placeholder="password" v-model="form.password"
                     @keyup.enter="login">
            </div>
            <p id="msg">{{error}}</p>
            <div class="row">
              <el-row>
                <el-col :span="12">
                  <el-button type="primary" class="btn btn-primary p-x-2" @click="login">登录</el-button>
                </el-col>
                <el-col :span="12">
                  <el-button type="button" class="btn btn-link forgot" style="float:right;">忘记密码?</el-button>
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
      </div>
    </el-col>
</template>

<script>
  import types from '../store/mutation-types'
  import * as api from "../api"
  import  auth from '../common/auth'
  import * as sysApi from '../services/sys'
  import {mapGetters, mapActions, mapMutations} from 'vuex'

  export default {
    name: 'login',
    data() {
      return {
        form: {
          account: '',
          password: ''
        },
        error: ''
      }
    },
    components: {},
    methods: {
      ...mapMutations({
        setUserInfo: types.SET_USER_INFO
      }),
      ...mapActions({
        loadMenuList: 'loadMenuList', // 映射 this.load() 为 this.$store.dispatch('loadMenuList')
        permissionsTree: 'permissionsTree'
      }),
      login(){
        var redirectUrl = '/index';
        if (this.$route.query && this.$route.query != null && this.$route.query.redirect && this.$route.query.redirect != null) {
          redirectUrl = this.$route.query.redirect;
        }
        sysApi.login(this.form).then(res => {
          if (res.httpCode === "200") {
            this.loginSuccess({...res,redirectUrl})
          } else {
            console.log(res)
            this.error = res
          }
          // this.loginSuccess({...res,redirectUrl})
        })
      },
      loginSuccess({sid,user,redirectUrl}){
        auth.login(sid);
        // window.sessionStorage.setItem("user-info", JSON.stringify(user));
        // this.setUserInfo(user);
        // this.$http.defaults.headers.common['authSid'] = sid;
        // this.loadMenuList();
        this.permissionsTree();
        redirectUrl && this.$router.push({path: redirectUrl});
      }
    }
  }
</script>

<style>
  .login {
    margin-top: 160px;
    width: 50%;
    border: 1px solid #cfd8dc;
    margin-right: auto !important;
    margin-left: auto !important;
    display: table;
    table-layout: fixed;
    background-color: #20a8d8;
  }

  .login .el-button {
    border-radius: 0;
  }

  .login .el-button.forgot, .login .el-button.forgot:hover {
    border: none;
  }

  .login .login-form {
    background-color: #FFFFFF;
    width: 100%;
    height: 100%;
    display: block;

  }

  .login .login-form .card-block {
    padding: 35px;
  }

  .login .login-form .card-block p {
    margin: 15px 0;
  }

  .input-group {
    width: 100%;
    display: table;
    border-collapse: separate;
    margin-bottom: 20px !important;
  }

  .input-group, .input-group-btn, .input-group-btn > .btn, .navbar {
    position: relative;
  }

  .input-group-addon:not(:last-child) {
    border-right: 0;
  }

  .input-group-addon, .input-group-btn {
    min-width: 40px;
    white-space: nowrap;
    vertical-align: middle;
    width: 1%;
  }

  .btn-link:focus, .btn-link:hover {
    color: #167495;
    text-decoration: underline;
    background-color: transparent;
  }

  .btn-link, .btn-link:active, .btn-link:focus, .btn-link:hover {
    border-color: transparent;
  }

  .btn.focus, .btn:focus, .btn:hover {
    text-decoration: none;
  }

  .input-group-addon {
    padding: .5rem .75rem;
    margin-bottom: 0;
    font-size: .875rem;
    font-weight: 400;
    color: #607d8b;
    text-align: center;
    background-color: #cfd8dc;
    border: 1px solid rgba(0, 0, 0, .15);
  }

  .input-group .form-control, .input-group-addon, .input-group-btn {
    display: table-cell;
  }

  .input-group .form-control {
    position: relative;
    z-index: 2;
    float: left;
    margin-bottom: 0;
  }

  .form-control {
    width: 90%;
    padding: .5rem .75rem;
    font-size: 1.5rem;
    line-height: 1.75rem;
    color: #607d8b;
    background: #fff none;
    background-clip: padding-box;
    border: 1px solid rgba(0, 0, 0, .15);
    transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
  }

  .login .login-form .card-block .row {
    display: block;
    margin: 15px 0;
  }

  .login .login-register {
    width: 100%;
    height: 100%;
    display: block;
    background-color: #20a8d8;
    color: #fff;
  }

  .login .login-register .card-block {
    text-align: center !important;
    padding: 30px;
  }

  .login .login-register .card-block p {
    text-align: left !important;
    margin: 15px 0;
    height: 100px;
  }
  #msg{
    color: red;
  }
</style>
