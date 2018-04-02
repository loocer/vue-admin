<template>
    <imp-panel id="award-layer">
      <el-form ref="form" :model="childMsg" label-width="80px">
        <el-form-item label="彩种名称">
          <h1>{{row.lotteryCnname}}</h1>
        </el-form-item>
      
        <el-form-item label="开奖时间" >
          <div class="time-group" v-for="(item, index) in row.issueConfigList">
            <h4>第{{index+1}}段销售时间</h4>
            <span>首期开奖时间:{{item.first_issue_bonus_time}}</span>
            <span>末期开奖时间:{{item.last_issue_bonus_time}}</span>
            <span>销售周期：{{item.sale_cycle}}秒</span>
          </div>
        </el-form-item>
        <el-form-item label="奖期生成时间">
          <input id="fdsfe" v-if="~~this.row.isHK6HC" v-model="calendar5.display" @click="openMultiByDrop($event)"></input>
          <input type="text" v-if="!~~this.row.isHK6HC" @click="openByDialog" :value="calendar4.display" readonly>
        </el-form-item>
        <el-form-item label="奖期生成开始奖期" v-if="isneedStatus">
          第<el-input v-model="beginNumber" class="begin-no" :placeholder="placeholdertext"></el-input>期(请正确输入将要生成的起始号)
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">生成奖期</el-button>
          <el-button @click="tobaba({ac:true})">取消</el-button>
        </el-form-item>
      </el-form>
       <transition name="fade">
    <div class="calendar-dropdown" :style="{'left':calendar5.left+'px','top':calendar5.top+'px'}" v-if="calendar5.show">
        <calendar :zero="calendar5.zero" :disabled="calendar5.disabled" :lunar="calendar5.lunar" :value="calendar5.value" :multi="calendar5.multi" @select="calendar5.select"></calendar>
    </div>
    <transition name="fade">
    <div class="calendar-dialog" v-if="calendar4.show">
        <div class="calendar-dialog-mask" @click="closeByDialog"></div>
        
        <div class="calendar-dialog-body">
            <calendar :range="calendar4.range" :zero="calendar4.zero" :lunar="calendar4.lunar" :value="calendar4.value"  @select="calendar4.select"></calendar>
        </div>
    </div>
    </transition>
    </transition>
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
  import calendar from '@/components/calendar.vue'
  import axios from "@/common/axios";

  export default {
    mixins: [treeter],
    components: {
      'imp-panel': panel,
      'el-select-tree': selectTree,
      calendar
    },
    props:['childMsg'],
    data(){
      return {
        form: {
          depart_name: ''
        },
        lotteryId:1,
        row:null,
        isneedStatus:true,
        generateVisible:false,
        generateDate:'',
        placeholdertext:'09 453246',
        beginNumber:null,
        depart_name:null,
        calendar5:{
            display:"2017/11/2,2017/12/2",
            multi:true,
            show:false,
            zero:true,
            value:[[2017,11,1],[2017,11,2]], //默认日期
            disabled:[[2017,12,24],[2017,12,25]], //默认日期
            lunar:true, //显示农历
            select:(value)=>{
                let displayValue=[]
                value.forEach(v=>{
                    displayValue.push(v[0]+"/"+(v[1])+"/"+v[2])
                })
                console.log(displayValue);
                this.calendar5.display=displayValue.join(",");
                // this.calendar5.show=false;
                this.calendar5.value=value;
            }
        },
        calendar4:{
            display:"2018/02/16 ~ 2019/02/16",
            show:false,
            range:true,
            zero:true,
            value:[[2018,2,16],[2019,2,16]], //默认日期
            lunar:true, //显示农历
            select:(begin,end)=>{
                console.log(begin,end)
                this.calendar4.show=false;
                this.calendar4.value=[begin,end];
                this.calendar4.display=begin.join("/")+" ~ "+end.join("/");
            }
        }
      }
    },
    computed: {
    },
    methods: {
      tobaba(msg){//{ac:1,mg:'msg'}1:关闭，2：弹出消息
        this.$emit('dialogMsg',msg)
      },
      openMultiByDrop(e){
          this.calendar5.show=true;
          this.calendar5.left=e.target.offsetLeft+100;
          this.calendar5.top=e.target.offsetTop+260;
          e.stopPropagation();
          window.setTimeout(()=>{
              document.addEventListener("click",(e)=>{
                  this.calendar5.show=false;
                  document.removeEventListener("click",()=>{},false);
              },false);
          },1000)
      },
      generatePrize(data){
        this.generateVisible = true
        this.row = data
      },
      openByDialog(){
        this.calendar4.show=true;
      },
      dialogFoo(data){
        if(data.ac){
          this.generateVisible = false
          // this.load()
        }else{
          this.$message(data.mg);
        }
      },
      onSubmit(){
        if(~~this.row.isHK6HC){
          var p = {}
          this.isneedStatus&&(p.beginNumber = this.beginNumber)
          p.dateStringList = this.calendar5.display
          axios.post(api.AWARO_ISSUEINFO_HK, p)
            .then(res => {
              this.tobaba({ac:true})
              this.$message(res.data.msg);
            }).catch(e => {
              this.tobaba({ac:false,mg:e})
          })
        }
        if(!~~this.row.isHK6HC){
          var p = {}
          this.isneedStatus&&(p.beginNumber = this.beginNumber)
          p.beginDate = this.calendar4.display.slice(0,10)
          p.endDate = this.calendar4.display.slice(13)
          p.lottery_id = this.childMsg.lottery_id
          axios.post(api.AWARO_ISSUEINFO, p)
            .then(res => {
              this.tobaba({ac:true})
              this.$message(res.data.msg);
            }).catch(e => {
              this.tobaba({ac:false,mg:e})
          })
        }
      },
      load(){
        let lotteryId = this.childMsg.lottery_id
        axios.post(api.AWARD, {lottery_id: lotteryId})
          .then(res => {
            this.row = res.data.rows
            this.isneedStatus = !!~~this.row.needBeginNumber
            this.placeholdertext = '例子：' + this.row.beginNumberDemo
          }).catch(e => {
            this.$message(e);
        })
      }
    },
    created(){
      this.load();
    }
  }
</script>

<style>
#fdsfe{
    box-sizing: border-box;
    width:100%;
    border-radius: 2px;
    border:1px solid #dedede;
    font-size: 16px;
    background:url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48ZGVmcz48c3R5bGUgdHlwZT0idGV4dC9jc3MiPjwhW0NEQVRBWwpAZm9udC1mYWNlIHsgZm9udC1mYW1pbHk6IGlmb250OyBzcmM6IHVybCgiLy9hdC5hbGljZG4uY29tL3QvZm9udF8xNDQyMzczODk2XzQ3NTQ0NTUuZW90PyNpZWZpeCIpIGZvcm1hdCgiZW1iZWRkZWQtb3BlbnR5cGUiKSwgdXJsKCIvL2F0LmFsaWNkbi5jb20vdC9mb250XzE0NDIzNzM4OTZfNDc1NDQ1NS53b2ZmIikgZm9ybWF0KCJ3b2ZmIiksIHVybCgiLy9hdC5hbGljZG4uY29tL3QvZm9udF8xNDQyMzczODk2XzQ3NTQ0NTUudHRmIikgZm9ybWF0KCJ0cnVldHlwZSIpLCB1cmwoIi8vYXQuYWxpY2RuLmNvbS90L2ZvbnRfMTQ0MjM3Mzg5Nl80NzU0NDU1LnN2ZyNpZm9udCIpIGZvcm1hdCgic3ZnIik7IH0KCl1dPjwvc3R5bGU+PC9kZWZzPjxnIGNsYXNzPSJ0cmFuc2Zvcm0tZ3JvdXAiPjxnIHRyYW5zZm9ybT0ic2NhbGUoMC4wMTU2MjUsIDAuMDE1NjI1KSI+PHBhdGggZD0iTTcxMS4zMDYyIDI5MC42OTcyYzI0LjI4MjEgMCA0NS4zNzY1LTE5LjcwNjkgNDUuMzc2NS00NC4wMzJWNDYuNTYwMjU1OTk5OTk5OTk1YzAtMjQuMzI1MS0yMS4wOTU0LTQ0LjA1MzUtNDUuMzc2NS00NC4wNTM1LTI0LjMwMjYgMC00My45ODggMTkuNzI4NC00My45ODggNDQuMDUzNXYyMDAuMTA0OTZDNjY3LjMxODMgMjcwLjk5MDMgNjg3LjAwMzYgMjkwLjY5NzIgNzExLjMwNjIgMjkwLjY5NzJ6TTYyMy40ODA4IDExMy40MjAzSDQwMC43NjQ5Mjh2NjYuNTEzOTJoMjIyLjcxNTkwNDAwMDAwMDAyVjExMy40MjAyODh6TTg4NC4wNTMgMTEzLjQyMDNoLTgyLjc3NDAxNnY2Ni4xNDUyOGg4NS45NDAyMjRjMjUuMjc4NSAwIDQ2LjYxMTUgMjEuMzc2IDQ2LjYxMTUgNDYuNjc3djE1My45Mjc2OEg5MC40Mzg2NTYwMDAwMDAwMXYtMTUzLjkyNzY4YzAtMjUuMyAyMS4zMzMtNDYuNjc3IDQ2LjYxMTUtNDYuNjc3aDg2LjUwMzQyNFYxMTMuNDIwMjg4aC04Mi42NDI5NDRjLTY0LjA4NiAwLTExNi41MDc2IDUyLjUwODctMTE2LjUwNzYgMTE2LjcwMzJ2Njc2LjgwMTUzNTk5OTk5OTljMCA2NC4xNzQxIDUwLjQ5MTQgMTE2LjY4MDcgMTE0LjU3NzQgMTE2LjY4MDdIODg0LjA1Mjk5MmM2NC4wNjI1IDAgMTE2LjUwNjYtNTIuNTA2NiAxMTYuNTA2Ni0xMTYuNjgwN1YyMzAuMTIzNTE5OTk5OTk5OThDMTAwMC41NTk2IDE2NS45MjkgOTQ4LjExNDQgMTEzLjQyMDMgODg0LjA1MyAxMTMuNDIwM3pNOTMzLjgyOTYgOTEwLjM1MTRjMCAyNS4zLTIxLjMzMyA0Ni42NzYtNDYuNjExNSA0Ni42NzZIMTM3LjA1MDExMTk5OTk5OTk4Yy0yNS4yNzg1IDAtNDYuNjExNS0yMS4zNzYtNDYuNjExNS00Ni42NzZWNDQ2LjQ0NTU2OEg5MzMuODI5NjMyVjkxMC4zNTEzNnpNMjY3LjEwODQgNjQ2LjE4MTljMzYuODc3MyAwIDY2Ljc1MjUtMjkuOTM5NyA2Ni43NTI1LTY2Ljg4MTUgMC0zNi45MjI0LTI5Ljg3NTItNjYuODYxMS02Ni43NTI1LTY2Ljg2MTEtMzYuODU0OCAwLTY2Ljc1MjUgMjkuOTM5Ny02Ni43NTI1IDY2Ljg2MTFDMjAwLjM1NTggNjE2LjI0MjIgMjMwLjI1MjUgNjQ2LjE4MTkgMjY3LjEwODQgNjQ2LjE4MTl6TTUxMS41NDg0IDY0Ni4xODE5YzM2Ljg1NTggMCA2Ni43NTI1LTI5LjkzOTcgNjYuNzUyNS02Ni44ODE1IDAtMzYuOTIyNC0yOS44OTU3LTY2Ljg2MTEtNjYuNzUyNS02Ni44NjExLTM2Ljg3NzMgMC02Ni43NTI1IDI5LjkzOTctNjYuNzUyNSA2Ni44NjExQzQ0NC43OTU5IDYxNi4yNDIyIDQ3NC42NzExIDY0Ni4xODE5IDUxMS41NDg0IDY0Ni4xODE5ek0yNjUuOTE2NCA4OTAuNzA5YzM2Ljg3NzMgMCA2Ni43NTE1LTI5LjkzOTcgNjYuNzUxNS02Ni44NjExIDAtMzYuOTQyOC0yOS44NzQyLTY2Ljg4MjYtNjYuNzUxNS02Ni44ODI2LTM2Ljg1NTggMC02Ni43NTI1IDI5LjkzOTctNjYuNzUyNSA2Ni44ODI2QzE5OS4xNjM5IDg2MC43NjkzIDIyOS4wNTk2IDg5MC43MDkgMjY1LjkxNjQgODkwLjcwOXpNNTExLjU0ODQgODkwLjcwOWMzNi44NTU4IDAgNjYuNzUyNS0yOS45Mzk3IDY2Ljc1MjUtNjYuODYxMSAwLTM2Ljk0MjgtMjkuODk1Ny02Ni44ODI2LTY2Ljc1MjUtNjYuODgyNi0zNi44NzczIDAtNjYuNzUyNSAyOS45Mzk3LTY2Ljc1MjUgNjYuODgyNkM0NDQuNzk1OSA4NjAuNzY5MyA0NzQuNjcxMSA4OTAuNzA5IDUxMS41NDg0IDg5MC43MDl6TTc1NS42NDEzIDY0Ni4xODE5YzM2Ljg1NjggMCA2Ni43NTM1LTI5LjkzOTcgNjYuNzUzNS02Ni44ODE1IDAtMzYuOTIyNC0yOS44OTY3LTY2Ljg2MTEtNjYuNzUzNS02Ni44NjExLTM2Ljg3NzMgMC02Ni43NTI1IDI5LjkzOTctNjYuNzUyNSA2Ni44NjExQzY4OC44ODk5IDYxNi4yNDIyIDcxOC43NjQgNjQ2LjE4MTkgNzU1LjY0MTMgNjQ2LjE4MTl6TTMxMS43MDM2IDI5MC42OTcyYzI0LjI4MTEgMCA0NS4zNzY1LTE5LjcwNjkgNDUuMzc2NS00NC4wMzJWNDYuNTYwMjU1OTk5OTk5OTk1YzAtMjQuMzI1MS0yMS4wOTQ0LTQ0LjA1MzUtNDUuMzc2NS00NC4wNTM1LTI0LjMwMTYgMC00My45ODkgMTkuNzI4NC00My45ODkgNDQuMDUzNXYyMDAuMTA0OTZDMjY3LjcxNDYgMjcwLjk5MDMgMjg3LjQwMiAyOTAuNjk3MiAzMTEuNzAzNiAyOTAuNjk3MnoiIGZpbGw9IiM1ZTdhODgiPjwvcGF0aD48L2c+PC9nPjwvc3ZnPg==) no-repeat 8px 10px;
        padding-left: 36px;
        color:#666;
}
#award-layer .time-group span{
  margin-right:10px;
}
.fade-enter-active,
.fade-leave-active {
    transition: all .5s ease-in-out;
}
.fade-enter,.fade-leave-active{
    opacity: 0;
    transform: translateY(-10px);
}
/*下拉框*/
.calendar-dropdown{
    background: #fff;
    position: absolute;
    left:0;
    top:0;
    padding:20px;
    border: 1px solid #eee;
    border-radius: 2px;
}
.calendar-dropdown:before {
    position: absolute;
    left:30px;
    top: -10px;
    content: "";
    border:5px solid rgba(0, 0, 0, 0);
    border-bottom-color: #DEDEDE;
}
.calendar-dropdown:after {
    position: absolute;
    left:30px;
    top: -9px;
    content: "";
    border:5px solid rgba(0, 0, 0, 0);
    border-bottom-color: #fff;
}
/*弹出框*/
.calendar-dialog{
    position: absolute;
    left:0;
    top:0;
    right:0;
    bottom:0;
}
.calendar-dialog-mask{
    background:rgba(255,255,255,.5);
    width:100%;
    height:100%;
}
.calendar-dialog-body{
    background: #fff;
    position: absolute;
    left:50%;
    top:50%;
    transform: translate(-50%,-50%);
    padding:20px;
    border: 1px solid #eee;
    border-radius: 2px;
}
.begin-no{
  width:200px;
  margin: 0 10px;
}
.calendar-dropdown{
  position: static;
}
.calendar-dialog-body{
  position: relative;
}
</style>
</style>
