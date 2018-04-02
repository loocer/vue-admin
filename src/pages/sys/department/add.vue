<template>

  <imp-panel>
    <el-form ref="form" :model="form" label-width="100px">
      <el-form-item label="部门名称">
        <el-input v-model="form.depart_name"></el-input>
      </el-form-item>
      <el-form-item label="上级部门" v-if="flag">
                <!--<el-input v-model="form.parentId" auto-complete="off"></el-input>-->
         <tree-select
            :treeData="adminArrays"
            :treeProps="defaultProps"
            v-model="form.parent_id"
            :multiple="false"
            placeholder="请选择部门"
            @setSelectedId="setSelectedId">
        </tree-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <el-button @click="tobaba({ac:true})">取消</el-button>
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
    import { formatePermissionsData } from '@/common/utils'

  export default {
    mixins: [treeter],
    components: {
      'imp-panel': panel,
      'el-select-tree': selectTree,
      'tree-select':treeSelect
    },
    data(){
      return {
        form: {
          dept_sort: 0
        },
        adminArrays:null,
        flag:false,
        defaultProps: {
          children: 'children',
          label: 'name',
          id: "id",
        },
      }
    },
    mounted() {
      this.adminArrays = this.$store.state.adminDepartmentTree
    },
    methods: {
      tobaba(msg){//{ac:1,mg:'msg'}1:关闭，2：弹出消息
        this.$emit('dialogMsg',msg)
      },
      handleNodeClick(data){
        this.form = data;
      },
      setSelectedId(data){
          this.form.parent_id = data
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
      onSubmit(){
        var temp = this
        this.$http.post(api.SYS_DEPARTMENT_ADD, this.form)
          .then(res => {
            temp.form = {
              id: null,
              depart_name: null,
              parent_id: null,
              usable: '1',
              remarks: ''
            };
            this.tobaba({ac:true})
            this.$message('创建成功！');
          }).catch(e => {
            this.tobaba({ac:false,mg:'创建失败！'})
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
      }
    },
    watch:{
      adminDepartmentTree(value){
      },
      adminArrays(value){
        if(value!=null){
          this.flag = true
        }
      }
    },
    created(){
      // sysApi.permissionsList()
      //     .then(res=>{
      //       this.treesdf = formatePermissionsData(res.data);
      //     })
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

</style>
