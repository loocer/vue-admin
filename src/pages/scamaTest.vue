<template lang="html">
   <div id="container">
     
   </div>
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
    mounted() {
      this.dstg();
      // this.adminArray = this.$store.state.admins
      // this.$store.dispatch('loadAdmins')
    },
    methods: {
      dstg(){
        // var schema = {
        //           "oneOf": [
        //             {
        //               "title":"银行卡",
        //           "type":"object",
        //           "properties": {
        //               "type":{
        //                 "title":"插件类型",
        //                 "description":"内置设定值", // ${TransferAddon.value}
        //                 "type":"string",
        //                 "default":"0",
        //                 "required":true,
        //                 "readOnly":true
        //               },
        //               "name":{
        //                 "title":"渠道名称",
        //                 "description":"前台展示的支付渠道名称",
        //                 "type":"string",
        //                 "require":true
        //               },
        //               "icon":{
        //                 "title":"渠道图标",
        //                 "format":"inputstream",
        //                 "type":"string",
        //                 "description":"前台展示的支付渠道图片"
        //               }
        //               // ${TransferAddon.spec}
        //             }
        //         },{
        //           "title":"第三方",
        //           "type":"object",
        //           "properties": {"partnerID": {
        //           "type": "string",
        //           "title": "商户ID",
        //           "description": "支付系统提供给商户的ID号",
        //           "required": true
        //         },
        //         "noticeUrl": {
        //           "type": "string",
        //           "title": "商户通知地址",
        //           "description": "通知商户处理结果的通知地址",
        //           "required": true
        //         },
        //         "returnUrl": {
        //           "type": "string",
        //           "title": "商户回调地址",
        //           "description": "商户显示用回调地址,用于在客户支付完成后跳转回商户指定的URL",
        //           "required": true
        //         },
        //         "displayName": {
        //           "type": "string",
        //           "title": "商户显示名",
        //           "description": "用于在支付系统中显示卖家姓名,公司名等信息"
        //         },
        //         "goodsName": {
        //           "type": "string",
        //           "title": "商品名称",
        //           "description": "订单货品的名称",
        //           "required": true
        //         },
        //         "failureTime": {
        //           "type": "number",
        //           "title": "订单有效期(天)",
        //           "description": "订单最后失效时间"
        //         },
        //         "cert": {
        //           "type": "string",
        //           "format": "inputstream",
        //           "title": "密钥文件",
        //           "description": "支付平台提供给商户的密钥文件"
        //         },
        //         "customerIP": {
        //           "type": "string",
        //           "title": "客户下单域名及IP",
        //           "description": "客户在商户下单域名及IP(防钓鱼); 例如:www.google.com[192.168.1.2]"
        //         }
        //       }
        //     }
        //   ]
        // }
         var schema = {
                  "oneOf": [
                    {
                      "title":"银行卡",
                  "type":"object",
                  "properties": {
                      "type":{
                        "title":"插件类型",
                        "description":"内置设定值", // ${TransferAddon.value}
                        "type":"string",
                        "default":"0",
                        "required":true,
                        "readOnly":true
                      }
                      // ${TransferAddon.spec}
                    }
                }
          ]
        }
        //var schema = {"type": "boolean"}
        var BrutusinForms = brutusin["json-forms"]
        var bf = BrutusinForms.create(schema)
        var container = document.getElementById('container');
        bf.render(container,{});
      }
    }
  }
</script>

<style>
  
</style>
