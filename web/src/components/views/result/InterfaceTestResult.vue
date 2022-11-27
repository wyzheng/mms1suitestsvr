<template>
  <a-table :dataSource="dataSource" :columns="columns" />
</template>
<script>
  export default {
    setup() {
      return {
        dataSource: [
          {
            key: '1',
            query: '自然堂',
            type: '广告',
            sub_type: '品专广告',
            is_recalled: '是',
          },
          {
            key: '2',
            query: '装修',
            type: '广告',
            sub_type: '竞价广告',
            is_recalled: '是',
          },
        ],

        columns: [
          {
            title: 'query',
            dataIndex: 'query',
            key: 'query',
          },
          {
            title: 'box类型',
            dataIndex: 'type',
            key: 'type',
          },
          {
            title: '子类型',
            dataIndex: 'sub_type',
            key: 'sub_type',
          },
          {
            title: '是否召回',
            dataIndex: 'is_recalled',
            key: 'is_recalled',
          },
        ],
      };
    },
  };
</script>
