<template>
  <imp-panel>
          <el-form ref="form-hrty" :model="form"   label-width="100px">
          <el-form-item label="彩种名称" prop="lottery_cnname">
            <el-input v-model="name" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="奖期期号" prop="lottery_cnname">
            <el-input v-model="trueno" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="异常原因" prop="type">
              <el-radio-group v-model="type" >
                <el-radio :label="1">手工录号</el-radio>
                <el-radio :label="2">开奖号码错误</el-radio>
                <el-radio :label="3">提前开奖</el-radio>
                <el-radio :label="4">官方未开奖</el-radio>
              </el-radio-group>
          </el-form-item>
          <template v-if="type == 1 || type == 2">
            <el-form-item label="正确开奖号码"  prop="no">
              <el-input v-model="no" :disabled="false"></el-input>
            </el-form-item>
          </template>
          <template v-if="type == 3">
            <el-form-item label="官方实际开奖时间">
              <el-date-picker
                v-model="time"
                type="datetime"
                placeholder="实际开奖时间">
              </el-date-picker>
            </el-form-item>
          </template>
          <el-form-item label="备注">
            <el-input v-model="remark" placeholder="请输入奖期异常处理备注"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">提交</el-button>
            <el-button @click="tobaba({ac:true})">取消</el-button>
          </el-form-item>
        </el-form>
  </imp-panel>
</template>
<script>

  import panel from "@/components/panel.vue"
  import selectTree from "@/components/selectTree.vue"
  import treeter from "@/components/treeter"
  import * as sysApi from '@/services/sys'
  import * as api from "@/api"
  import { formateRoleData } from '@/common/utils'
  import * as fbTool from '@/common/fontendUi'
  import { mapGetters } from 'vuex'
  import { mapActions } from 'vuex'
  import axios from "@/common/axios";

  export default {
    mixins: [treeter],
    components: {
      'imp-panel': panel,
      'el-select-tree': selectTree
    },
    data(){
      return {
        lottery_id:null,
        type: null,
        cities: ['上海', '北京', '广州', '深圳'],
        name:null,
        obj:null,
        trueno:null,
        no:null,
        time: null,
        remark:'',
        loading: true,
        form: {
          depart_id: null,
          admin_name:'',
          role_id:null
        },
        fpUi:null,
        options: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
        value: ''
      }
    },
    computed: {
      ...mapGetters([
        'adminFps'
      ])
    },
    watch:{
      type(val){
        console.log(val)
      }
    },
    mounted() {
      this.obj = JSON.parse(window.localStorage.getItem('award_monitoring_exception'))
      this.name = this.obj.lottery_cnname
      this.no = this.obj.id
      this.trueno = this.obj.official_issue_code
    },
    methods: {
      tobaba(msg){//{ac:1,mg:'msg'}1:关闭，2：弹出消息
        this.$emit('dialogMsg',msg)
      },
      ggregrt(val){
        console.log(val)
      },
      generateLottery(data){
        this.generateVisible = true
        this.row = data
      },
      pageclick(data){
        this.pageNum = data
        this.load()
      },
      modifyClick(data){
        this.modifyVisible = true
        this.modifyData = data
      },
      getOptions(){
        axios.post(api.AWARD_ENABLED_LIST,{})
          .then(res => {
            console.log(res)
          let array = []
            for(let i in res.data.rows){
              array.push({value:res.data.rows[i].id,label:res.data.rows[i].lottery_cnname})
            }
            this.options = array
          }).catch(e => {
            this.$message(e);
        })
      },
      generatePrize(data){
        this.generateVisible = true
        this.row = data
      },
      add(){
        this.$router.push({ path: '/award/add'})
      },
      modify(row){
        window.localStorage.lottory_award_modify = row.lottery_id
        this.$router.push({ path: '/award/modify'})
      },
      logClick(row){
        window.localStorage.lottory_Awardperiod = row.lottery_id
        this.$router.push({ path: '/award/award-search'}) // -> /user/123
      },
      dialogFoo(data){
        if(data.ac){
          this.generateVisible = false
          this.modifyVisible = false
          // this.load()
        }else{
          this.$message(data.mg);
        }
      },
      onSubmit(){
        let parms = {}
        parms.actual_bonus_start_time = this.time
        parms.issue_id = this.obj.lottoryId
        parms.type = this.type
        parms.remark = this.remark
        parms.win_code = this.trueno
        axios.post(api.SYS_DEPARTMENT_ADD, parms)
          .then(res => {
            this.tobaba({ac:true})
            this.$message('添加成功！');
          }).catch(e => {
            this.tobaba({ac:false,mg:'添加失败!'})
        })
      },
      load(){
        var  parms = {}
        parms.pageNum = this.pageNum
        parms.pageSize = this.pageSize
        axios.post(api.AWARD_LIST, parms)
          .then(res => {
            console.log(res)
            this.loading = false
            this.lottory = res.data.rows.lotteryList
            this.total = ~~res.data.rows.totle
          }).catch(e => {
            
        })
      }
    },
    created(){
      this.load();
      this.getOptions();
    }
  }
</script>

<style>

h3 div span{
  float: left;
  line-height: 40px;
  margin-right: 10px;
}
 .log .el-dialog--small{
    width: 980px;
  }
  .content{
    width: 100%;
  }
  .el-input.is-disabled .el-input__inner{
    width: 200px;
  }
  .el-form-item__label{
    width: 200px;
  }
</style>
