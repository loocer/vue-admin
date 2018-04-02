<template>

  <imp-panel>
    <h3 class="box-title" slot="header" style="width: 100%;text-align:right">
      <el-button type="primary" icon="plus" @click="outerVisible = true">新增部门</el-button>
    </h3>
     <el-table
    :data="adminDepartmentArray"
    border
    style="width: 100%">
    <el-table-column
      prop="id"
      label="序号"
      width="100">
    </el-table-column>
    <el-table-column
      prop="depart_name"
      label="部门名"
      width="120">
    </el-table-column>
    
    <el-table-column
      prop="city"
      label="状态"
      width="120">
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
      width="150">
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
      prop="modify_by"
      label="最后修改人"
      width="150">
    </el-table-column>
    <el-table-column
      prop="最后修改时间"
      label="最后修改时间"
      width="220">
      <template slot-scope="scope">
        <i class="el-icon-time"></i>
        <span style="margin-left: 10px">{{ scope.row.modify_time }}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="remark"
      label="备注"
      width="150">
    </el-table-column>
    <el-table-column
      fixed="right"
      label="操作"
      >
      <template slot-scope="scope">
        <el-button @click="modifyClick(scope.row)" type="text" size="small">修改</el-button>
         <el-button @click="batchDelete(scope.row)" type="text" size="small">删除</el-button>
          <el-button @click="addChildClick(scope.row)" type="text" size="small">新增子部门</el-button>
           <el-button @click="showUserClick(scope.row)" type="text" size="small">成员查看</el-button>
      </template>
    </el-table-column>
  </el-table>

    <el-dialog title="增加部门" :visible.sync="outerVisible">
      <data-add v-on:dialogMsg="dialogFoo"></data-add>
    </el-dialog>
    <el-dialog title="修改部门信息" :visible.sync="modifyVisible">
      <data-modify :child-msg="modifyData" v-on:dialogMsg="dialogFoo"></data-modify>
    </el-dialog>
    <el-dialog title="添加子部门" :visible.sync="addChildVisible">
      <add-child :child-msg="modifyData" v-on:dialogMsg="dialogFoo"></add-child>
    </el-dialog>
    <div id="showUser">
      <el-dialog title="查看成员" :visible.sync="uVisible">
        <admin-user  v-on:dialogMsg="dialogFoo" :child-msg="modifyData"></admin-user>
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

  import panel from "@/components/panel.vue"
  import selectTree from "@/components/selectTree.vue"
  import treeter from "@/components/treeter"
  import * as sysApi from '@/services/sys'
  import * as api from "@/api"
  import dataadd from './add.vue'
  import datamodify from './modify.vue'
  import addChild from './addChild.vue'
  import adminUser from './adminUser.vue'
  import { formateRoleData } from '@/common/utils'
  import { mapGetters } from 'vuex'
  import { mapActions } from 'vuex'

  export default {
    mixins: [treeter],
    components: {
      'imp-panel': panel,
      'el-select-tree': selectTree,
      'data-add':dataadd,
      'data-modify':datamodify,
      'add-child':addChild,
      'admin-user':adminUser
    },
    data(){
      return {
        outerVisible:false,
        modifyVisible:false,
        addChildVisible:false,
        uVisible:false,
        adminDepartmentArray:[],
        departments:[],
        pageNum: 1,
        pageSize:10,
        total:10,
        modifyData:null
      }
    },
    computed: {
      // adminArrays() {
      //  return this.$store.state.admins
      // }
      ...mapGetters([
        'adminDepartment'
      ])
    },
    mounted() {
      this.load();
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
          this.load()
          this.outerVisible = false
          this.modifyVisible = false
          this.addChildVisible = false
        }else{
          this.$message(data.mg);
        }
      },
      showUserClick(data){
        this.uVisible = true
        this.modifyData = data
      },
      modifyClick(data){
        this.modifyVisible = true
        this.modifyData = data
      },
      addChildClick(data){
        this.addChildVisible = true
        this.modifyData = data
      },
      changeState(data){
        data.isdisabled = ~~ data.isdisabled 
        this.$http.patch(api.SYS_DEPARTMENT_MODIFY + data.id, data)
          .then(res => {
            this.$message('状态修改成功');
            this.load()
          }).catch(e => {
            this.$message(e);
        })
      },
      handleNodeClick(data){
        this.form = data;
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
      pageclick(data){
        this.pageNum = data
        this.load()
      },
      batchDelete(data){
        this.$confirm('确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.delete(api.SYS_DEPARTMENT_DELETE + data.id)
            .then(res => {
              this.$message('操作成功');
              this.load();
            }).catch(e => {
            this.$message(e);
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
          this.$message(e);
        })
      },
      deleteSelected(id){
        this.$http.get(api.SYS_ROLE_DELETE + "?roleIds=" + id)
          .then(res => {
            this.$message('操作成功');
            this.deleteFromTree(this.roleTree, id);
            this.newAdd();
          }).catch(e =>{
          this.$message(e);
        })
      },
      load(){
        var  parms = {}
        parms.pageNum = this.pageNum
        parms.pageSize = this.pageSize
        sysApi.adminDepartmentList(parms).then(res => {
          this.total = ~~res.total
          this.departments = res.rows
        })
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
    created(){
      this.load();
    },
    watch:{
      departments:function(value){
        this.adminDepartmentArray = []
        for(let i in value){
          let object = {}
          object = value[i]
          object.isdisabled = !!~~value[i].isdisabled
          this.adminDepartmentArray.push(object)
        }
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
  .el-dialog--small{
    width: 400px;
  }
 #showUser .el-dialog--small{
    width: 1250px;
  }
</style>
