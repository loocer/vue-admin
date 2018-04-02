<template>
  <imp-panel>
      <el-form ref="form-hrty" :model="form"   label-width="100px">
          <el-form-item label="彩种名称" prop="lottery_cnname">
            <el-select v-model="lottery_id" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="奖期期号" prop="lottery_cnname">
            <el-select v-model="lottery_no" placeholder="请选择">
              <el-option
                v-for="item in optionsNO"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
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




          <!-- <el-form ref="form-hrty" :model="form"   label-width="100px">
          
          <el-form-item label="奖期期号" prop="lottery_cnname">
            <el-select v-model="lottery_id" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="异常原因" prop="lottery_cnname">
              <el-radio-group v-model="radio2">
                <el-radio :label="3">备选项</el-radio>
                <el-radio :label="6">备选项</el-radio>
                <el-radio :label="9">备选项</el-radio>
              </el-radio-group>
          </el-form-item>
          <el-form-item label="官方实际开奖时间"  required>
            <el-date-picker
              v-model="value1"
              type="datetime"
              placeholder="实际开奖时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="form.lottery_desc" placeholder="请输入奖期异常处理备注"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">提交</el-button>
            <el-button @click="tobaba({ac:true})">取消</el-button>
          </el-form-item>
        </el-form> -->
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
        radio2: null,
        cities: ['上海', '北京', '广州', '深圳'],
        generateVisible:false,
        outerVisible:false, 
        modifyVisible:false,
        modifyData: null,
        optionsNO: null,
        lottery_no:null,
        total:10,
        type:null,
        remark:null,
        trueno:null,
        no:null,
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
      lottery_id(val){
        console.log(54545)
        this.getNoOptions();
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
      getNoOptions(){
        let obj = {}
        obj.lottery_id = this.lottery_id
        axios.post(api.AWARD_REVISELIST,obj)
          .then(res => {
            console.log(res)
            let array = []
            for(let i in res.data.rows){
              array.push({value:res.data.rows[i].id,label:res.data.rows[i].official_issue_code})
            }
            this.optionsNO = array
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
      this.getOptions();
      this.getNoOptions();
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
  .el-form-item__label{
    width: 200px;
  }
</style>
