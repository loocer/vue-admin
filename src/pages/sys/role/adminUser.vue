<template>

  <imp-panel>
     <el-table
    :data="admins"
    border
    style="width: 100%">
    <el-table-column
      prop="id"
      label="序号"
      width="150">
    </el-table-column>
    <el-table-column
      prop="admin_name"
      label="用户名"
      width="150">
    </el-table-column>
    <el-table-column
      prop="depart_name"
      label="部门"
      width="150">
    </el-table-column>
     <el-table-column
      prop="role_name"
      label="角色"
      width="150">
    </el-table-column>
    <el-table-column
      prop="city"
      label="状态"
      width="180">
      <template slot-scope="scope">
        <el-switch
          style="display: block"
          v-model="scope.row.isdisabled"
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-text="开"
          inactive-text="关">
        </el-switch>
      </template>
    </el-table-column>
    <el-table-column
      prop="create_by"
      label="创建人"
      width="200">
    </el-table-column>
    <el-table-column
      label="创建时间"
      width="200">
      <template slot-scope="scope">
        <i class="el-icon-time"></i>
        <span style="margin-left: 10px">{{ scope.row.create_time }}</span>
      </template>
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
  import { mapGetters } from 'vuex'
  import { mapActions } from 'vuex'
  import panel from "@/components/panel.vue"
  import selectTree from "@/components/selectTree.vue"
  import treeter from "@/components/treeter"
  import * as sysApi from '@/services/sys'
  import * as api from "@/api"
  
  import { formateRoleData } from '@/common/utils'

  export default {
    mixins: [treeter],
    components: {
      'imp-panel': panel,
      'el-select-tree': selectTree
    },
    props:['childMsg'],
    data(){
      return {
        modifyData:4234234324,
        adminArray: [],
        total:10,
        pageNum: 1,
        pageSize:2,
        admins:null
      }
    },
    mounted(){
      this.load()
    },
    methods: {
      pageclick(data){
        this.pageNum = data
        this.load()
      },
      dialogFoo(data){
        if(data.ac){
          this.outerVisible = false
          this.modifyVisible = false
          this.adminroleVisible = false
          this.adminlogVisible = false
          this.load()
        }else{
          this.$message(data.mg);
        }
      },
      makeroleClick(data){
        this.adminroleVisible = true
        this.modifyData = data
      },
      handleNodeClick(data){
        this.form = data;
      },
      logClick(data){
        this.modifyData = data;
        this.adminlogVisible = true
      },
      modifyClick(data){
        this.modifyVisible = true
        this.modifyData = data
      },
      changeState(data){
        var state = ~~(!data.isdisabled)
        var parms = {id:data.id,isdisabled:state}
        this.$http.put(api.SYS_ADMINS_MODIFY  + data.id,parms)
          .then(res => {
            this.$message('操作成功');
            this.load();
          }).catch(e => {
            this.$message('操作失败');
           this.load();
        })
      },
      pageclick(data){
        this.pageNum = data
        this.load()
      },
      load(){
        var  parms = {}
        parms.pageNum = this.pageNum
        parms.pageSize = this.pageSize
        // parms.childMsg
        this.$http.get(api.CONTEXT + '/adminRole/' + this.childMsg.id + '/members',parms)
          .then(res => {
              this.total = ~~res.iTotalRecords
              this.admins = res.data
          }).catch(e => {
            this.$message(e);
        })
        // sysApi.adminList({}).then(res => {
        //   this.total = ~~res.iTotalRecords
        //   this.admins = res.data
        // })
      }
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
</style>
