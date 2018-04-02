<template>

  <imp-panel>
    <h3 class="box-title" slot="header" style="width: 100%;text-align:right">
      <div>
        <span></span>
        <div class="block">
          <span class="daterange">开奖时间</span>
          <el-date-picker
            v-model="value3"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </div>
        <button type="button" @click="loadad()" class="btn btn-default">查询</button>
      </div>
    </h3>
     <el-table
    :data="rowArray"
    border
    style="width: 100%"
    @selection-change="handleSelectionChange">
    <el-table-column
          prop="id"
          type="selection"
          width="50">
        </el-table-column>
    <el-table-column
      type="index"
      label="id"
      width="200">
    </el-table-column>
    <el-table-column
      prop="lottery_cnname"
      label="彩种"
      width="200">
    </el-table-column>
     <el-table-column
      prop="official_issue_code"
      label="奖期号"
      width="250">
    </el-table-column>
    <el-table-column
      prop="official_bonus_start_time"
      label="官方理论开奖时间"
      width="250">
    </el-table-column>
    <el-table-column
      prop="create_by"
      label="创建人"
      width="200">
    </el-table-column>
    <el-table-column
      prop="create_time"
      label="创建时间"
      width="250">
    </el-table-column>
    <el-table-column
      fixed="right"
      label="操作"
      >
      <template slot-scope="scope">
        <!-- <el-button v-if="!!scope.row.win_code===false" @click="logClick(scope.row)" type="text" size="small">日志</el-button> -->
        <el-button v-if="!!scope.row.win_code===true" @click="generateLottery(scope.row)" type="text" size="small">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
    <div id="log" v-if="generateVisible">
       <el-dialog title="奖期生成" :visible.sync="generateVisible" width="80%">
        <generate-dialog :child-msg="row" v-on:dialogMsg="dialogFoo"></generate-dialog>
      </el-dialog>
    </div>
    <el-dialog title="增加奖期规则" :visible.sync="outerVisible">
      <add-award v-on:dialogMsg="dialogFoo"></add-award>
    </el-dialog>
    <el-dialog title="修改奖期规则" :visible.sync="modifyVisible">
      <modify :child-msg="modifyData" v-on:dialogMsg="dialogFoo"></modify>
    </el-dialog>
    <div class="delete-row">
      <el-button type="danger" @click="generateLottgrgtery" round>删除</el-button>
    </div>
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
        generateVisible:false,
        outerVisible:false, 
        modifyVisible:false,
        modifyData: null,
        total:10,
        caizhong:null,
        selectObj:[],
        row:null,
        value3:null,
        rowArray: [],
        pageNum: 1,
        pageSize:10,
        adminArray:[
          {
            type:'重庆时时彩',
            no:20180101055,
            lastLottryTime: '2017-11-01 09:00:00',
            lastLottry:'jeme',
            createTime:'2017-11-11 09:00:00'
          },
          {
            type:'重庆时时彩',
            no:201801016565,
            lastLottryTime: '2017-11-01 09:00:00',
            lastLottry:'jeme',
            createTime:'2017-11-11 09:00:00'
          },
          {
            type:'重庆时时彩',
            no:201456565466,
            lastLottryTime: '2017-11-01 09:00:00',
            lastLottry:'jeme',
            createTime:'2017-11-11 09:00:00'
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
    props:['childMsg'],
    methods: {
      tobaba(msg){//{ac:1,mg:'msg'}1:关闭，2：弹出消息
        this.$emit('dialogMsg',msg)
      },
      generateLottery(data){
        console.log(this.selectObj)
      },
      generateLottgrgtery(){
        let ids = []
        for(let s in this.selectObj){
          ids.push(this.selectObj[s])
        }
        axios.post(api.AWARD_ISSUE_DELETE, parms)
        .then(res => {
          this.$message('删除成功！');
          this.load()
        }).catch(e => {
            this.$message(e);
        })
        console.log(this.selectObj)
      },
      logClick(row){
        window.localStorage.lottory_Awardperiod_log = row.id
        this.$router.push({ path: '/award/award-search/award-log'}) // -> /user/123
      },
      pageclick(data){
        this.pageNum = data
        this.load()
      },
      modifyClick(data){
        this.modifyVisible = true
        this.modifyData = data
      },
      generatePrize(data){
        this.generateVisible = true
        this.row = data
      },
      handleSelectionChange(row){
        this.selectObj = row
        console.log(row)
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
      loadad(){
        var parms = {}
        var formatDate = function (date) {  
            var y = date.getFullYear();  
            var m = date.getMonth() + 1;  
            m = m < 10 ? '0' + m : m;  
            var d = date.getDate();  
            d = d < 10 ? ('0' + d) : d;  
            return y + '/' + m + '/' + d;  
        };  
        if(!!this.value3&&!!this.value3[0]&&!!this.value3[1]){
          parms.beginDate = formatDate(this.value3[0])
          parms.endDate = formatDate(this.value3[1])
        }
        parms.pageNum = this.pageNum
        parms.pageSize = this.pageSize
        parms.lottery_id = window.localStorage.lottory_Awardperiod
        parms.type = 1
        axios.post(api.AWARO_ISSUEINFO_PAGE, parms)
          .then(res => {
            console.log(res)
            this.caizhong = 
            this.rowArray = res.data.rows.issueInfoList
          }).catch(e => {
            this.$message(e);
        })
      },
      load(){

        var parms = {}
        parms.pageNum = this.pageNum
        parms.pageSize = this.pageSize
        parms.lottery_id = window.localStorage.lottory_Awardperiod
        parms.type = 1
        axios.post(api.AWARO_ISSUEINFO_PAGE, parms)
          .then(res => {
            console.log(res)
            this.caizhong = 
            this.rowArray = res.data.rows.issueInfoList
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
.block{
  margin: 0 10px;
}
.delete-row{
    width: 200px;
    position: relative;
    top: 50px;
    left: 20px;
}
</style>
