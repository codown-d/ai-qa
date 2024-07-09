<template>
  <div class="knowledge-lib">
    <a-header title="知识库"></a-header>
    <div class="flex-r-c mt30" style="justify-content: space-between">
      <a-segmented
        :value="segmentedVal"
        :options="options"
        @change="(val) => (segmentedVal.value = val)"
      />
      <div class="flex-r-c">
        <a-pre-input :value="inputVal" class="lib-input">
          <template #pre>
            <span>搜索</span>
          </template>
        </a-pre-input>
        <a-button type="primary" :icon="Plus" class="ml48">新建知识库</a-button>
      </div>
    </div>
    <el-table :data="tableData" style="width: 100%" class="mt28 lib-table">
      <el-table-column prop="name" label="知识库名称" />
      <el-table-column prop="date" label="更新时间" />
      <el-table-column prop="address" label="操作" width="280px">
        <template #default="scope">
          <el-button
            link
            class="f18"
            type="primary"
            @click.prevent="deleteRow(scope.$index)"
          >
            删除
          </el-button>
          <el-button
            link
            class="f18"
            type="primary"
            @click.prevent="deleteRow(scope.$index)"
          >
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="flex-r-c mt30" style="justify-content: flex-end">
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="100"
        :size="size"
        layout="total, prev, pager, next"
        :total="1000"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Plus } from "@element-plus/icons-vue";
import { ref, watch } from "vue";
const segmentedVal = ref("all");
const inputVal = ref(null);
const currentPage = ref(0);
const size = ref(10);
const options = [
  {
    label: "全部",
    value: "all",
  },
  {
    label: "我的",
    value: "mine",
  },
];
const tableData = ref([
  {
    date: "2016-05-03",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
  },
  {
    date: "2016-05-02",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
  },
  {
    date: "2016-05-04",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
  },
  {
    date: "2016-05-01",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
  },
]);
const handleSizeChange = () => {};
const handleCurrentChange = () => {};
</script>
<style lang="less">
.lib-input {
  width: 254px;
}
.lib-table {
  th.el-table__cell {
    background: rgb(243, 241, 252);
    height: 58px;
    line-height: 58px;
    color: #333333;
    font-size: 18px;
    font-weight: 550;
    font-family: Source Han Sans;
  }
  td.el-table__cell {
    height: 58px;
    line-height: 58px;
    font-family: 思源黑体;
    font-size: 18px;
    color: #333333;
  }
  &.el-table--enable-row-hover .el-table__body tr:hover > td.el-table__cell {
    background: rgb(243, 241, 252);
  }
}
</style>
<style lang="less" scoped>
.knowledge-lib {
  padding: 42px 51px;
}
</style>
