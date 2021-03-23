<template>
<div>
    <div><span>评论{{comments.length}}</span></div>
    <br>
    <ul>
        <li v-for="(comment,index) in comments" :key="index" class="comment-class">
            <div>
                <div class="comment-user"></div>
            </div>
            <div>
                <div>
                    <div>用户:<span>{{decodeURI(comment.u_name)}}</span></div>
                    <div>评论: <span>{{comment.msg}}</span></div>
                    <div v-if="comment.reply ? true : false">
                        <div><span style="color:blue">回复</span>{{decodeURI(comment.reply.u_name)}}:</div>
                        <div>{{comment.reply.msg}}</div>
                    </div>
                </div>
                <div class="comment-bottom"> 
                    <div><i class="fa fa-thumbs-o-up"></i><span>: {{(index+1)*100}}</span></div>
                    <div><span>时间:{{comment.time}}</span></div>
                </div>
            </div>
        </li>
    </ul>
</div>
</template>

<script>
export default {
    data: function () {
        return {

        }
    },
    props: ["comments"]
}
</script>

<style>
.comment-class {
    display: flex;
    margin-bottom: 30px;
     font-size: 15px;
}
.comment-user {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: grey;
}

.comment-class>div:nth-child(1) {
    width: 50px;

}

.comment-class>div:nth-child(2) {
    margin-left: 50px;
    width: 0px;
    flex-grow: 1;
}

.comment-class>div:nth-child(2)>div {
    margin-bottom: 10px;
}

.comment-bottom {
    display: flex;
    justify-content: space-between;
    height: 30px;
}

.comment-bottom >div {
    height: 30px;
    line-height: 30px;
    font-size: 15px;
}
</style>
