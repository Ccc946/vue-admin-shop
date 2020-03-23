<template>
    <div class="login_container">
        <div class="login_box">
            <!-- 登录头像 -->
            <div class="avatar_box">
                <img src="../assets/logo.png" alt="">
            </div>
            <!-- 登录表单 -->
            <el-form 
            :rules="loginFormRules"
            ref="loginFormRef"
            :model="loginForm"
            label-width="80px" 
            class="login_form">
                <el-form-item label="用户" prop="username">
                    <el-input
                    v-model="loginForm.username"
                    placeholder="请输入用户名"
                    prefix-icon="el-icon-s-custom"></el-input>
                </el-form-item>

                <el-form-item label="密码" prop="password">
                    <el-input
                    type="password"
                    v-model="loginForm.password"
                    placeholder="请输入密码"
                    prefix-icon="el-icon-key"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="resetForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                // 表单信息
                loginForm:{
                    username:'admin',
                    password:'123456'
                },
                // 表单验证规则
                loginFormRules: {
                    username:[
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                        { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                    ],
                    password:[
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
                    ]
                }
            }
        },
        methods:{
            // 重置表单
            resetForm() {
                this.$refs.loginFormRef.resetFields();
            },
            // 表单提交
            login() {
                this.$refs.loginFormRef.validate(async (valid) => {
                    if(!valid) {
                        return false;
                    }else {
                        const { data:res } = await this.$http.post('login', this.loginForm);
                        if(res.meta.status !== 200) {
                            return this.$message.error("登录失败!");
                        } else {
                            window.sessionStorage.setItem('token',res.data.token);
                            this.$message.success("登录成功!");
                            this.$router.push('/home');
                        }
                    }
                });
            }
        }
    }
</script>

<style lang="less" scoped>
.login_container {
    background-color: #2b4b6b;
    height: 100%;
    .login_box {
        height: 400px;
        width: 500px;
        background: #f0f0f0;
        position: absolute;
        border-radius: 4px;
        top: 50%;
        left: 50%;
        -webkit-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
        .avatar_box {
            width: 130px;
            height: 130px;
            padding: 10px;
            position: absolute;
            left: 50%;
            -webkit-transform: translate(-50%, -50%);
            transform: translate(-50%, -50%);
            background-color: aliceblue;
            border-radius: 50%;
            box-shadow: 0 0 10px #ddd;
            img {
                border-radius: 50%;
                width: 100%;
                height: 100%;
                background-color: #eee;
            }
        }
    }
}
.login_form {
    position: absolute;
    bottom: 60px;
    width: 100%;
}
.el-form-item {
    padding-right: 40px;
}
</style>