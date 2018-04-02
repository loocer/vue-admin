<template>

  <imp-panel>
    <h3 class="box-title" slot="header" style="width: 100%;">
      <el-button type="primary" icon="plus" @click="newAdd">新增</el-button>
      <!-- <el-button type="danger" icon="delete" @click="batchDelete">删除</el-button> -->
    </h3>
    <el-row slot="body" style="margin-bottom: 20px;" :gutter="24">
    <!--   <el-col :span="6" :xs="24" :sm="24" :md="3" :lg="3" style="margin-bottom: 20px;">
        <el-tree v-if="resourceTree"
                 ref="resourceTree"
                 :data="resourceTree"
                 show-checkbox
                 highlight-current
                 :render-content="renderContent"
                 @node-click="handleNodeClick" clearable node-key="id" :props="defaultProps"></el-tree>


        <el-tree
          :data="resourceTree"
          :props="defaultProps"
          accordion
          @node-click="handleNodeClick">
        </el-tree>
      </el-col> -->
      <el-col :span="6" :xs="24" :sm="24" :md="10" :lg="10" style="margin-bottom: 20px;">
        <!-- <el-tree v-if="resourceTree"
                 ref="resourceTree"
                 :data="resourceTree"
                 show-checkbox
                 highlight-current
                 :render-content="renderContent"
                 @node-click="handleNodeClick" clearable node-key="id" :props="defaultProps"></el-tree> -->
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>选择资源</span>
          </div>

          <el-col :span="6" :xs="24" :sm="24" :md="12" :lg="12" style="margin-bottom: 20px;">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>权限</span>
              </div>
              <el-tree
                :data="resourceTree"
                :props="defaultProps"
                accordion
                @node-click="handleNodeClick">
              </el-tree>
            </el-card>
            
          </el-col>
          <el-col :span="6" :xs="24" :sm="24" :md="10" :lg="10" style="margin-bottom: 20px;">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>资源</span>
                <!-- <el-button style="float: right; padding: 3px 3px;" size="small" type="danger" round >删除</el-button> -->
                <!-- <el-button style="float: right; padding: 3px 3px;margin-right:3px;" size="small" @click="addButton" type="primary" round >添加</el-button> -->
              </div>
              <div class='text item float '>
                <el-col v-for="i in resource"  :span="24" >
                  <div @click="modify(i)"> 
                  <el-tag type="success"  @close="batchDelete(i)" closable style="margin:0 0 10px 0;">{{i.frontend_text}}</el-tag>
                  </div>  
                   <!-- <el-button style="float: right; padding: 3px 3px;" size="small" @click="batchDelete(i)" type="danger"  round>删除</el-button> -->
                  <!--el-checkbox v-model="i.id"  border>{{i.frontend_text}}</el-checkbox> -->
                </el-col>
              </div>
            </el-card>
          </el-col>

        </el-card>
      </el-col>
      <el-col :span="18" :xs="24" :sm="24" :md="10" :lg="10">
        <el-card class="box-card">
          <!--<div slot="header" class="clearfix">-->
          <!--<el-button type="primary" style="float: right;" @click="dialogFormVisible = true"><i class="el-icon-plus"></i></el-button>-->
          <!--&lt;!&ndash;<el-button type="primary" @click="editSelectedMenu" icon="edit"></el-button>&ndash;&gt;-->
          <!--&lt;!&ndash;<el-button type="primary" @click="deleteSelectedMenu" icon="delete"></el-button>&ndash;&gt;-->
          <!--</div>-->
          <div class="text item">
            <el-form :model="form" ref="form">
              <el-form-item label="所属权限" :label-width="formLabelWidth">
                <!--<el-input v-model="form.parentId" auto-complete="off"></el-input>-->
                <el-select-tree v-model="form.parentId" :treeData="resourceTree" :propNames="defaultProps" clearable
                                placeholder="请选择所属权限">
                </el-select-tree>
              </el-form-item>
              <el-form-item label="资源名称" :label-width="formLabelWidth">
                <el-input v-model="form.text" auto-complete="off"></el-input>
              </el-form-item>

              <el-form-item label="是否生效" :label-width="formLabelWidth">
                <el-radio class="radio" v-model="form.usable" label="1">是</el-radio>
                <el-radio class="radio" v-model="form.usable" label="0">否</el-radio>
              </el-form-item>

              <el-form-item label="备注" :label-width="formLabelWidth">
                <el-input v-model="form.remarks" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="" :label-width="formLabelWidth">
                <el-button type="primary" @click="onSubmit" v-text="form.id?'修改':'提交'"></el-button>
                <el-button type="danger" @click="batchDelete(form)" icon="delete" v-show="form.id && form.id!=null">删除
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </imp-panel>

</template>
<script>

  import panel from "../../components/panel.vue"
  import selectTree from "../../components/selectTree.vue"
  import treeter from "../../components/treeter"
  import merge from 'element-ui/src/utils/merge';
  import * as sysApi from '../../services/sys'
  import { formatePermissionsData } from '../../common/utils'
  import * as api from "../../api"

  export default {
    mixins: [treeter],
    components: {
      'imp-panel': panel,
      'el-select-tree': selectTree
    },
    data(){
      return {
        formLabelWidth: '100px',
        defaultProps: {
          children: 'children',
          label: 'name',
          id: "id",
        },
        resourceTree: [],
        maxId:700000,
        resource: [],
        roleId: 0,
        form: {
          id: null,
          parentId: null,
          name: '',
          code: '',
          type: 1,
          sort: 0,
          usable: '1',
          remarks: ''
        }
      }
    },
    methods: {
      newAdd(){
        this.form.id = null
        this.form.text = null
        this.form.remarks = null
      },
      renderContent(h, {node, data, store}) {
      },
      // batchDelete(){
      //   this.$http.get(api.SYS_RESOURCE_DELETE + "?resourceIds=" + this.form.id)
      //     .then(res => {
      //       this.$message('操作成功');
      //       this.deleteFromTree(this.resourceTree, this.form.id);
      //       this.newAdd();
      //     }).catch(e =>{
      //     this.$message('操作成功');
      //     this.deleteFromTree(this.resourceTree, this.form.id);
      //     this.newAdd();
      //   })
      // },
      batchDelete(data){
        this.$confirm('确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.delete(api.SYS_ADMINFRONTENDPERMISSION_DELETE + data.id)
            .then(res => {
              this.newAdd()
              this.$message('删除成功')
              this.loadResource(this.form.parentId)
            }).catch(e => {
            this.$message('删除成功');
          })
        });
      },
      addButton(){
        var temp = this
        this.form = {
          id: null,
          parentId: temp.roleId,
          name: '',
          code: '',
          type: 1,
          sort: 0,
          usable: '1',
          remarks: ''
        }
      },
      handleNodeClick(data){
        this.form.parentId = data.id
        this.roleId = data.id
        this.loadResource(data.id)
      },
      modify(data){
        this.form.id = data.id
        this.form.parentId = data.permission_id
        this.form.usable = data.isdisabled
        this.form.text = data.frontend_text
        this.form.remarks  = data.remark
      },
      onSubmit(){
        if (this.form.id == null) {
          var p={}
          p.permission_id = this.form.parentId
          p.isdisabled = ~~!this.form.usable
          p.frontend_text = this.form.text
          p.remark = this.form.remarks
          this.$http.post(api.SYS_ADMINFRONTENDPERMISSION_ADD, p)
            .then(res => {
              this.$message('添加成功');
              this.loadResource(p.permission_id);
              this.form.id = res.data.id;
            }).catch(e => {
           
            this.$message('操作失败');
            
          })
        } else {
          var p={}
              p.id = this.form.id
              p.permission_id = this.form.parentId
              p.isdisabled = ~~!this.form.usable
              p.frontend_text = this.form.text
              p.remark = this.form.remarks
          this.$http.patch(api.SYS_ADMINFRONTENDPERMISSION_MODIFY + p.id, p)
            .then(res => {
              this.loadResource(p.permission_id);
              this.$message('修改成功');
            }).catch(e=>{
              this.$message('操作失败');
          })
        }
      },
      load(){
        sysApi.permissionsList()
          .then(res=>{
            this.resourceTree = formatePermissionsData(res);
          })
      },
      loadResource(permission_id){
        sysApi.resourcePtree({permission_id:permission_id}).then(res => {
          this.resource = res.rows
        })
      }
    },
    created(){
      this.load();
    }
  }
</script>

<style>
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }
  .el-tag{
    cursor: pointer;
  }
</style>
