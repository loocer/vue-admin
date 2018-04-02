<template>

  <imp-panel :class="log">
     <el-table
    :data="logs"
    border
    style="width: 100%">
    <el-table-column
      prop="id"
      label="序号"
      width="150">
    </el-table-column>
    <el-table-column
      prop="title"
      label="操作行为"
      width="150">
    </el-table-column>
    <el-table-column
      prop="admin_login_ip"
      label="登录ip"
      width="150">
    </el-table-column>
     <el-table-column
      prop="request_url"
      label="请求url"
      width="150">
    </el-table-column>
    <el-table-column
      prop="status"
      label="请求状态"
      width="150">
    </el-table-column>
    <el-table-column
      prop="method"
      label="请求方式"
      width="150">
    </el-table-column>
    <el-table-column
      prop="admin_user_agent"
      label="userAgent"
      width="200">
    </el-table-column>
    <el-table-column
      label="操作时间"
      width="200">
      <template slot-scope="scope">
        <i class="el-icon-time"></i>
        <span style="margin-left: 10px">{{ scope.row.create_time }}</span>
      </template>
    </el-table-column>
    
    
  </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[100, 200, 300, 400]"
      :page-size="100"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    
    <!-- <el-pagination style="float:right;margin-top:30px;"
      layout="prev, pager, next"
      @current-change="pageclick"
      :page-size="pageSize"
      :total="total">
    </el-pagination> -->
  </imp-panel>
</template>
<script>
  import { mapGetters } from 'vuex'
  import { mapActions } from 'vuex'
  import panel from "@/components/panel.vue"
  import selectTree from "@/components/selectTree.vue"
  import treeter from "@/components/treeter"
  import * as sysApi from '@/services/sys'
  import * as api from "@/api"
  import dataadd from './add.vue'
  import datamodify from './modify.vue'
  import adminRole from './adminRole.vue'
  import { formateRoleData } from '@/common/utils'

  export default {
    mixins: [treeter],
    components: {
      'imp-panel': panel,
      'el-select-tree': selectTree,
      'data-add':dataadd,
      'data-modify':datamodify,
      'admin-role':adminRole
    },
    props:['childMsg'],
    data(){
      return {
        logs: [],
        total:10,
        pageNum: 1,
        pageSize:100,
        admins:null,
        currentPage:5
      }
    },
    mounted() {
      this.load();
      // this.adminArray = this.$store.state.admins
      // this.$store.dispatch('loadAdmins')
    },
    methods: {
      pageclick(data){
        console.log(data)
      },
      dialogFoo(data){
        if(data.ac){
          this.outerVisible = false
          this.modifyVisible = false
          this.adminroleVisible = false
          this.load()
        }else{
          this.$message(data.mg);
        }
      },
      handleSizeChange(data){
        this.pageSize = data
        this.load()
      },
      handleCurrentChange(data){
        this.pageNum = data
        this.load()
      },
      changeState(data){
        console.log('-=-=-=-=-=-=-=-=-=-=')
        console.log(data)
        var state = ~~(!data.isdisabled)
        var parms = {id:data.id,isdisabled:state}
        console.log(parms)
        this.$http.put(api.SYS_ADMINS_MODIFY  + data.id,parms)
          .then(res => {
            this.$message('操作成功');
            // this.load();
          }).catch(e => {
          this.$message('操作成功');
          console.log(checkKeys);
          this.batchDeleteFromTree(this.roleTree, checkKeys);
        })
      },
      currentPageto(data){
        this.pageNum = data
        this.load()
      },
      onSubmit(){
        this.form.parentId = this.form.parentId;
        this.$http.post(api.SYS_ROLE_ADD, this.form)
          .then(res => {
            this.form.id = res.data.id;
            this.appendTreeNode(this.roleTree, res.data);
          }).catch(e => {
          this.maxId += 1;
          this.$message('操作成功');
          this.form.id = this.maxId;
          var  ddd = {
            id: this.form.id,
            name: this.form.name,
            sort: this.form.sort,
            enName:this.form.enName,
            parentId: this.form.parentId,
            usable: this.form.usable,
            children:[]
          }
          this.appendTreeNode(this.roleTree, ddd);
          this.roleTree.push({});
          this.roleTree.pop();
        })
      },
     
      load(){
        var  parms = {}
        parms.pageNum = this.pageNum
        parms.pageSize = this.pageSize
        parms.adminId = this.childMsg.id
        console.log(parms)
        sysApi.logList(parms).then(res => {
          this.total = ~~res.iTotalRecords
          this.logs = res.data
        })
        // this.loadAdmins()
        // this.$store.dispatch('loadAdmins')
        // sysApi.roleList({}).then(res => {
        //   console.log(res)
        //     this.roleTree = formateRoleData(res.data);
        //     // this.roleTree.push(...res)
        //   })
      }
    },
    watch:{
      admins:function(value){
        this.adminArray = []
        for(let i in value){
          let object = {}
          object = value[i]
          object.isdisabled = !(~~value[i].isdisabled)
          this.adminArray.push(object)
        }
        console.log(value)
      }
    }
  }
</script>

<style >
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
.log{
  width: 1300px;
}
</style>
