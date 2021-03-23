<template>
<div :class="formClass">
    <div>
        <i class="el-icon-close" @click="close" title="关闭"></i>
    </div>
    <div>
        <el-button-group>
            <el-button type="primary" @click="setLogin" title="登录" :style="bkColor1">登录</el-button>
            <el-button type="primary" @click="setRegister" title="注册" :style="bkColor2" >注册</el-button>
        </el-button-group>
    </div>
    <el-form :model="formData" ref="formData" :rules="rules" status-icon>
        <el-form-item label="用户名" prop="username">
            <el-input v-model="formData.username" type="text" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
            <el-input v-model="formData.password" type="password" placeholderd="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="性别" v-if="flag">
            <el-radio-group v-model="formData.sex">
                <el-radio label="男"></el-radio>
                <el-radio label="女"></el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item prop="username">
            <el-button type="primary" @click="submitUserImformation(formData)" style="width:100%" title="提交">完成</el-button>
        </el-form-item>
    </el-form>
</div>
</template>

<script>
const axios = require("axios")
export default {
    data: function () {
        let validateUsername = (rule, value, callback) => {
            /**
             * 账户名不能为空
             * 账户名的长度只允许10个长度以内 
             */
            if (!value) {
                return callback(new Error('账户名不能为空'))
            } else if (value && value.length > 20) {
                return callback(new Error('账户名称长度不能超过20个'))
            } else {
                return callback()
            }
        };
        let validatePassword = (rule, value, callback) => {
            /**
             * 密码不能为空
             * 密码的长度应该在8-16 包括大写，小写，数字
             */
            function check_(value) {

            }
            if (!value) {
                return callback(new Error('密码不能为空'))
            } else if (!(value.length >= 8 && 16 >= value.length)) {
                return callback(new Error('密码长度应该在8-16位之间'))
            } else if (check_(value)) {
                return callback(new Error('密码要包括字母大小写和数字'))
            } else {
                callback()
            }
        }
        return {
            flag: false, //默认是登录界面
            bkColor1: 'background-color:blue',
            bkColor2: 'color:black',
            rootUrl: 'http://127.0.0.1:3000/api',
            formData: {
                username: null,
                password: null,
                sex: '男'
            },
            labelPosition: 'right',
            rules: {
                username: [{
                    validator: validateUsername,
                    trigger: 'blur'
                }],
                password: [{
                    validator: validatePassword,
                    trigger: 'blur'
                }],
            },
            formClass: 'form-class',
        }
    },
    methods: {
        beforeComponentChange:function(){
            this.formData.username = null 
            this.formData.password = null
        },
        login: function () {},
        registerNewUser: function (formdata) {
            console.log(this.formData) //获取表单元素
        },
        registerCheck: function () {},
        setLogin: function () {
            this.beforeComponentChange()
            this.$data.bkColor1 = 'background-color:blue'
            this.$data.bkColor2 = 'color:black'
            this.$data.flag = false
        },
        setRegister: function () {
            this.beforeComponentChange()
            this.$data.bkColor1 = 'color:black'
            this.$data.bkColor2 = 'background-color:blue'
            this.$data.flag = true
        },
        submitUserImformation: function () {
            let len1 = this.formData.username.length,
                len2 = this.formData.password.length
            if (len1 > 0 && 20 > len1 && len2 >= 8 && 16 >= len2) {
                let url = this.flag ? `${this.rootUrl}/register` : `${this.rootUrl}/login` //如果为真为 注册界面
                let sendData = {}
                Object.keys(this.formData).forEach((key) => {
                    sendData[key] = this.formData[key]
                })
                if (!this.flag) {
                    //登录不需要设置属性选择
                    delete sendData.sex
                }
                axios({
                        method: 'post',
                        url: url,
                        data: {
                            form: sendData
                        }
                    })
                    .then(resp => {
                        console.log("resp.data  ", resp.data)
                        if (this.flag) {
                            //注册反馈处理
                            if (resp.data.state === "success") {
                                alert("注册完成")
                            } else {
                                alert("注册失败")
                            }
                        } else {
                            //登录反馈处理
                            if (resp.data.state === "success") {
                                alert("登录成功")
                                this.loginAFTER()
                            } else {
                                alert("登录失败")
                            }
                        }
                    })
            }

        },
        close: function () {
            this.$emit('close1')
        },
        loginAFTER:function() {
            this.close()
            this.$store.commit("updateUser",this.formData)
        }
    }
}
</script>

<style>
.form-class {
    position: fixed;
    right: 20px;
    padding: 10px;
    width: 400px;
    background-color: rgba(21, 20, 20, 0.29);
    border-radius: 20px;
}

.form-class>:nth-child(1) {
    height: 25px;
    line-height: 25px;
}

.form-class>:nth-child(1)>i {
    font-size: 20px;
    height: 20px;
    line-height: 20px;
    float: right;
}

.form-class>:nth-child(1)>i:hover {
    color: green;
}

.form-class>:nth-child(2) {
    display: flex;
    font-size: large;
    justify-content: center;
    margin: 0px auto 30px auto;
}

.form-class>:nth-child(3) {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
</style>
