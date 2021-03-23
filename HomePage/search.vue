<template>
<div>
    <el-input placeholder="搜索音乐" v-model="searchValue" @input="searchContent"></el-input>
    <i class="fa fa-arrow-circle-right" style="margin-left:20px" @click="showAllList"></i>
    <ul id="lists" ref="lists">
        <li v-for="(item,index) in queryResult" :key="index" class="querylist" @click="goNewPage(item)">
            <div v-if="item.name">
                <span>{{index+1}}</span>
                <i>{{item.artist}}</i>
                <i>{{item.name}}</i>
            </div>
            <div v-else>
                <span>{{index+1}}</span>
                <i>{{item}}</i>
            </div>
        </li>
    </ul>
</div>
</template>

<script>
const axios = require("axios");
import player from "../player.js"
export default {
    data: function () {
        return {
            searchValue: this.$store.getters.getSearchContent,
            queryResult: new Array(),
            oringinQueryResult: new Array(),
            exist: true,
            queryBaseUrl: "http://127.0.0.1:3000/api/query",
            flagIndex: 0,
        };
    },
    watch: {
        searchValue: function (value) {
            if (!value.length) {
                this.$data.queryResult = [];
            }
        },
    },
    methods: {
        searchContent(event) {
            console.log("finding::", this.searchValue);
            this.searchValue = this.$data.searchValue.replace(/ /g, "") //去掉空格符号
            this.$store.commit("updateSearchContent",this.searchValue)
            if (this.searchValue.length > 0) {
                this.queryByKeywords(this.$data.searchValue);
            }
        },
        showAllList: function () {
            this.$data.searchValue = this.$data.searchValue.replace(/ /g, "")
            if (this.$data.searchValue.length > 0) {
                let value = this.$data.searchValue
                let path = "/songlist/" + value
                document.getElementById("lists").style.display = "none"
                this.$store.commit("updateSongs_", this.$data.oringinQueryResult)
                player.historyStore("search",this.$data.searchValue,new Date())
                this.$router.push({
                    path: path
                }) //页面跳转
            }

        },
        goNewPage: function (item) {
            /*
            路由跳转 -->
            稍后实现
            */

        },
        queryByKeywords(content) {
            let config = {
                data: {
                    query: this.$data.searchValue,
                },
            };
            axios
                .post(this.$data.queryBaseUrl, config)
                .then(response => {
                    console.log("get response:: ", response);
                    if (response.data[0].length || response.data[1].length) {
                        var data = response.data;
                        this.$data.oringinQueryResult = response.data;
                        var result1 = data[0].length > 5 ? data[0].slice(0, 4) : data[0];
                        this.$data.flagIndex = result1.length;
                        var result2 = data[1].length > 5 ? data[1].slice(0, 4) : data[1];
                        this.$data.queryResult = result1.concat(result2);
                    } else {
                        this.$data.queryResult = ["抱歉 暂无相关内容"];
                    }
                })
                .catch(function (error) {
                    console.log("request happened error", error);
                });
        },
    },
};
</script>

<style>
ul {
    padding: 0px;
}

li {
    list-style: none;
}

#lists {
    width: 40%;
    min-width: 400px;
    max-width: 800px;
    position: absolute;
    top: 40px;
    background-color: #abb7d8;
    z-index: 999;
}

.querylist:hover {
    background-color: rgb(145, 158, 222);
}

.querylist {
    height: 30px;
    line-height: 30px;
    padding: 5px 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
