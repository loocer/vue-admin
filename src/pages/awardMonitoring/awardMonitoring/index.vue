<template>

    <imp-panel>
        <ul id="myTab" class="nav nav-tabs">
          <li class="active">
            <a href="#aa" data-toggle="tab">奖期监控</a></li>
          <li><a href="#bb" data-toggle="tab">未处理异常</a></li>
          <li><a href="#cc" data-toggle="tab">已处理异常</a></li>
        </ul>
        <div id="myTabContent" class="tab-content">
          <div class="tab-pane fade in active" id="aa">
              <h5 class="box-title" slot="header" style="width: 100%;text-align:right">
                  <div class="caizhong" if="options">
                    <span>彩种</span>
                    <el-select v-model="lottery_id" placeholder="请选择">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </div>
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
                    <button type="button" @click="loadad1(1)" class="btn btn-default">查询</button>
                  </div>
                  <el-checkbox v-model="checked">自动刷新</el-checkbox>
                </h5>
                 <el-table
                :data="lottory1"
                border
                style="width: 100%"
                 v-loading="loading">
                <el-table-column
                  type="index"
                  width="60">
                </el-table-column>
                
                <el-table-column
                  prop="lottery_cnname"
                  label="彩种"
                  width="150">
                </el-table-column>
                <el-table-column
                  prop="official_issue_code"
                  label="奖期期号"
                  width="150">
                </el-table-column>
                <el-table-column
                  prop="belong_date"
                  label="理论开奖时间"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="win_code"
                  label="开奖号码"
                  width="120">
                </el-table-column>
                <el-table-column
                  prop="win_code_type_name"
                  label="状态"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="create_by"
                  label="操作人"
                  width="100">
                </el-table-column>
                <el-table-column
                  label="操作时间"
                  prop="verify_time"
                  width="200">
                </el-table-column>
                <el-table-column
                  label="备注"
                  prop="remark"
                  width="200">
                </el-table-column>
                <el-table-column
                  fixed="right"
                  label="操作"
                  >
                  <template slot-scope="scope">
                    <el-button @click="modify(scope.row)" type="text" size="small">输入实际开奖号码</el-button>
                    <el-button @click="logClick(scope.row)" type="text" size="small">奖期日志</el-button>
                  </template>
                </el-table-column>
              </el-table>

              <el-pagination style="float:right;margin-top:30px;"
                layout="prev, pager, next"
                @current-change="pageclick"
                :page-size="pageSize"
                :total="total">
              </el-pagination>



          </div>
          <div class="tab-pane fade" id="bb">
            

                <h5 class="box-title" slot="header" style="width: 100%;text-align:right">
                  <div class="caizhong">
                    <span>彩种</span>
                    <el-select v-model="lottery_id" placeholder="请选择">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </div>
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
                    <button type="button" @click="loadad2(2)" class="btn btn-default">查询</button>
                  </div>
                  <el-checkbox v-model="checked">自动刷新</el-checkbox>
                </h5>
                <el-table
                :data="lottory2"
                border
                style="width: 100%"
                 v-loading="loading">
                <el-table-column
                  type="index"
                  width="60">
                </el-table-column>
                
                <el-table-column
                  prop="lottery_cnname"
                  label="彩种"
                  width="150">
                </el-table-column>
                <el-table-column
                  prop="official_issue_code"
                  label="奖期期号"
                  width="150">
                </el-table-column>
                <el-table-column
                  prop="belong_date"
                  label="理论开奖时间"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="win_code"
                  label="开奖号码"
                  width="120">
                </el-table-column>
                <el-table-column
                  prop="win_code_type_name"
                  label="状态"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="create_by"
                  label="操作人"
                  width="100">
                </el-table-column>
                <el-table-column
                  label="操作时间"
                  prop="verify_time"
                  width="200">
                </el-table-column>
                <el-table-column
                  label="备注"
                  prop="remark"
                  width="200">
                </el-table-column>
                <el-table-column
                  fixed="right"
                  label="操作"
                  >
                  <template slot-scope="scope">
                    <el-button @click="modify(scope.row)" type="text" size="small">输入实际开奖号码</el-button>
                    <el-button @click="logClick(scope.row)" type="text" size="small">奖期日志</el-button>
                  </template>
                </el-table-column>
              </el-table>

              <el-pagination style="float:right;margin-top:30px;"
                layout="prev, pager, next"
                @current-change="pageclick"
                :page-size="pageSize"
                :total="total">
              </el-pagination>





          </div>
          <div class="tab-pane fade" id="cc">
            <h5 class="box-title" slot="header" style="width: 100%;text-align:right">
                  <div class="caizhong">
                    <span>彩种</span>
                    <el-select v-model="lottery_id" placeholder="请选择">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </div>
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
                    <button type="button" @click="loadad3(3)" class="btn btn-default">查询</button>
                  </div>
                  <el-checkbox v-model="checked">自动刷新</el-checkbox>
                </h5>
                <el-table
                :data="lottory3"
                border
                style="width: 100%"
                 v-loading="loading">
                <el-table-column
                  type="index"
                  width="60">
                </el-table-column>
                
                <el-table-column
                  prop="lottery_cnname"
                  label="彩种"
                  width="150">
                </el-table-column>
                <el-table-column
                  prop="official_issue_code"
                  label="奖期期号"
                  width="150">
                </el-table-column>
                <el-table-column
                  prop="belong_date"
                  label="理论开奖时间"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="win_code"
                  label="开奖号码"
                  width="120">
                </el-table-column>
                <el-table-column
                  prop="win_code_type_name"
                  label="状态"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="create_by"
                  label="操作人"
                  width="100">
                </el-table-column>
                <el-table-column
                  label="操作时间"
                  prop="verify_time"
                  width="200">
                </el-table-column>
                <el-table-column
                  label="备注"
                  prop="remark"
                  width="200">
                </el-table-column>
                <el-table-column
                  fixed="right"
                  label="操作"
                  >
                  <template slot-scope="scope">
                    <el-button @click="modify(scope.row)" type="text" size="small">输入实际开奖号码</el-button>
                    <el-button @click="logClick(scope.row)" type="text" size="small">奖期日志</el-button>
                  </template>
                </el-table-column>
              </el-table>

              <el-pagination style="float:right;margin-top:30px;"
                layout="prev, pager, next"
                @current-change="pageclick"
                :page-size="pageSize"
                :total="total">
              </el-pagination>
          </div>
          <div class="tab-pane fade" id="ejb">
            <p>Enterprise Java Beans（EJB）是一个创建高度可扩展性和强大企业级应用程序的开发架构，部署在兼容应用程序服务器（比如 JBOSS、Web Logic 等）的 J2EE 上。
            </p>
          </div>
        </div>




      
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
        generateVisible:false,
        outerVisible:false, 
        modifyVisible:false,
        modifyData: null,
        total:10,
        value3:null,
        checked: true,
        lottory1:[],
        lottory2:[],
        lottory2:[],
        lottery_id:'1',
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
      },
      options(val){
        console.log(val)
        console.log(44)
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
        let obj = {}
        obj.id = row.id
        obj.lottery_cnname = row.lottery_cnname
        obj.official_issue_code = row.official_issue_code
        window.localStorage.setItem('award_monitoring_exception',JSON.stringify(obj));
        this.$router.push({ path: '/awardMonitoring/award-exception'})
      },
      logClick(row){
        window.localStorage.lottory_Awardperiod_log = row.id
        this.$router.push({ path: '/awardMonitoring/award-log'}) // -> /user/123
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
      loadad1(type){
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
        parms.lottery_id =this.lottery_id
        parms.type = type
        axios.post(api.AWARO_ISSUEINFO_PAGE, parms)
          .then(res => {
            console.log(res)
             this.loading = false
            this.total = ~~res.data.rows.totle
            this.lottory1 = res.data.rows.issueInfoList
          }).catch(e => {
            this.$message(e);
        })



        // var  parms = {}
        // parms.pageNum = this.pageNum
        // parms.pageSize = this.pageSize
        // axios.post(api.AWARD_LIST, parms)
        //   .then(res => {
        //     console.log(res)
           
        //     this.lottory = res.data.rows.lotteryList
        //     this.total = ~~res.data.rows.totle
        //   }).catch(e => {
            
        // })
      },
      loadad2(type){
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
        parms.lottery_id =this.lottery_id
        parms.type = type
        axios.post(api.AWARO_ISSUEINFO_PAGE, parms)
          .then(res => {
            console.log(res)
             this.loading = false
            this.total = ~~res.data.rows.totle
            this.lottory2 = res.data.rows.issueInfoList
          }).catch(e => {
            this.$message(e);
        })



        // var  parms = {}
        // parms.pageNum = this.pageNum
        // parms.pageSize = this.pageSize
        // axios.post(api.AWARD_LIST, parms)
        //   .then(res => {
        //     console.log(res)
           
        //     this.lottory = res.data.rows.lotteryList
        //     this.total = ~~res.data.rows.totle
        //   }).catch(e => {
            
        // })
      },
      loadad3(type){
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
        parms.lottery_id =this.lottery_id
        parms.type = type
        axios.post(api.AWARO_ISSUEINFO_PAGE, parms)
          .then(res => {
            console.log(res)
             this.loading = false
            this.total = ~~res.data.rows.totle
            this.lottory3 = res.data.rows.issueInfoList
          }).catch(e => {
            this.$message(e);
        })



        // var  parms = {}
        // parms.pageNum = this.pageNum
        // parms.pageSize = this.pageSize
        // axios.post(api.AWARD_LIST, parms)
        //   .then(res => {
        //     console.log(res)
           
        //     this.lottory = res.data.rows.lotteryList
        //     this.total = ~~res.data.rows.totle
        //   }).catch(e => {
            
        // })
      }
    },
    created(){
      this.loadad1(1);
      this.loadad2(2);
      this.loadad3(3);
      this.getOptions();
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
h5 div{
  float: left;
}
h5 div span{
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
  .el-checkbox{
    line-height: 50px;
  }
  .tab-content{
    padding: 20px;
  }
  .caizhong{
    margin-right: 30px;
  }
</style>
