<template>
<div>
    <ul>
        <li v-for="(songer,index) in list" :key="index" class="search-soonger-list" @click="goPage(songer)">
            <div>
                <span>{{index+1}}</span>
                <img style="width:50px;height:50px;margin-left:10px" :src="songer.pic|picFilter">
            </div>
            <div style="margin-right:20px">{{songer.artist|songerFilter}}</div>
        </li>
    </ul>
</div>
</template>

<script>
const axios = require("axios")
export default {
    data: function () {
        return {
            list: [],
            start: 0,
            end: 30,
            baseUrl: "http://127.0.0.1:3000/api/queryByKeyword/",
        }
    },
    props: ["mode"],

    beforeMount() {

        //判断是本地读写数据还是选择请求数据
        console.log(this.$route)
        if (this.$route.meta == "query-music-list") {
            console.log("ok1")
            this.getList(this.$route.params.keywords)
        } else {
            /*
            选择本地数据读写
            如果执行该项 就是其他页面从本地读取出来的数据展示
            */
        }

    },
    methods: {
        getList: function (keywords) {
            console.log("ok2")
            let options = {
                url: this.$data.baseUrl + keywords,
                method: "get"
            }
            axios(options).then((resp) => {
                console.log(resp.data)
                this.$data.list = resp.data.slice(this.$data.start, this.$data.end)
            }).catch((err) => {
                /*
                讲错误对象交给 ERROR_CENTER 统一处理 以弹框方式显示
                */
                alert("抱歉 出错 -- songerlist")
            })
        },
        goPage:function(songer) {
            console.log("songer:: ",songer)
            let songer_ = songer.artist.slice(0,songer.artist.indexOf("&")===-1 ? songer.artist.length : songer.artist.indexOf("&"))
            let path = `/songer/${songer_}`
            console.log('path: ',path)
            this.$router.push({
                path:path,
                query:{
                    song:songer
                }

            })
        }

    },

    filters: {
        picFilter: function (url) {
            var picUrl = "http://127.0.0.1:3000/api/picture"
            return url ? picUrl + "/" + url.replace(new RegExp("\//|\/|:", "g"), "") : null
        },
        songerFilter:function (name) {
            return name.slice(0,name.indexOf("&")===-1 ? name.length : name.indexOf("&"))
        }
    }
}
</script>

<style>
.search-soonger-list {
    width: 100%;
    margin-bottom: 20px;
    height: 50px;
    display: flex;
    justify-content: space-between;
}
.search-soonger-list >div {
   height: 50px;
   display: flex;
   align-items: center;
}

</style>
