<template>
  <div>
    <div style="margin-top:50px;">
      <el-input v-model="teacherName" placeholder="请输入教师姓名" style="width:80%" clearable></el-input>
      <el-button type="primary" style="margin-left: 10px;" @click="searchTeacherByName">搜索</el-button>
      <el-button type="primary" style="margin-left:10px;margin-bottom: 20px;" @click="showDialog">新增教师</el-button>
    </div>
    <div>

      <el-table
              @selection-change="handleSelectionChange"
              :data="teachers"
              border>
        <el-table-column
                type="selection"
                width="55">
        </el-table-column>
        <el-table-column
                prop="uid"
                label="学号"
                width="180">
        </el-table-column>
        <el-table-column
                prop="name"
                label="姓名"
                width="180">
        </el-table-column>
        <el-table-column
                prop="sex"
                label="性别"
                width="180">
        </el-table-column>
        <el-table-column
                prop="age"
                label="年龄"
                width="180">
        </el-table-column>
        <el-table-column
                label="操作">
                align="left">
          <template slot-scope="scope">
            <el-button
                    size="mini"
                    @click="handleEdit(scope.row)">编辑</el-button>
            <el-button
                    size="mini"
                    type="danger"
                    @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="danger" size="mini" style="margin-top: 12px" :disabled="multipleSelection.length === 0" @click="deleteTeachers">批量删除</el-button>
    </div>
    <el-dialog :title="dialogTitle[dialogStatus]" :visible.sync="dialogFormVisible" center>
      <el-form :model="form" :rules="rules" ref="teacher">
        <el-form-item label="姓名" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别" :label-width="formLabelWidth" prop="sex">
          <el-select v-model="form.sex" placeholder="请选择" style="width: 100%">
            <el-option
                    v-for="item in options"
                    :key="item.value"
                    :value="item.label">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年龄" :label-width="formLabelWidth" prop="age">
          <el-input v-model.number="form.age" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitTeacher">确 定</el-button>
      </div>
    </el-dialog>
    <el-upload
            style="margin-top:20px;"
            action="/upload"
            multiple
            :on-success="handleSuccess"
            :limit="3"
            :file-list="fileList">
      <el-button size="small" type="primary">点击上传</el-button>
    </el-upload>
  </div>
</template>

<script>
// @ is an alias to /src


export default {
  name: 'Home',
  components: {
  },
  data () {
    return {
      fileList: [],
      teacherName: '',
      multipleSelection:[],
      dialogTitle: {
        addTeacher: "新增教师",
        editTeacher: "编辑教师"
      },
      dialogStatus: "",
      rules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '请选择性别', trigger: 'change' }
        ],
        age: [
          { required: true, message: '年龄不能为空'},
          { type: 'number', message: '年龄必须为数字值'}
        ]
      },
      options: [{
        value: '1',
        label: '男'
      }, {
        value: '2',
        label: '女'
      }],
      msg: '',
      teachers:[],
      search: '',
      dialogFormVisible: false,
      form: {
        name: '',
        age: '',
        sex: ''
      },
      formLabelWidth: '120px',
    }
  },
  created() {
    this.findAllTeachers();
  },
  watch:{
    teacherName () {
        this.findAllTeachers();
    }
  },
  methods: {
    // deleteFile (file) {
    //   console.log(file)
    // },
    handleSuccess (file) {
      const filename = file.name;
      this.$message({
        message: '文件上传成功！',
        type: 'success'
      });
    },
    searchTeacherByName () {
        if (this.teacherName !== '') {
            this.$axios.get("/teacher/findTeacherByName?name="+this.teacherName).then( (resp)=> {
                this.teachers = resp.data;
            }).catch( (error)=>{
                this.$message({
                    type: 'error',
                    message: "查询失败，原因是"+error.data.message
                });
            })
        }
    },
    deleteTeachers () {
      this.$confirm('此操作将永久删除教师, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids = '?';
        this.multipleSelection.forEach( (item)=>{
          ids += 'ids='+item.uid+'&'
        });
        this.$axios.post("/teacher/deleteTeachersByIds"+ids).then( (resp)=> {
          if (resp) {
            this.findAllTeachers();
            this.$message.success("删除成功！");
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(val)
    },
    submitTeacher () {
      if (this.dialogStatus === 'addTeacher'){
        this.addTeacher();
      } else if(this.dialogStatus === "editTeacher") {
        this.editTeacher();
      }
    },
    findAllTeachers () {
      this.$axios.get("/teacher/findAllTeachers")
              .then((res) => {
                this.teachers = res.data
              })
              .catch(error => {
                this.$message({
                  type: 'error',
                  message: "查询失败，原因是"+error.data.message
                });
              });
    },
    handleEdit (row) {
      this.dialogFormVisible = true;
      this.dialogStatus = "editTeacher";
      this.form.uid = row.uid;
      this.form.name = row.name;
      this.form.age = row.age;
      this.form.sex = row.sex;
    },
    handleDelete (row) {
      this.$confirm('此操作将永久删除该教师, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.post("/teacher/deleteTeacher?uid="+row.uid).then ((resp)=>{
          this.$message.success("删除成功!")
          this.findAllTeachers();
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    showDialog () {
      this.form.uid = '';
      this.form.name = '';
      this.form.age = '';
      this.form.sex = '';
      this.dialogFormVisible = true;
      this.dialogStatus = "addTeacher";
    },
    addTeacher () {
      this.$refs.teacher.validate((valid) => {
        if (valid) {
          this.$axios.post("/teacher/addTeacher",this.form).then( (resp)=>{
            if (resp) {
              this.dialogFormVisible = false;
              this.$message.success("添加成功！");
              this.findAllTeachers();
            }
          }).catch((error)=>{
            this.$message({
              message: '添加数据失败，原因是'+error.data.message,
              type: 'error'
            })
          })
        } else {
          this.$message({
            message: '请输入所有字段',
            type: 'error'
          })
          return false;
        }
      });
    },
    editTeacher () {
      debugger
      this.$axios.post("/teacher/updateTeacher",this.form).then( (resp)=>{
        this.dialogFormVisible = false;
        this.$message.success("修改成功!");
        this.findAllTeachers();
      }).catch( (error)=> {
        this.$message({
          message: '数据更新失败，原因是'+error.data.message,
          type: 'error'
        })
      })
    }
  }
}
</script>
<style scoped>
  .table {
    margin: 0 auto;
    clear: both;
  }
</style>
