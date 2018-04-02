<template>

  <imp-panel>
      <div id="container2">

      </div>
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
        rules: {
          lottery_cnname: [
            { required: true, message: '请输入彩种名称', trigger: 'blur' },
            { min: 3, max: 30, message: '长度至少为3个字符', trigger: 'blur' }
          ],
          lottery_enname: [
            { required: true, message: '请输入彩种英文名', trigger: 'blur' },
            { min: 3, max: 30, message: '长度至少为3个字符', trigger: 'blur' }
          ],
          loteryTime: [
            { required: true, message: '请选择时间', trigger: 'blur' },
            { min: 3, max: 30, message: ' 哈哈', trigger: 'blur' }
          ]
        },
        optionsDate: [{
          value: '',
          label: '(空)'
        },{
          value: 'yy',
          label: 'yy'
        }, {
          value: 'yy/',
          label: 'yy/'
        }, {
          value: 'yyyy',
          label: 'yyyy'
        }, {
          value: 'yyMMdd',
          label: 'yyMMdd'
        }, {
          value: 'yyyyMMdd',
          label: 'yyyyMMdd'
        },{
          value: 'yyyyMMdd-',
          label: 'yyyyMMdd-'
        }],
        schema:null
      }
    },
    mounted() {
      this.createSchema()
    },
    methods: {
      tobaba(msg){
        this.$emit('dialogMsg',msg)
      },
      handleNodeClick(data){
        this.form = data;
      },
      createSchema(){
        let temp = this
        axios.get(api.RECHARGE_MERCHANT_SCHEME, {})
        .then(res => {
          let sc = temp.schema =  JSON.parse(res.data.result)
          var BrutusinForms = brutusin["json-forms"];
            BrutusinForms.addDecorator(function(element, schema) {
              if (element.tagName) {
                var tagName = element.tagName.toLowerCase();
                if (tagName === "input" && schema.type === "string" && schema.format === 'inputstream') {
                  element.type = 'file';
                }
              }
            });
            console.log()
            temp.bf = BrutusinForms.create(sc);
            var container = document.getElementById('container2');
            temp.bf.render(container); // render without initial data
        }).catch(e => {
        })
      },
      setSelectedId(data){
          this.form.parent_id = data
      },
      deleteTimeData(id){
        for(let d in this.setTimeData){
          if(this.setTimeData[d].id === id){
            this.setTimeData.splice(d, 1);
          }
        }
      },
      onSubmit(){
        let bf = this.bf
        if(this.bf.validate()){
          var form = new FormData();
          for(var field in bf.getData()){
              form.append(field, bf.getData()[field]);
          }
          this.$http.post(api.FUNDACCOUNT, bf.getData())
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
      adminDepartmentTree(value){
      },
      schema(val){
        console.log(val)
        
      },
      adminArrays(value){
        if(value!=null){
          this.flag = true
        }
      }
    },
    created(){
      
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
</style>
