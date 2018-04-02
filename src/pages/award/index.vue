<template>

  <imp-panel>
    <h3 class="box-title" slot="header" style="width: 100%;text-align:right">
<!--       <div>
        <span>彩种</span>
        <el-select v-model="value" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div> -->
      <el-button type="primary" v-if="!!fpUi&&fpUi.add.state" icon="plus" @click="add">新增奖期规则</el-button>
    </h3>
     <el-table
    :data="lottory"
    border
    style="width: 100%"
     v-loading="loading">
    <el-table-column
      type="index"
      width="100">
    </el-table-column>
    
    <el-table-column
      prop="lottery_cnname"
      label="彩种"
      width="150">
    </el-table-column>
    <el-table-column
      prop="lottery_enname"
      label="英文简称"
      width="150">
    </el-table-column>
    <el-table-column
      prop="belong_date"
      label="最后奖期日期"
      width="180">
    </el-table-column>
    <el-table-column
      prop="official_issue_code"
      label="最后奖期期号"
      width="180">
    </el-table-column>
    <el-table-column
      prop="create_by"
      label="最后修改人"
      width="200">
    </el-table-column>
    <el-table-column
      label="最后修改时间"
      prop="create_time"
      width="200">
    </el-table-column>
    <el-table-column
      fixed="right"
      label="操作"
      >
      <template slot-scope="scope">
        <el-button @click="modify(scope.row)" type="text" size="small">奖期规则修改</el-button>
        <el-button @click="generateLottery(scope.row)" type="text" size="small">奖期生成</el-button>
        <el-button @click="logClick(scope.row)" type="text" size="small">奖期查看</el-button>
      </template>
    </el-table-column>
  </el-table>
    <div id="log" class="log" v-if="generateVisible">
       <el-dialog title="奖期生成" :visible.sync="generateVisible" width="80%">
        <generate-dialog :child-msg="row" v-on:dialogMsg="dialogFoo"></generate-dialog>
      </el-dialog>
    </div>
    <el-dialog class="log" title="增加奖期规则" :visible.sync="outerVisible">
      <add-award v-on:dialogMsg="dialogFoo"></add-award>
    </el-dialog>
    <el-dialog class="log" title="修改奖期规则" :visible.sync="modifyVisible">
      <modify :child-msg="modifyData" v-on:dialogMsg="dialogFoo"></modify>
    </el-dialog>

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
  import * as fbTool from '@/common/fontendUi'
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
        pageNum: 1,
        pageSize:15,
        loading: true,
        lottory:[],
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
        fpUi:null,
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
    computed: {
      ...mapGetters([
        'adminFps'
      ])
    },
    watch:{
      adminFps(val){
        if(val){
          this.fpUi = fbTool.queryUi(fbTool.fpUi.award,val)
        }
      }
    },
    mounted() {
      let adminFps = this.$store.state.adminFps
      this.fpUi = fbTool.queryUi(fbTool.fpUi.award,adminFps)
    },
    methods: {
      tobaba(msg){//{ac:1,mg:'msg'}1:关闭，2：弹出消息
        this.$emit('dialogMsg',msg)
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
        this.form.parent_id = this.childMsg.id
        this.$http.post(api.SYS_DEPARTMENT_ADD, this.form)
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
 .log .el-dialog--small{
    width: 980px;
  }
  .content{
    width: 100%;
  }
</style>
