<template>
  <imp-panel>
    <div id="container"></div>
    <el-button type="primary" @click="onSubmit">提交</el-button>
  </imp-panel>
</template>
<script>

  import panel from "@/components/panel.vue"
  import selectTree from "@/components/selectTree.vue"
  import treeter from "@/components/treeter"
  import treeSelect from "@/components/tree.vue"
  import * as sysApi from '@/services/sys'
  import * as api from "@/api"
  import { formateRoleData } from '@/common/utils'
  import { mapGetters } from 'vuex'
  import { mapActions } from 'vuex'
  import axios from "@/common/axios";
  import { formatePermissionsData } from '@/common/utils'
  import calendar from '@/components/calendar.vue'

  export default {
    mixins: [treeter],
    components: {
      'imp-panel': panel,
      'el-select-tree': selectTree,
      'tree-select':treeSelect,
      calendar
    },
    data(){
      return {
        form: {
          dateFormat:'yy',
          numberCleaning: 'm',
          zeroPadding: '1',
          number: '1'
        },
        bf:null,
      }
    },
    mounted() {
       this.dstg();
    },
    methods: {
      showData(){
        let bf =this.bf
        window.alert(JSON.stringify(bf.getData()));
      },
      dstg(){
        var schema = {
          "type": "object",
          "properties": {
            "name": {
              "title": "插件名称",
              "description":"转账渠道处理插件的名称,对应渠道账号的所属类型",
              "required": true,
              "type": "string"
            },
            "description": {
              "title": "插件描述",
              "description":"转账渠道处理插件的功能描述",
              "required": false,
              "type": "string",
              "format": "text"
            },
            "value": {
              "title": "配置值",
              "description":"转账渠道处理插件的配置值,对应渠道账号的所属类型",
              "required": true,
              "type": "string"
            },
            "mode": {
              "title": "转账模式",
              "description":"该插件套用的转账模式逻辑",
              "required": true,
              "type": "number",
              "enum": [
                {"text":"银行卡收款","value":0x0000},
                {"text":"第三方渠道收款","value":0x0001}
              ]
            },
            "type": {
              "title": "插件类型",
              "description":"执行该插件的程序语言",
              "required": true,
              "type": "string",
              "enum": [
                {"text":"Java","value":"0"},
                {"text":"Python","value":"1"}
              ]
            },
            "spec": {
              "title": "字段规格",
              "description":"渠道账号的字段定义",
              "required": true,
              "type": "string",
              "format": "text"
            },
            "content": {
              "title": "插件内容",
              "description":"如果插件类型为Java,输入插件对应的Java类名;如果插件类型为Python,输入插件在交易处理过程中执行的Python代码",
              "required": true,
              "type": "string",
              "format": "text"
            }
          }
        }
        //var schema = {"type": "boolean"}
        
        var BrutusinForms = brutusin["json-forms"];
        this.bf = BrutusinForms.create(schema);
        var container = document.getElementById('container');

        // bf.render(container); // render without initial data
        this.bf.render(container, {
        "name":"",
        "value":"0",
        "mode":"0",
        "type":0
        }); // render without initial data
      },
      onSubmit(){
        let bf =this.bf
        console.log(bf.validate())
        if(bf.validate()){
          axios.post(api.RECHARGE_MERCHANT_LIST, bf.getData())
          .then(res => {
            console.log(res)
            this.$message('添加成功！');
          }).catch(e => {
            this.$message(e);
          })
        }
      }
    },
    watch:{
    }
  }
</script>

<style>
.geshi{
  display: -webkit-box;
  margin:10px 0;
}
#award-add{
  width: 981px;
  border-radius: 5px;
  padding: 20px;
  border: 1px solid #d2d6de;
}
.el-button--primary{
  margin-left:200px; 
}
</style>
