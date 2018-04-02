<template>

  <imp-panel>
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="角色名称">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="所属部门" >
                <!--<el-input v-model="form.parentId" auto-complete="off"></el-input>-->
         <tree-select
            :treeData="adminDepartmentTree"
            :treeProps="defaultProps"
            v-model="depart_id"
            :multiple="false"
            placeholder="请选择部门"
            @setSelectedId="setDepartId">
        </tree-select>
      </el-form-item>
                <!--<el-input v-model="form.parentId" auto-complete="off"></el-input>-->
       <!--  <el-select-tree v-model="depart_id" :treeData="adminDepartmentTree" :propNames="defaultProps" clearable
                            @active-item-change="handleItemChange"    placeholder="集团">
        </el-select-tree>
      </el-form-item> -->
      <el-form-item label="父角色">
        <tree-select
            :treeData="pRole"
            :treeProps="defaultProps"
            v-model="form.parent_id"
            :multiple="false"
            placeholder="请选择父角色"
            @setSelectedId="setRoleId">
        </tree-select>
        <!-- <el-select-tree v-model="form.parent_id" :treeData="pRole" :propNames="defaultProps" clearable
                                placeholder="集团">
        </el-select-tree> -->
      </el-form-item>
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
    data(){
      return {
        form: {
          name: '',
          parent_id: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        depart_id:null,
        defaultProps: {
          children: 'children',
          label: 'name',
          id: "id",
        },
        pRole:[]
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
    watch: {
      depart_id(val){
        this.changeRole(val)
        console.log(val)
      }
    },
    methods: {
      tobaba(msg){//{ac:1,mg:'msg'}1:关闭，2：弹出消息
        this.$emit('dialogMsg',msg)
      },
      onCancel(){
        this.tobaba({ac:true})
      },
      handleNodeClick(data){
        this.form = data;
      },
      handleItemChange(data){
        console.log(data)
      },
      setDepartId(data){
        this.depart_id = data
        this.changeRole(data)
      },
      setRoleId(data){
        this.form.parent_id = data
      },
      changeRole(department){
        var p={}
        p.depart_id = department
        sysApi.roleTree(p).then(res => {
          this.pRole = formateRoleData(res.data)
        })
      },
      onSubmit(){
        var p ={}
        // p.id = this.form.id
        p.depart_id = this.depart_id
        p.parent_id = this.form.parent_id
        p.parentId = this.form.parentId
        p.role_name = this.form.name
        this.$http.post(api.SYS_ROLE_ADD, p)
          .then(res => {
            this.tobaba({ac:true})
            this.$message('添加成功!')
            this.load()
          }).catch(e => {
            this.$message(e)
          // this.maxId += 1;
          // this.$message('操作成功');
          // this.form.id = this.maxId;
          // var  ddd = {
          //   id: this.form.id,
          //   name: this.form.name,
          //   sort: this.form.sort,
          //   enName:this.form.enName,
          //   parentId: this.form.parentId,
          //   usable: this.form.usable,
          //   children:[]
          // }
          // this.appendTreeNode(this.roleTree, ddd);
          // this.roleTree.push({});
          // this.roleTree.pop();
        })
      },
      load(){
        sysApi.roleList({}).then(res => {
          this.roleTree = formateRoleData(res.data);
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
