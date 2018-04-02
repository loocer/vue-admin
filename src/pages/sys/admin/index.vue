<template>

  <imp-panel>
    <h3 class="box-title" slot="header" style="width: 100%;text-align:right">
      <el-button type="primary" icon="plus" @click="outerVisible = true">新增管理员</el-button>
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
          @change="changeState(scope.row)"
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
    
    <el-table-column
      fixed="right"
      label="操作"
      >
      <template slot-scope="scope">
        <el-button @click="modifyClick(scope.row)" type="text" size="small">修改</el-button>
        <el-button @click="makeroleClick(scope.row)" type="text" size="small">分配角色</el-button>
         <!-- <el-button @click="deleteClick(scope.row)" type="text" size="small">删除</el-button> -->
          <el-button @click="logClick(scope.row)" type="text" size="small">日志</el-button>
      </template>
    </el-table-column>
  </el-table>
    <div id="log" v-if="adminlogVisible">
       <el-dialog title="日志" :visible.sync="adminlogVisible" width="80%">
        <log-layer :child-msg="modifyData" v-on:dialogMsg="dialogFoo"></log-layer>
      </el-dialog>
    </div>
    <div id="small">
      <el-dialog title="添加管理员" :visible.sync="outerVisible" v-if="outerVisible" width="80%">
        <data-add v-on:dialogMsg="dialogFoo"></data-add>
      </el-dialog>
    </div>
    <div  id="small">
      <el-dialog title="修改信息" :visible.sync="modifyVisible" v-if="modifyVisible" width="80%">
        <data-modify :child-msg="modifyData" v-on:dialogMsg="dialogFoo"></data-modify>
      </el-dialog>
    </div>
    <div  id="small">
      <el-dialog title="分配角色" :visible.sync="adminroleVisible" v-if="adminroleVisible" width="80%">
        <admin-role :child-msg="modifyData" v-on:dialogMsg="dialogFoo"></admin-role>
      </el-dialog>
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
  import { mapGetters } from 'vuex'
  import { mapActions } from 'vuex'
  import panel from "@/components/panel.vue"
  import selectTree from "@/components/selectTree.vue"
  import treeter from "@/components/treeter"
  import * as sysApi from '@/services/sys'
  import * as api from "@/api"
  import dataadd from './add.vue'
  import Logs from './log.vue'
  import datamodify from './modify.vue'
  import adminRole from './adminRole.vue'
  import axios from "@/common/axios";
  
  import { formateRoleData } from '@/common/utils'

  export default {
    mixins: [treeter],
    components: {
      'imp-panel': panel,
      'el-select-tree': selectTree,
      'data-add':dataadd,
      'data-modify':datamodify,
      'admin-role':adminRole,
      'log-layer':Logs
    },
    data(){
      return {
        outerVisible:false,
        modifyVisible:false,
        adminroleVisible:false,
        adminlogVisible:false,
        modifyData:4234234324,
        adminArray: [],
        total:10,
        pageNum: 1,
        pageSize:10,
        admins:null,
        tableData: [{
          id: '1',
          name: '王小虎',
          province: '上vfvfv海',
          state: true,
          city: '普陀区',
          createTime: '2016-05-03',
          lastTime: '2016-05-03',
          state: true,
          createUserName: 'tom',
          lastUserName:'李二狗子',
          zip: 200333
        }, {
          id: '2',
          name: '王小虎',
          province: '上海',
          state: true,
          createTime: '2016-05-03',
          lastTime: '2016-05-03',
          city: '普陀区',
          createUserName: 'Ted',
          lastUserName:'李二狗子',
          zip: 200333
        }, {
          id: '3',
          name: '王小虎',
          province: '上海',
          state: true,
          city: '普陀区',
          createTime: '2016-05-03',
          lastTime: '2016-05-03',
          lastUserName:'李二狗子',
          createUserName:'Sam',
          zip: 200333
        }, {
          id: '4',
          name: '王小虎',
          province: '上海',
          state: true,
          createTime: '2016-05-03',
          lastTime: '2016-05-03',
          lastUserName:'王小华',
          city: '普陀区',
          createUserName:'马云',
          zip: 200333
        }]
      }
    },
    mounted() {
      this.load();
      // this.adminArray = this.$store.state.admins
      // this.$store.dispatch('loadAdmins')
    },
    methods: {
      configRoleResources(){
        let checkedKeys = this.$refs.resourceTree.getCheckedKeys();
        this.$http.get(api.SYS_SET_ROLE_RESOURCE + "?roleId=" + this.form.id + "&resourceIds="+checkedKeys.join(','))
          .then(res => {
            this.$message('修改成功');
            this.dialogVisible = false;
          })
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
        var parms = {id:data.admin_id,isdisabled:state}
        this.$http.put(api.SYS_ADMINS_MODIFY  + data.admin_id,parms)
          .then(res => {
            this.$message('操作成功');
            this.load();
          }).catch(e => {
            this.$message(e);
           this.load();
        })
      },
      deleteClick(data){
        this.$confirm('确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.get(api.SYS_ROLE_DELETE + "?roleIds=" + checkKeys.join(','))
            .then(res => {
              this.$message('操作成功');
              this.load();
            }).catch(e => {
            this.$message('操作成功');
            console.log(checkKeys);
            this.batchDeleteFromTree(this.roleTree, checkKeys);
          })
        });
        console.log(data)
      },
      pageclick(data){
        this.pageNum = data
        this.load()
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
      batchDelete(){
        var checkKeys = this.$refs.roleTree.getCheckedKeys();
        if (checkKeys == null || checkKeys.length <= 0) {
          this.$message.warning('请选择要删除的资源');
          return;
        }
        this.$confirm('确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.get(api.SYS_ROLE_DELETE + "?roleIds=" + checkKeys.join(','))
            .then(res => {
              this.$message('操作成功');
              this.load();
            }).catch(e => {
            this.$message('操作成功');
            console.log(checkKeys);
            this.batchDeleteFromTree(this.roleTree, checkKeys);
          })
        });

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
      deleteSelected(id){
        this.$http.get(api.SYS_ROLE_DELETE + "?roleIds=" + id)
          .then(res => {
            this.$message('操作成功');
            this.deleteFromTree(this.roleTree, id);
            this.newAdd();
          }).catch(e =>{
          this.$message('操作成功');
          this.deleteFromTree(this.roleTree, id);
          this.newAdd();
        })
      },
      load(){
        var  parms = {}
        parms.pageNum = this.pageNum
        parms.pageSize = this.pageSize
        sysApi.adminList(parms).then(res => {
          this.total = ~~res.iTotalRecords
          this.admins = res.rows
        })
        // this.loadAdmins()
        // this.$store.dispatch('loadAdmins')
        // sysApi.roleList({}).then(res => {
        //   console.log(res)
        //     this.roleTree = formateRoleData(res.data);
        //     // this.roleTree.push(...res)
        //   })
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
      },
      settingResource(event,id){
          event.stopPropagation();
          this.dialogVisible = true;
          if(this.resourceTree==null||this.resourceTree.length<=0){
            this.dialogLoading = true;
            sysApi.resourceList()
              .then(res => {
                this.dialogLoading = false;
                this.resourceTree = res;
              })
          }
        this.$http.get(api.SYS_ROLE_RESOURCE + "?id=" + id)
          .then(res => {
            this.$refs.resourceTree.setCheckedKeys(res.data);
          }).catch(err=> {

        })
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
  #log .el-dialog--small{
    width: 1380px;
  }
  #small .el-dialog--small{
    width: 380px;
  }

</style>
