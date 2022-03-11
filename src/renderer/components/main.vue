<template>
    <div>
        <h2>我是展示页</h2>
        <p>数字{{$store.state.Counter}}</p>
        <button @click="add">数字加1</button>
        <button @click="goLogin">回到登录页</button>
        <button @click="showMessage">消息</button>
        <button @click="blurMsg">托盘消息闪烁</button>
    </div>
</template>

<script>
import icon from '../assets/logo.png'
import {ipcRenderer} from 'electron'
export default {
    name: 'home',
    mounted() {
        console.log(this.$route)
        ipcRenderer.on('asynchronous-message', function (event, arg) { // 接收到Main进程返回的消息
            const message = `异步消息回复: ${arg}`
            console.log(message)
        })
    },
    methods: {
        goLogin() {
            this.$router.go(-1)
        },
        add() {
            this.$store.dispatch('someAsyncTask')
        },
        showMessage() {
            let option = {
                title: "你订阅消息更新了",                            // 通知标题
                body: "更新内容blablala的",                               // 内容
                icon: icon,                                 // 图标
                href: 'https://www.cnblogs.com/binglicheng/'            // 地址
            };

            // 创建通知并保存
            let hhwNotication = new window.Notification(option.title, option);

            // 当通知被点击时
            hhwNotication.onclick= function(){
                // TODO something...
            }
        },
        blurMsg() {
            console.log('去触发消息')
            ipcRenderer.send('twinkle-msg',{id: 123})
        }
    }
}
</script>

<style scoped>

</style>
