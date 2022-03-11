<template>
        <div>
            <h2>我是登录页</h2>
            <button @click="goMain">去展示页</button>
            <webview id="browser" src="http://10.10.111.106/#/login"></webview>
        </div>
</template>

<script>
export default {
    name: 'login',
    methods: {
        goMain() {
            this.$router.push('/main?id=1')
        }
    }
}
</script>

<style scoped lang="scss">
#browser {
    width: 1600px;
    height: 800px;
    border: 10px solid yellow;
    background: green;
    span,div,p {
        color: red !important;
    }
}
</style>
