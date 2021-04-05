<template>
  <q-page class="flex ">
    <div v-if="getIsAuth">
      <div class="q-pa-md row items-start q-gutter-md">
        <q-card
          class="my-card"
          v-for="(item, key) in getItems"
          :key="key"
          clickable
          v-ripple
          style="cursor:pointer;"
          @click="goToProduct(item)"
        >
          <img
            src="https://www.brother.ca/resources/images/no-product-image.png"
          />

          <q-card-section>
            <div class="text-h6">{{ item.name }}</div>
            <div class="text-subtitle2">{{ item.description }}</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            {{ item.price + "$" }}
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div v-else>
      <p>Please log in first</p>
    </div>

    <q-dialog v-model="openDialog">
      <q-card class="my-cardDialog" v-if="selectedItem !== null">
        <img
          src="https://www.brother.ca/resources/images/no-product-image.png"
        />

        <q-card-section>
          <div class="text-h6">{{ selectedItem.name }}</div>
          <div class="text-subtitle2">{{ selectedItem.description }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          {{ selectedItem.price + "$" }}
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      openDialog: false,
      selectedItem: null
    };
  },
  methods: {
    goToProduct(item) {
      this.openDialog = true;
      this.selectedItem = item;
    },
    async fetchItems() {
      await this.$store.dispatch("getAllItems", {
        username: this.getUser.name,
        password: this.getUser.password
      });
    }
  },
  mounted() {
    if (this.getIsAuth) {
      this.fetchItems();
    }
  },
  computed: {
    ...mapGetters(["getUser", "getItems", "getIsAuth"])
  }
};
</script>

<style scoped lanf="sass">
.my-card {
  width: 100%;
  max-width: 250px;
}
.my-cardDialog {
  width: 100%;
  max-width: 350px;
}
</style>
