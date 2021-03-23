<template>
<div>
    <div style="margin:20px 0px">背景设置</div>
    <div class="setting-part-one">
        <el-switch v-model="value" active-color="blue" inactive-color="black" style="margin:20px"></el-switch>
        <div style="margin-left:20px">所有背景</div>
        <div class="bkframe">
            <div v-for="(bk,index) in bkList" :key="index" class="bkframe_" @click="selectBackground(bk,index)">
                <img :src="bk">
            </div>
        </div>

    </div>
</div>
</template>

<script>
const fs = require("fs")
const path = require("path")
export default {
    data: function () {
        return {
            bkList: [],
            selected: "border-style:solid;border-color:brown",
            currentIndex: 0,
            value: true
        }
    },
    beforeMount() {
        let basePath = path.resolve("E:", "DB_SOURCE", "BKS"),
            list = []
        fs.readdirSync(basePath).forEach((item, index) => {
            list[index] = path.resolve(basePath, item)
        })

        this.bkList = list
        console.log(list)
    },
    mounted: function () {
        document.getElementsByClassName("bkframe_")[0].style = this.selected
    },
    methods: {
        selectBackground: function (bk, index) {
            if (index != this.currentIndex) {
                document.getElementsByClassName("bkframe_")[this.currentIndex].style = ""
                document.getElementsByClassName("bkframe_")[index].style = this.selected
                this.currentIndex = index
                bk = bk.replace(/\\/g, "\/")
                document.getElementById("app").style.backgroundImage = `url(${bk})`
            }

        }
    },
    watch:{
        value:function(newV,oldV) {
            if(!newV) {
                document.getElementById("app").style.backgroundImage = ""
                //失去背景图片后 字体颜色应该全部设为黑色
                function callback (node) {
                    node.style.color = "black"
                }
                Array.prototype.forEach.call(document.getElementsByTagName("*"),callback)
            }else {
                document.getElementById("app").style.backgroundImage = `url(${this.bkList[this.currentIndex].replace(/\\/g, "\/")})`
                function callback_(node) {
                    node.style.color ="#fdfdfd"
                }
                Array.prototype.forEach.call(document.getElementsByTagName("*"),callback_)
            }
        }
    }
}
</script>

<style>
.setting-part-one {
    border-radius: 20px;
    border-style: solid;
    border-width: 1px;
}

.bkframe {
    display: flex;
    justify-content: space-between;
    margin: 20px;
}

.bkframe>div {
    position: relative;
    width: 20%;
    height: 0px;
    padding-top: 11.25%;
}

.bkframe>div>img {
    position: absolute;
    width: 100%;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
}
</style>
