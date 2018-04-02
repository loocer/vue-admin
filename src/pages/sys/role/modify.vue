<template>

  <imp-panel>
    <el-form ref="form" :model="childMsg" label-width="80px">
      <el-form-item label="角色名">
        <el-input v-model="childMsg.role_name" ></el-input>
      </el-form-item>
      <el-form-item label="父角色">
        <tree-select
            :treeData="pRole"
            :treeProps="defaultProps"
            v-model="childMsg.parent_id"
            :multiple="false"
            placeholder="请选择父角色"
            @setSelectedId="setDepartId">
        </tree-select>
       <!--  <el-select-tree v-model="childMsg.parent_id" :treeData="pRole" :propNames="defaultProps" clearable
                                placeholder="集团">
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
  import treeter from "@/components/treeter"
  import treeSelect from "@/components/tree.vue"
  import * as sysApi from '@/services/sys'
  import * as api from "@/api"
  import { formateRoleData } from '@/common/utils'

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
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: '',
          flag: true
        },
        defaultProps: {
          children: 'children',
          label: 'name',
          id: "id",
        }
      }
    },
    mounted() {
      this.load();
      this.changeRole()
    },
    methods: {
      tobaba(msg){//{ac:1,mg:'msg'}1:关闭，2：弹出消息
        this.$emit('dialogMsg',msg)
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
      changeRole(){
        sysApi.roleTree({}).then(res => {
          this.pRole = formateRoleData(res.data)
        })
      },
      onSubmit(){
        this.$http.patch(api.SYS_ROLE_MODIFY + this.childMsg.role_id, this.childMsg)
          .then(res => {
              this.tobaba({ac:true})
              this.$message('修改成功！');
          }).catch(e => {
              this.$message(e);
        })
      },
      load(){
      },
      setDepartId(data){

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
  .el-dialog--small{
    width: 380px;
  }
</style>
