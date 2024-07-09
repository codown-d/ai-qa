<template>
    <div class="side_con">
        <div class="nav">
            <div :class="['nav_item', currentNav === item.id ? 'active_item' : '']" @click="selectItem(item)"
                v-for="item in navItems" :key="item.id">
                <img :src="`${currentNav === item.id ? item.active_url : item.url}`" />
                <div>{{ item.text }}</div>
            </div>
        </div>
        <el-scrollbar class="list">
            <el-menu :default-active="currentNav" @select="(index: string) => selectItem({ id: index })">
                <el-menu-item class="static" index="translate" @click="">
                    <img src="@/assets/images/fanyi.svg" />
                    <div>翻译与格式调整</div>
                </el-menu-item>
                <el-sub-menu index="knowledge">
                    <template #title>
                        <img src="@/assets/images/zhishi.svg" />
                        <span>知识库</span>
                    </template>
                    <el-menu-item v-for="item in knowledgeStore.knowledgeList" :index="`knowledge/${item.name}`"
                        :key="item.name">
                        <div class="cricle" :style="{ backgroundColor: item.bgColor }"></div>
                        <div>{{ item.name }}</div>
                        <img src="@/assets/images/pencil_edit.svg" @click.stop="
                            selectItem({ id: 'knowledge/base', name: item.name })
                            " v-show="knowledgeStore.userInfo?.role === 'admin'" />
                    </el-menu-item>
                    <el-menu-item class="add-knowledge u-flex" :index="`knowledge/add`" key="add"
                        v-if="knowledgeStore.userInfo.role == 'admin'">
                        <el-icon>
                            <CirclePlusFilled />
                        </el-icon>
                        <div>新建企业AI知识库</div>
                    </el-menu-item>
                </el-sub-menu>
            </el-menu>
        </el-scrollbar>
        <div class="avatar">
            <div class="avatar_info">
                <img :src="knowledgeStore.userInfo.avatar_url" />
                <div>
                    <div class="name">{{ knowledgeStore.userInfo.username }}</div>
                    <div class="code">{{ knowledgeStore.userInfo.email }}</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { merge } from "loadsh";
import { useKnowledgeStore } from "@/store/useKnowledgeStore";
import { useRouter } from "vue-router";
import { getInfo } from "@/config/api";
const navItems = [
    {
        id: "message",
        url: new URL("/src/assets/images/b_message.svg", import.meta.url).href,
        active_url: new URL("/src/assets/images/message.svg", import.meta.url).href,
        text: "对话",
    },
    {
        id: "question",
        url: new URL("/src/assets/images/blackQuestion.svg", import.meta.url).href,
        active_url: new URL("/src/assets/images/w_question.svg", import.meta.url)
            .href,
        text: "更新和常见问题解答",
    },
    {
        id: "setting",
        url: new URL("/src/assets/images/setting.svg", import.meta.url).href,
        active_url: new URL("/src/assets/images/w_setting.svg", import.meta.url)
            .href,
        text: "设置",
    },
];
const router = useRouter();
const knowledgeStore = useKnowledgeStore();
const currentNav = ref("message");
function getUserInfo() {
    getInfo()
        .then((res) => {
            if (res.data.code === 1000) {
                knowledgeStore.userInfo = merge(res.data.data, {
                    avatar_url: `${import.meta.env.VITE_BASE_URL}${res.data.data.avatar_url
                        }`,
                });
            }
        })
}
getUserInfo();
function resetElMenu() {
    let cn = window.localStorage.getItem("currentNav") || "message";
    knowledgeStore.menuData.index = cn;
    currentNav.value = cn;
}
resetElMenu();
function selectItem(item: { id: string; name?: string }) {
    let { id } = item
    console.log(item)
    currentNav.value = id
    switch (id) {
        case "message":
            router.push("/");
            knowledgeStore.sessionType = "init";
            break;
        case "question":
            router.push("/update-faq");
            break;
        case "setting":
            router.push("/setting");
            break;
        case "translate":
            router.push("/translate");
            knowledgeStore.currentBase = "default";
            break;
        case "knowledge/add":
            router.push("/add-knowledge");
            break;
        case "knowledge/base":
            router.push({
                path: "/knowledge-base",
                query: { name: item.name },
            });
            break;
        default:
            router.push("/");
            knowledgeStore.currentBase = id.split('/')[1];
            knowledgeStore.sessionType = "assign";
            break;
    }
}
</script>
<style scoped lang="less">
.side_con {
    width: 100%;
    padding: 22.11% 8.09% 20px;
    height: 100%;
    box-sizing: border-box;
    border-radius: 0.93vw;
    background: rgba(249, 249, 249, 1);
    display: flex;
    flex-direction: column;

    .nav {
        padding-bottom: 14.26%;
        border-bottom: 1px solid rgba(226, 226, 226, 1);
    }

    .nav_item {
        width: 100%;
        height: 43px;
        display: flex;
        padding: 9px 22px;
        align-items: center;
        font-size: 0.93vw;
        box-sizing: border-box;
        cursor: pointer;
        font-weight: 400;
        border-radius: 11px;
        color: black;

        &>img {
            margin-right: 11px;
            width: 22px;
            height: 0.93vw;
        }
    }

    .active_item {
        background: rgba(126, 76, 225, 1);
        color: rgba(255, 255, 255, 1);
    }

    .list {
        margin-top: 5.55%;
        height: 44.44vh;
    }

    .avatar {
        box-sizing: border-box;
        bottom: 10px;
        border-radius: 11px;
        box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
        padding: 25px 29px 15.5px;
        margin-top: auto;

        .avatar_info {
            border-bottom: 1px solid rgba(232, 232, 232, 1);
            display: flex;
            align-items: center;
            padding-bottom: 14.5px;
        }

        & img {
            width: 46px;
            height: 46px;
            border-radius: 50%;
            margin-right: 13px;
        }

        .name {
            color: rgba(0, 0, 0, 1);
            font-size: 18px;
            font-weight: 700;
            line-height: 24px;
        }

        .code {
            font-weight: 500;
            color: rgba(153, 153, 153, 1);
            font-size: 16px;
            font-weight: 500;
        }
    }
}

:deep(.el-menu) {
    border-right: none;
    background: rgba(249, 249, 249, 1);

    .el-sub-menu__title {
        height: 43px;
        border-radius: 11px;
        padding-left: 27px !important;
        font-size: 18px;

        &>img {
            width: 18px;
            height: 17px;
            margin-right: 12.5px;
        }

        &>span {
            height: 52px;
            font-size: 18px;
        }
    }

    .el-menu-item {
        height: 43px;
        padding-left: 45px;
        border-radius: 11px;
        padding-left: 26px !important;
        font-size: 18px;

        .cricle {
            border-radius: 50%;
            width: 12px;
            height: 12px;
            background-color: aquamarine;
            margin-right: 17px;
        }

        &>img {
            width: 16px;
            height: 15px;
            margin-left: auto;
            cursor: pointer;
            display: none;
        }

        &:not(.static)>img {
            display: block;
        }
    }

    .static {
        &>img {
            margin-right: 9px;
            width: 22px;
            height: 0.93vw;
            margin-left: 0px;
            display: block;
        }
    }

    .el-sub-menu__title:hover,
    .el-menu-item:hover,
    .el-menu-item.is-active {
        background: rgba(232, 222, 247, 1);
        color: black;
    }
}

:deep(.menu_deactive) {
    .el-menu-item.is-active {
        background: transparent;
    }
}

.add-knowledge {
    color: rgba(102, 102, 102, 1);
    padding-left: 27px;
    font-size: 18px;
    cursor: pointer;
    user-select: none;
    font-size: 18px;

    .el-icon {
        font-size: 17px;
        color: rgba(97, 96, 101, 1);
    }
}
</style>
