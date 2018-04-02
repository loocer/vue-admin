<template>

  <imp-panel>
      <div id="award-add">
        <el-form ref="form-hrty" :model="form"  :rules="rules" label-width="100px">
          <el-form-item label="彩种名称" prop="lottery_cnname">
            <el-input v-model="form.lottery_cnname" size="medium"></el-input>
          </el-form-item>
          <el-form-item label="彩种英文名" prop="lottery_enname">
            <el-input v-model="form.lottery_enname"></el-input>
          </el-form-item>
          <el-form-item label="奖期格式" >
              <div class="geshi" >
                <div class="col-xs-6" 
                   style="box-shadow: 
                   inset 1px -1px 1px #444, inset -1px 1px 1px #444;">

                   <div class="col-xs-4" 
                       style="box-shadow: 
                       inset 1px -1px 1px #444, inset -1px 1px 1px #444;">
                      日期前缀
                    </div>
                    <div class="col-xs-6" 
                       style="box-shadow: 
                       inset 1px -1px 1px #444, inset -1px 1px 1px #444;">
                      <el-select v-model="form.dateFormat" placeholder="请选择">
                        <el-option
                          v-for="item in optionsDate"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </div>
                </div>
                <div class="col-xs-6" 
                 style="box-shadow: 
                 inset 1px -1px 1px #444, inset -1px 1px 1px #444;">

                    <div class="col-xs-4" 
                       style="box-shadow: 
                       inset 1px -1px 1px #444, inset -1px 1px 1px #444;">
                      奖期清零规则
                    </div>
                    <div class="col-xs-6" 
                       style="box-shadow: 
                       inset 1px -1px 1px #444, inset -1px 1px 1px #444;">
                      <el-select v-model="form.numberCleaning" placeholder="请选择">
                        <el-option
                          v-for="item in  optionsRults"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </div>
                </div>
              </div>
              <div class="geshi" >
                <div class="col-xs-6" 
                 style="box-shadow: 
                 inset 1px -1px 1px #444, inset -1px 1px 1px #444;">

                   <div class="col-xs-4" 
                       style="box-shadow: 
                       inset 1px -1px 1px #444, inset -1px 1px 1px #444;">
                      奖期补零规则
                    </div>
                    <div class="col-xs-6" 
                       style="box-shadow: 
                       inset 1px -1px 1px #444, inset -1px 1px 1px #444;">
                      <el-select v-model="form.zeroPadding" placeholder="请选择">
                        <el-option
                          v-for="item in optionsBuling"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </div>
                </div>
                <div class="col-xs-6" 
                   style="box-shadow: 
                   inset 1px -1px 1px #444, inset -1px 1px 1px #444;" v-if="form.zeroPadding ==1">

                    <div class="col-xs-4" 
                       style="box-shadow: 
                       inset 1px -1px 1px #444, inset -1px 1px 1px #444;">
                      数字位数
                    </div>
                    <div class="col-xs-6" 
                       style="box-shadow: 
                       inset 1px -1px 1px #444, inset -1px 1px 1px #444;">
                      <el-select v-model="form.number" placeholder="请选择">
                        <el-option
                          v-for="item in optionsBulingQingling"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </div>
                </div>
              
            </div>
          </el-form-item>

          <el-form-item label="奖期时间设置"  required>
            <div v-for="(item, index) in setTimeData">
                <div class="col-xs-6 geshi" 
                   style="box-shadow: 
                   inset 1px -1px 1px #444, inset -1px 1px 1px #444;">
                  <span class="glyphicon glyphicon-minus" @click="deleteTimeData(item.id)"></span>删除此段时间设置
                </div>
                <div class="col-xs-12 geshi" 
                     style="box-shadow: 
                     inset 1px -1px 1px #444, inset -1px 1px 1px #444;">
                    销售周期（S)
                    <el-input-number v-model="item.sale_cycle" controls-position="right"  :min="1" :max="10"></el-input-number>
                </div>  
                <div class="col-xs-12 geshi" 
                     style="box-shadow: 
                     inset 1px -1px 1px #444, inset -1px 1px 1px #444;">
                     <el-form-item prop="first_issue_bonus_time_string">
                        <el-time-picker
                          v-model="item.first_issue_bonus_time_string"
                          placeholder="首期开奖时间" type="fixed-time">
                        </el-time-picker>
                      </el-form-item>
                      <el-form-item prop="last_issue_bonus_time_string">  
                         <el-time-picker
                          v-model="item.last_issue_bonus_time_string"
                          placeholder="末期开奖时间" type="fixed-time">
                        </el-time-picker>
                      </el-form-item>
                </div>
            </div>
            <div class="col-xs-6 geshi" 
                   style="box-shadow: 
                   inset 1px -1px 1px #444, inset -1px 1px 1px #444;">
                  <span class="glyphicon glyphicon-plus" @click="addSetTime"></span>新增销售时间段
                </div>
          </el-form-item>
          <el-form-item label="奖期描述">
            <el-input v-model="form.lottery_desc"></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-switch
              v-model="form.is_enabled"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">提交</el-button>
            <el-button @click="tobaba({ac:true})">取消</el-button>
          </el-form-item>
        </el-form>
    </div>
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
        optionsBulingQingling: [{
          value: 1,
          label: '1'
        }, {
          value: 2,
          label: '2'
        }, {
          value: 3,
          label: '3'
        }, {
          value: 4,
          label: '4'
        }],
        optionsBuling: [{
          value: 1,
          label: '补零'
        }, {
          value: 0,
          label: '不补零'
        }],
        optionsRults: [{
          value: 'd',
          label: '按日清零'
        }, {
          value: 'm',
          label: '按月清零'
        }, {
          value: 'y',
          label: '按年清零'
        }, {
          value: 'n',
          label: '不清零'
        }],
        setTimeData:[
          {
            id:Date.parse(new Date()),
            sale_cycle:3,
            first_issue_bonus_time_string:new Date(2016, 9, 10, 8, 40,56),
            last_issue_bonus_time_string: new Date(2016, 9, 10, 8, 40,56),
            whatDate:null
          }
        ],
        adminArrays:null,
        value2:false,
        value3: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
        flag:false,
        num8:null,
        is_enabled:true,
        defaultProps: {
          children: 'children',
          label: 'name',
          id: "id",
        },
      }
    },
    mounted() {
      this.adminArrays = this.$store.state.adminDepartmentTree
    },
    methods: {
      tobaba(msg){//{ac:1,mg:'msg'}1:关闭，2：弹出消息
        this.$emit('dialogMsg',msg)
      },
      handleNodeClick(data){
        this.form = data;
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
      addSetTime(){
        let obj = {
            id:Date.parse(new Date()),
            sale_cycle:3,
            first_issue_bonus_time:new Date(2016, 9, 10, 8, 40,56),
            last_issue_bonus_time: new Date(2016, 9, 10, 8, 40,56),
            whatDate:null
        }
        this.setTimeData.push(obj)
      },
      newAdd(){
        this.form = {
          id: null,
          parentId: null,
          name: '',
          enName: '',
          sort: 0,
          usable: '1',
          remarks: ''
        };
      },
      onSubmit(){
        this.$refs['form-hrty'].validate((valid) => {
          if (valid) {
            function trrf(time){
              return (time.getHours()<10?('0'+time.getHours()):time.getHours()) + ':' + 
              (time.getMinutes()<10?('0'+time.getMinutes()):time.getMinutes()) + ":" + 
              (time.getSeconds()<10?('0'+time.getSeconds()):time.getSeconds())
            }
            let dateArray = []
            for(let t in this.setTimeData){
              
              let obj = {}
              obj.sale_cycle = this.setTimeData[t].sale_cycle
              obj.first_issue_bonus_time_string = trrf(this.setTimeData[t].first_issue_bonus_time_string)
              obj.last_issue_bonus_time_string = trrf(this.setTimeData[t].last_issue_bonus_time_string)
              dateArray.push(obj)
            }
            this.form.issueConfigList = dateArray
            this.form.number = ~~this.form.number
            this.form.zeroPadding = ~~this.form.zeroPadding
            this.form.is_enabled = ~~this.form.is_enabled
            this.form.issueCodeRule = {
              dateFormat: this.form.dateFormat,
              number: this.form.number,
              zeroPadding:this.form.zeroPadding,
              numberCleaning: this.form.numberCleaning
            }
            console.log(this.form)
            axios.post(api.AWARD_ADD, this.form).then(res => {
                this.$message('创建成功！');
            }).catch(e => {
                console.log(e)
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
        // console.log(this.setTimeData)
        // function trrf(time){
        //   return time.getHours() + ':' + time.getMinutes() + ":" + time.getSeconds()
        // }
        // for(let t in this.setTimeData){
        //   this.setTimeData[t].first_issue_bonus_time_string = trrf(this.setTimeData[t].first_issue_bonus_time_string)
        //   this.setTimeData[t].last_issue_bonus_time_string = trrf(this.setTimeData[t].last_issue_bonus_time_string)
        // }
        // this.form.issueConfigList = this.setTimeData
        // console.log(this.form)
        // var temp = this
        // this.$http.post(api.SYS_DEPARTMENT_ADD, this.form)
        //   .then(res => {
        //     temp.form = {
        //       id: null,
        //       depart_name: null,
        //       parent_id: null,
        //       usable: '1',
        //       remarks: ''
        //     };
        //     this.tobaba({ac:true})
        //     this.$message('创建成功！');
        //   }).catch(e => {
        //     this.tobaba({ac:false,mg:'创建失败！'})
        // })
      },
      renderContent(h, {node, data, store}) {
        return (
          <span>
            <span>
              <span>{node.label}</span>
            </span>
            <span class="render-content">
              <i class="fa fa-wrench" title="配置资源" on-click={(e)=>this.settingResource(e,data.id)}></i>
              <i class="fa fa-trash" on-click={ () => this.deleteSelected(data.id) }></i>
            </span>
          </span>);
      }
    },
    watch:{
      adminDepartmentTree(value){
      },
      adminArrays(value){
        if(value!=null){
          this.flag = true
        }
      }
    },
    created(){
      // sysApi.permissionsList()
      //     .then(res=>{
      //       this.treesdf = formatePermissionsData(res.data);
      //     })
      // this.load();
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
