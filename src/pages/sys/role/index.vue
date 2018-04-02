<template>

  <imp-panel>
    <h3 class="box-title" slot="header" style="width: 100%;text-align:right">
      <el-button type="primary" icon="plus" @click="addRole.outerVisible = true" v-if="fpUi.role.add.status">新增角色</el-button>
    </h3>
     <el-table
    :data="adminArray"
    border
    style="width: 100%">
    <el-table-column
      prop="id"
      label="序号"
      width="100">
    </el-table-column>
    
    <el-table-column
      prop="role_name"
      label="角色名"
      width="120">
    </el-table-column>
    <el-table-column
      prop="depart_name"
      label="所属部门"
      width="120">
    </el-table-column>
    <el-table-column
      prop="parent_name"
      label="父角色"
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
      width="100">
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
      width="230">
      <template slot-scope="scope">
        <i class="el-icon-time"></i>
        <span style="margin-left: 10px">{{ scope.row.modify_time }}</span>
      </template>
    </el-table-column>
    <el-table-column
      fixed="right"
      label="操作"
      >
      <template slot-scope="scope">
        <el-button @click="modifyClick(scope.row)" type="text" size="small">修改</el-button>
         <el-button @click="batchDelete(scope.row)" type="text" size="small">删除</el-button>
          <el-button @click="showUsersClick(scope.row)" type="text" size="small">成员查看</el-button>
           <el-button @click="showPermissionsClick(scope.row)" type="text" size="small">配置权限</el-button>
            <el-button @click="addRoleClick(scope.row)" type="text" size="small">新增子角色</el-button>
      </template>
    </el-table-column>
  </el-table>

    <el-dialog title="新增角色" :visible.sync="addRole.outerVisible">
      <data-add  v-on:dialogMsg="dialogFoo" :child-msg="addRole.row"></data-add>
    </el-dialog>
    <el-dialog title="修改角色" :visible.sync="modifyRole.outerVisible">
      <data-modify  v-on:dialogMsg="dialogFoo" :child-msg="modifyRole.row"></data-modify>
    </el-dialog>
    <div id="permissionDo" v-if="pVisible">
      <el-dialog title="配置资源" :visible.sync="pVisible">
        <do-permission  v-on:dialogMsg="dialogFoo" :child-msg="msgObject"></do-permission>
      </el-dialog>
    </div>
     <div id="showUser">
      <el-dialog title="查看成员" :visible.sync="uVisible">
        <admin-user  v-on:dialogMsg="dialogFoo" :child-msg="modifyRole.row"></admin-user>
      </el-dialog>
    </div>
    <el-dialog title="添加子角色" v-if="addChildVisible" :visible.sync="addChildVisible">
      <add-child :child-msg="addRole.row" v-on:dialogMsg="dialogFoo"></add-child>
    </el-dialog>
    <el-pagination style="float:right;margin-top:30px;"
      layout="prev, pager, next"
      @current-change="pageclick"
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
  import addChild from './addChild.vue'
  import datamodify from './modify.vue'
  import doPermission from './doPermission.vue'
  import adminUser from './adminUser.vue'
  import { formateRoleData } from '@/common/utils'
  import * as fbTool from '@/common/fontendUi'
  import { mapGetters } from 'vuex'
  import { mapActions } from 'vuex'
  import axios from "@/common/axios";

  export default {
    mixins: [treeter],
    components: {
      'imp-panel': panel,
      'el-select-tree': selectTree,
      'data-add':dataadd,
      'data-modify':datamodify,
      'do-permission':doPermission,
      'admin-user':adminUser,
      'add-child':addChild
    },
    data(){
      return {
        outerVisible:false,
        innerVisible:false,
        pVisible:false,
        uVisible:false,
        addChildVisible:false,
        adminArray:[],
        adminRoles:[],
        pageNum: 1,
        pageSize:10,
        total:10,
        addRole:{
          outerVisible:false,
          row:null
        },
        modifyRole:{
          outerVisible:false,
          row:null
        },
        msgObject:null,
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
      let adminFps = this.$store.state.adminFps
      fbTool.queryUi(fbTool.fpUi.role,adminFps)
    },
    computed: {
      fpUi() {
       return fbTool.fpUi
      }
    },
    ...mapGetters([
      'adminFps'
    ]),
    methods: {
      configRoleResources(){
        let checkedKeys = this.$refs.resourceTree.getCheckedKeys();
        this.$http.get(api.SYS_SET_ROLE_RESOURCE + "?roleId=" + this.form.id + "&resourceIds="+checkedKeys.join(','))
          .then(res => {
            this.$message('修改成功');
            this.dialogVisible = false;
          })
      },
      pageclick(data){
        console.log(data)
      },
      dialogFoo(data){
        if(data.ac){
          this.load();
          this.addRole.outerVisible = false
          this.modifyRole.outerVisible = false
          this.addChildVisible = false
          this.pVisible = false
        }else{
          this.$message(data.mg);
        }
      },
      showUsersClick(data){
        this.uVisible = true
        this.modifyRole.row = data
      },
      showPermissionsClick(data){
        this.pVisible = true
        this.msgObject = data
        console.log(666666777777)
        console.log(this.msgObject)
      },
      changeState(data){
        var p = {}
        p.role_id = data.role_id
        p.isdisabled = ~~data.isdisabled 
        this.$http.patch(api.SYS_ROLE_MODIFY + data.role_id, p)
          .then(res => {
              this.$message('修改成功！');
              this.load()
          }).catch(e => {
              this.$message(e);
              this.load()
        })
      },
      deleteClick(){
      },
      addRoleClick(data){
        this.addChildVisible = true
        this.addRole.row = data
      },
      modifyClick(data){
        console.log(data)
        this.modifyRole.outerVisible = true
        this.modifyRole.row = data
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
      batchDelete(data){
        this.$confirm('确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.delete(api.SYS_ADMIN_ROLE_DELETE + data.id)
            .then(res => {
              this.$message('操作成功！');
              this.load();
            }).catch(e => {
            this.$message(e);
            console.log(checkKeys);
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
        // this.$store.dispatch('loadAdminRoles')
        var  parms = {}
        parms.pageNum = this.pageNum
        parms.pageSize = this.pageSize
        sysApi.adminRoleList(parms).then(res => {
          this.total = ~~res.total
          this.adminRoles = res.rows
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
      adminRoles:function(value){
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
  #permissionDo .el-dialog--small{
    width: 100%;
  }
  #showUser .el-dialog--small{
    width: 1250px;
  }
</style>
