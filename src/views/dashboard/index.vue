<template>
  <div class="dashboard-container">
    <!-- <div class="dashboard-text">任务管理后台</div> -->
    <div class="text" style="text-align:center;">
      <h1>任务管理后台</h1>
    </div>
  </div>

</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
