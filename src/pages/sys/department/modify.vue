<template>

  <imp-panel>
    <el-form ref="form" :model="childMsg" label-width="80px">
      <el-form-item label="部门名称">
        <el-input v-model="childMsg.depart_name"></el-input>
      </el-form-item>
      <el-form-item label="上级部门" v-if="dataFlag">
                <!--<el-input v-model="form.parentId" auto-complete="off"></el-input>-->
        <tree-select
            :treeData="departmentTree"
            :treeProps="defaultProps"
            v-model="childMsg.parent_id"
            :multiple="false"
            placeholder="请选择部门"
            
            @setSelectedId="setSelectedId">
        </tree-select>
        <!-- <el-select-tree v-model="childMsg.parent_id" :treeData="departmentTree" :propNames="defaultProps" clearable
                                placeholder="部门">
        </el-select-tree> -->
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即修改</el-button>
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
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        dataFlag: false,
        departmentTree: null,
        defaultProps: {
          children: 'children',
          label: 'name',
          id: "id",
        },
      }
    },
    mounted() {
      console.log('-=-=-=-=---------============')
      console.log(this.$store.state.adminDepartmentTree)
      this.departmentTree = this.$store.state.adminDepartmentTree
      console.log(this.departmentTree)
    },
    watch: {
      departmentTree(value) {
        if(value != null){
          this.dataFlag = true
        }
      }
    },
    methods: {
      tobaba(msg){//{ac:1,mg:'msg'}1:关闭，2：弹出消息
        this.$emit('dialogMsg',msg)
      },
      setSelectedId(data){
        this.childMsg.parent_id = data
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
        this.childMsg.isdisabled  = ~~this.childMsg.isdisabled 
        this.$http.patch(api.SYS_DEPARTMENT_MODIFY + this.childMsg.id, this.childMsg)
          .then(res => {
            this.tobaba({ac:true,mg:'修改成功!'})
          }).catch(e => {
            this.tobaba({ac:false,mg:'修改失败!'})
        })
      },
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

</style>
