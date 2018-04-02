<template>

  <imp-panel>
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="部门" >
        <el-input v-model="childMsg.depart_name" :disabled="true"></el-input>
        <!-- <el-select-tree v-model="depart_id" :treeData="adminDepartmentTree" :propNames="defaultProps" clearable      placeholder="选择部门"> -->
        <!-- </el-select-tree> -->
      </el-form-item>
      <el-form-item label="父角色" >
        <el-input v-model="childMsg.role_name" :disabled="true"></el-input>
        <!-- <el-select-tree v-model="depart_id" :treeData="adminDepartmentTree" :propNames="defaultProps" clearable      placeholder="选择部门"> -->
        <!-- </el-select-tree> -->
      </el-form-item>
      <el-form-item label="角色名">
        <el-input v-model="role_name" ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即添加</el-button>
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
      'tree-select':treeSelect
    },
    props:['childMsg'],
    data(){
      return {
        pRole:[],
        form: {
          depart_name: ''
        },
        role_name:null,
        defaultProps: {
          children: 'children',
          label: 'name',
          id: "id",
        }
      }
    },
    mounted() {
      this.changeRole()
    },
    computed: {
      // adminArrays() {
      //  return this.$store.state.admins
      // }
      ...mapGetters([
        'adminDepartment'
      ])
    },
    methods: {
      tobaba(msg){//{ac:1,mg:'msg'}1:关闭，2：弹出消息
        this.$emit('dialogMsg',msg)
      },
      changeRole(){
        sysApi.roleTree({parent_id:childMsg.role_id}).then(res => {
          this.pRole = formateRoleData(res.data)
        })
      },
      onCancel(){
        this.tobaba({ac:true})
      },
      onSubmit(){
        this.childMsg.role_id = null
        this.childMsg.role_name = this.role_name
        this.$http.post(api.SYS_ROLE_ADD, this.childMsg)
          .then(res => {
            this.tobaba({ac:true})
            this.$message('添加成功！');
          }).catch(e => {
            this.tobaba({ac:false,mg:'添加失败!'})
        })
      },
    },
    created(){
      // this.load();
      // this.changeRole()
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
    width: 380px;
  }
</style>
