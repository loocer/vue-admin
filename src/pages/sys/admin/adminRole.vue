<template>

  <imp-panel>
    <el-form ref="form" :model="childMsg" label-width="80px">
      <el-form-item label="用户名">
        <el-input v-model="childMsg.admin_name" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="所属部门" >
        <el-input v-model="childMsg.depart_name" :disabled="true"></el-input>
        <!-- <el-select-tree v-model="depart_id" :treeData="adminDepartmentTree" :propNames="defaultProps" clearable      placeholder="选择部门"> -->
        </el-select-tree>
      </el-form-item>
      <el-form-item label="角色" >
        <tree-select
          :treeData="pRole"
          :treeProps="defaultProps"
          v-model="childMsg.role_id"
          :multiple="true"
          placeholder="请选择角色"
          @setSelectedId="setSelectedId">
      </tree-select>
        <!-- <el-select-tree v-model="childMsg.role_id" :treeData="pRole" :propNames="defaultProps" clearable placeholder="选择角色">
        </el-select-tree> -->
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </imp-panel>

</template>
<script>

  import panel from "@/components/panel.vue"
  import selectTree from "@/components/selectTree.vue"
  import treeSelect from "@/components/tree.vue"
  import treeter from "@/components/treeter"
  import * as sysApi from '@/services/sys'
  import * as api from "@/api"
  import { formateRoleData } from '@/common/utils'
  import { mapGetters } from 'vuex'
  import { mapActions } from 'vuex'
  export default {
    mixins: [treeter],
    components: {
      'imp-panel': panel,
      'el-select-tree': selectTree,
      'tree-select': treeSelect
    },
    data(){
      return {
        form: {
          depart_id: null,
          admin_name:'',
          role_id:null
        },
        pRole:[],
        value:null,
        depart_id:null,
        defaultProps: {
          children: 'children',
          label: 'name',
          id: "id",
        }
      }
    },
    props:['childMsg'],
    computed: {
      // adminArrays() {
      //  return this.$store.state.admins
      // }
      ...mapGetters([
        'adminDepartmentTree'
      ])
    },
    mounted() {
      this.load();
      this.changeRole(this.childMsg.depar_id)
    },
    methods: {
      setSelectedId(val){
        console.log(333333334444444)
        console.log(val)
        this.value = val.join(',')
      },
      showTreeError(error){
        Message.info(error.message)
      },
      tobaba(msg){//{ac:1,mg:'msg'}1:关闭，2：弹出消息
        this.$emit('dialogMsg',msg)
      },
      changeRole(department){
        var p={}
        p.depar_id = department
        sysApi.roleTree(p).then(res => {
          this.pRole = formateRoleData(res.data)
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
      onCancel(){
        this.tobaba({ac:true})
      },
      onSubmit(){
        var temp = this
        var p = {}
        p.roleIds = temp.value
        this.$http.put(api.CONTEXT + '/adminUser/' + this.childMsg.id +'/role' , p)
          .then(res => {
            this.$message('配置成功!');
            this.tobaba({ac:true})
          }).catch(e => {
            this.$message(e);
        })
        // this.childMsg.depart_id = this.depart_id
        // this.$http.put(api.SYS_ADMINS_MODIFY + this.childMsg.id, this.childMsg)
        //   .then(res => {
        //     this.$message('配置成功!');
        //     this.tobaba({ac:true})
        //   }).catch(e => {
        //     this.$message('配置失败!');
        // })
      },
     
      load(){
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
      }
    },
    watch: {
      depart_id(val){
        this.changeRole(val)
        console.log(val)
      }
    },
    created(){
      // this.load();
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
  /*.el-dialog--small{
    width: 350px;
  }*/
</style>
