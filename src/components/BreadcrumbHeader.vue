<template>
  <div class="breadcrumb-header">
    <a class="home is-primary" @click="goToHome">Home</a>
    <span> / </span>
    <span>
      <span v-if="this.$route.name.includes('home')">{{ $t(path) }}</span>
      <a class="is-primary" v-else @click="goToLocalHome">{{ $t(path) }}</a>
    </span>
    <span v-if="!this.$route.name.includes('home')">
      <span> / </span>
      <span>{{ $t($route.name.toLocaleLowerCase().split('.').pop()) }}</span>
    </span>
  </div>
</template>

<script>

export default {
  computed: {
    path() {
      return this.$route.name.split('.')[0].toLocaleLowerCase();
    }
  },
  methods: {
    goToHome() {
      this.$router.push({ name: "root" });
    },
    goToLocalHome() {
      this.$router.push({ name: this.path + ".home" });
    }
  }
}
</script>

<style lang="scss">
a {
  color: var(--primary);
}
</style>

<style lang="scss" scoped>
.breadcrumb-header {
  font-size: 1.75rem !important;
}
</style>
