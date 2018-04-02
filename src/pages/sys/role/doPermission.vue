<template>
  <imp-panel>
    <el-form ref="form" :model="form" label-width="80px">
      <div v-if="resourceTree.length==0"> 正在加载列表。。。。</div>
      <el-form-item label="资源" >
        <el-tree
          ref="resourceTree"
          :data="resourceTree"
          show-checkbox
          node-key="id"
          :default-checked-keys="checkds"
          :default-expanded-keys="checkds"
          show-checkbox
          default-expand-all
          :props="defaultProps" v-if="flag">
        </el-tree>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="configUserRoles">立即配置</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </imp-panel>
</template>
<script>

  import panel from "@/components/panel.vue"
  import selectTree from "@/components/selectTree.vue"
  import treeter from "@/components/treeter"
  import merge from 'element-ui/src/utils/merge';
  import * as sysApi from '@/services/sys'
  import { formatePermissionResourceData,formatePermissionArray } from '@/common/utils'
  import * as api from "@/api"

  export default {
    mixins: [treeter],
    components: {
      'imp-panel': panel,
      'el-select-tree': selectTree
    },
    props:['childMsg'],
    data(){
      return {
        formLabelWidth: '100px',
        defaultProps: {
          children: 'children',
          label: 'name',
          id: "id",
        },
        resArray:[],
        resourceTree: [],
        checkds:[],
        maxId:700000,
        resource: [],
        roleId: 0,
        flag:false,
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
    mounted() {
      this.load()
    },
    watch:{
      resourceTree(val){
        if(val!==null){
          this.flag = true
        }
      }
    },
    methods: {
      tobaba(msg){//{ac:1,mg:'msg'}1:关闭，2：弹出消息
        this.$emit('dialogMsg',msg)
      },
      onCancel(){
        this.tobaba({ac:true})
      },
      newAdd(){
        this.form.id = null
        this.form.text = null
        this.form.remarks = null
      },
      renderContent(h, {node, data, store}) {
      },
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
      handleNodeClick(data){
        this.form.parentId = data.id
        this.roleId = data.id
        this.loadResource(data.id)
      },
      configUserRoles(){
        let checkedKeys = this.$refs.resourceTree.getCheckedKeys();
        this.$http.patch(api.CONTEXT + '/adminRole/' + this.childMsg.id + '/permAndSource' ,{sourceIds:checkedKeys.join(',')})
          .then(res => {
            this.$message('配置成功');
            this.dialogVisible = false;
        }).catch(e => {
            this.$message(e);
        })
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
          p.isdisabled = this.form.usable
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
              p.isdisabled = this.form.usable
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
        this.$http.put(api.CONTEXT + '/adminRole/' + this.childMsg.id + '/permAndSource')
            .then(res => {
            this.resourceTree = formatePermissionResourceData(res.data.result.allPermSource);
            this.resArray = formatePermissionArray(res.data.result.allPermSource);
            this.checkds = res.data.result.rolePermSource
        }).catch(e => {
            this.$message(e);
        })
        // sysApi.permissionsList()
        //   .then(res=>{
        //     this.resourceTree = formatePermissionsData(res.data);
        //   })
      },
      loadResource(permission_id){
        sysApi.resourceList({permission_id:permission_id}).then(res => {
          this.resource = res.data
        })
      }
    },
    created(){
      
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
