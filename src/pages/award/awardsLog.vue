<template>

  <imp-panel>
    <h3 class="box-title" slot="header" style="width: 100%;text-align:right">
        <div class="col-xs-3 " 
           style="box-shadow: 
           inset 1px -1px 1px #444, inset -1px 1px 1px #444;">
           <span>
            彩种：
            {{lottery_cnname}}
           </span>
        </div>
        <div class="col-xs-3 " 
           style="box-shadow: 
           inset 1px -1px 1px #444, inset -1px 1px 1px #444;">
           <span>
            奖期好号：
            {{official_issue_code}}
           </span>
        </div>
        <div class="col-xs-6 " 
           style="box-shadow: 
           inset 1px -1px 1px #444, inset -1px 1px 1px #444;">
           <span>
            理论开奖时间：
            {{official_bonus_start_time}}
           </span>
        </div>
    </h3>
     <el-table
    :data="adminArray"
    border
    style="width: 100%">
    <el-table-column
      type="index"
      width="150">
    </el-table-column>
    <el-table-column
      prop="create_time"
      label="操作时间"
      width="150">
    </el-table-column>
    <el-table-column
      prop="old_win_code"
      label="操作前号码"
      width="150">
    </el-table-column>
     <el-table-column
      prop="new_win_code"
      label="操作后号码"
      width="200">
    </el-table-column>
    <el-table-column
      prop="write_time"
      label="最后奖期日期"
      width="250">
    </el-table-column>
    <el-table-column
      prop="status"
      label="操作结果"
      width="230">
    </el-table-column>
    <el-table-column
      prop="win_code_type"
      label="操作类型"
      width="200">
    </el-table-column>
    <el-table-column
      label="操作人"
      prop="write_by">
    </el-table-column>
    
  </el-table>

    <el-pagination style="float:right;margin-top:30px;"
      layout="prev, pager, next"
      @current-change="pageclick"
      :page-size="pageSize"
      :total="total">
    </el-pagination>
  </imp-panel>
</template>
<script>

  import panel from "@/components/panel.vue"
  import selectTree from "@/components/selectTree.vue"
  import treeter from "@/components/treeter"
  import * as sysApi from '@/services/sys'
  import * as api from "@/api"
  import { formateRoleData } from '@/common/utils'
  import { mapGetters } from 'vuex'
  import { mapActions } from 'vuex'
  import axios from "@/common/axios";
  import generate from './generate'
  import add from './add'
  import modify from './modify'

  export default {
    mixins: [treeter],
    components: {
      'imp-panel': panel,
      'el-select-tree': selectTree,
      'generate-dialog': generate,
      'add-award': add,
      modify
    },
    data(){
      return {
        total:10,
        pageNum: 1,
        pageSize:10,
        lottery_cnname:null,
        official_bonus_start_time:null,
        official_issue_code:null,
        childMsg:{
          caizhong:'重庆时时彩',
          no:'14234334',
          kaijiangTime:'1965-12-04 23:43:54'
        },
        adminArray:[
          {
            id:'9',
            typeId:'023',
            type:'重庆时时彩',
            grenteType:'手动生成',
            lastLottryTime:'2018-01-01',
            lastLottry:'20180101001',
            lastTer:'比索哥',
            lastTime:'2017-11-01 09:00:00'
          },{
            id:'11',
            typeId:'042',
            type:'重庆时时彩',
            grenteType:'手动生成',
            lastLottryTime:'2018-01-01',
            lastLottry:'20180101001',
            lastTer:'大逼哥',
            lastTime:'2017-11-01 09:00:00'
          },
          {
            id:'161',
            typeId:'023',
            type:'重庆时时彩',
            grenteType:'手动生成',
            lastLottryTime:'2018-01-01',
            lastLottry:'20180101001',
            lastTer:'比索哥',
            lastTime:'2017-11-01 09:00:00'
          },{
            id:'11',
            typeId:'011',
            type:'重庆时时彩',
            grenteType:'手动生成',
            lastLottryTime:'2018-01-01',
            lastLottry:'20180101001',
            lastTer:'小逼哥',
            lastTime:'2017-11-01 09:00:00'
          }
        ],
        form: {
          depart_id: null,
          admin_name:'',
          role_id:null
        },
        pRole:[],
        value:null,
        depart_id:1,
        defaultProps: {
          children: 'children',
          label: 'name',
          id: "id",
        },
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
    methods: {
      pageclick(data){
        this.pageNum = data
        this.load()
      },
      load(){
        var  parms = {}
        // parms.pageNum = this.pageNum
        // parms.pageSize = this.pageSize
        parms.issue_id = window.localStorage.lottory_Awardperiod_log
        parms.type = 1
        axios.post(api.AWARO_ISSUEINFO_LOG, parms)
          .then(res => {
            console.log(res)
            this.adminArray = res.data.rows.data
            this.lottery_cnname = res.data.rows.lottery_cnname
            this.official_bonus_start_time = res.data.rows.official_bonus_start_time
            this.official_issue_code = res.data.rows.official_issue_code
          }).catch(e => {
            this.$message(e);
        })
      },
      onSubmit(){
        this.form.parent_id = this.childMsg.id
        this.$http.post(api.SYS_DEPARTMENT_ADD, this.form)
          .then(res => {
            this.tobaba({ac:true})
            this.$message('添加成功！');
          }).catch(e => {
            this.tobaba({ac:false,mg:'添加失败!'})
        })
      },
    },
    created(){
      this.load();
    }
  }
</script>

<style>
  .render-content {
    float: right;
    margin-right: 20px
  }

  .render-content i.fa {
    margin-left: 10px;
  }

  .render-content i.fa:hover{
    color: #e6000f;
  }

  .select-tree .el-scrollbar.is-empty .el-select-dropdown__list {
    padding: 0;
  }

  .select-tree .el-scrollbar {
    border: 1px solid #d1dbe5;
  }

  .select-tree .el-tree{
    border:0;
  }
h3 div{
  float: left;
}
h3 div span{
  float: left;
  line-height: 40px;
  margin-right: 10px;
}
</style>
