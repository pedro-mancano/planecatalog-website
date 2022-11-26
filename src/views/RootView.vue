<template>
  <div class="root">
    <div class="center-div">
      <div class="box-container">
        <div class="box-p" @click="goTo('plane')">
          <img alt="Logo" class="logo" src="@/assets/plane_logo.png" />
        </div>
        <div class="box-p" @click="goTo('satellite')">
          <img alt="Logo" class="logo" src="@/assets/satellite_logo.png" />
        </div>
        <div class="box-p" @click="goTo('rocket')">
          <img alt="Logo" class="logo" src="@/assets/rocket_logo.png" />
        </div>
      </div>
    </div>
    <!--div class="madeWith">
      <div>Made With</div>
      <div>
      </div>
    </div-->
    <div class="github-profile">
      <a href="https://github.com/pedro-mancano" target="_blank">
        <img alt="Logo" class="logo" src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" />
      </a>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    goTo(view) {
      this.$router.push({ name: view + ".home" });
    },
  }
};
</script>

<style lang="scss" scoped>
.github-profile {
  position: fixed;
  top: 0;
  right: 0;
  width: 35px;
  height: 35px;
  margin: 10px;
  opacity: 0.5;
}

.root {
  width: 100%;
  height: 100%;
}

.center-div {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.logo {
  box-sizing: border-box;
  resize: horizontal;
  width: 250px;
  height: auto;
}

.box-container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr;
  grid-gap: 20px;
  justify-items: center;
  align-items: center;
  margin: 0px 20px;

  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr 1fr;
  }
}

.box-p {
  background-color: hsl(0deg, 0%, 100%);
  border-radius: 6px;
  box-shadow: 0 0.5em 1em -0.125em rgb(10 10 10 / 10%), 0 0px 0 1px rgb(10 10 10 / 2%);
  color: hsl(0deg, 0%, 29%);
  padding: 1.25rem;
  cursor: pointer;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.madeWith {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  color: hsl(0deg, 0%, 29%);
  opacity: 0.5;
}
</style>
