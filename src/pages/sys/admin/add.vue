<template>

  <imp-panel>
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="用户名">
        <el-input v-model="form.admin_name" ></el-input>
      </el-form-item>
      <el-form-item label="所属部门" >
        <tree-select
            :treeData="adminDepartmentTree"
            :treeProps="defaultProps"
            v-model="form.depart_id"
            :multiple="false"
            placeholder="请选择部门"
            
            @setSelectedId="setSelectedId">
        </tree-select>
      </el-form-item>
      <el-form-item label="email">
        <el-input v-model="form.admin_email" ></el-input>
      </el-form-item>
      <el-form-item label="口令卡">
        <el-input v-model="form.koulin" ></el-input>
      </el-form-item>
      <el-form-item label="用户编号">
        <el-input v-model="form.staff_no" ></el-input>
      </el-form-item>
       <!--  <el-select-tree v-model="form.depart_id" :treeData="adminDepartmentTree" :propNames="defaultProps" clearable      placeholder="选择部门">
        </el-select-tree> -->
     
      <!-- <el-form-item label="角色">
        <el-select-tree v-model="form.role_id" :treeData="pRole" :propNames="defaultProps" clearable placeholder="选择角色">
        </el-select-tree>
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </imp-panel>

</template>
<script>

  import panel from "@/components/panel.vue"
  import selectTree from "@/components/selectTree.vue"
  import treeter from "@/components/treeter"
  import treeSelect from "@/components/tree.vue"
  import * as sysApi from '@/services/sys'
  import * as api from "@/api"
  import { formateRoleData } from '@/common/utils'
  import { mapGetters } from 'vuex'
  import { mapActions } from 'vuex'
  import axios from "@/common/axios";
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
        depart_id:0,
        pRole:[],
        initFlag:true,
        defaultProps: {
          children: 'children',
          label: 'name',
          id: "id",
        }
      }
    },
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
    },
    methods: {
      tobaba(msg){//{ac:1,mg:'msg'}1:关闭，2：弹出消息
        this.$emit('dialogMsg',msg)
      },
      // changeRole(department){
      //   var p={}
      //   p.depar_id = department
      //   sysApi.roleTree(p).then(res => {
      //     this.pRole = formateRoleData(res.data)
      //   })
      // },
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
      setSelectedId(data){
          this.form.depart_id = data
      },
      onCancel(){
        this.tobaba({ac:true})
      },
      onSubmit(){
        // this.form.depart_id = this.depart_id
        axios.post(api.SYS_ADMINS_ADD, this.form)
          .then(res => {
            this.$message('添加成功');
            this.tobaba({ac:true})
          }).catch(e => {
            this.$message(e);
        })
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
      adminDepartmentTree(){

      }
      // depart_id(val){
      //   this.changeRole(val)
      //   console.log(val)
      // }
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
