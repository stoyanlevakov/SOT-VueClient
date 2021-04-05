<template>
  <q-page class="flex">
    <div v-if="getIsAuth">
      <q-btn
        :disabled="getUser.role === 'BUYER'"
        unelevated
        color="primary"
        label="Add products"
        class="q-mt-md q-ml-md"
        @click="addItem = true"
      />
      <div class="q-pa-md row items-start q-gutter-md">
        <div v-for="(item, key) in getItems" :key="key">
          <q-card
            class="my-card"
            v-if="item.sellerID === getUser.id || getUser.role === 'ADMIN'"
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
            <q-card-actions :disabled="getUser.role === 'BUYER'" align="around">
              <q-btn color="red" @click="deleteItem(item.id)" flat
                >Delete</q-btn
              >
              <q-btn color="blue" @click="updateItem(item)" flat>Update</q-btn>
            </q-card-actions>
          </q-card>
        </div>
      </div>
    </div>
    <div v-else>
      <p>Please log in first</p>
    </div>
    <q-dialog v-model="addItem">
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6">Add item</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <form @submit.prevent.stop="onSubmit" class="q-gutter-none">
            <q-input
              ref="name"
              outlined
              v-model="pname"
              label="Name"
              reactive-rules
              :rules="[val => !!val || 'Field is required']"
            />
            <q-input
              ref="desc"
              outlined
              v-model="pdesc"
              label="Description"
              reactive-rules
              :rules="[val => !!val || 'Field is required']"
            />
            <q-input
              ref="price"
              outlined
              v-model.number="pprice"
              type="number"
              reactive-rules
              :rules="[
                val => !!val || 'Field is required',
                val => val > 0 || 'Must be positive'
              ]"
              label="Price"
            />
            <div align="right" class="bg-white text-teal">
              <q-btn flat label="ADD" type="submit" />
            </div>
          </form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="updateItemDialog">
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6">Update item</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <form @submit.prevent.stop="onSubmitUpdate" class="q-gutter-none">
            <q-input
              outlined
              v-model.number="pSellerID"
              type="number"
              label="SellerID"
              readonly
              reactive-rules
              :rules="[val => !!val || 'Field is required']"
            />
            <q-input
              outlined
              v-model.number="pIdUpdate"
              type="number"
              label="ID"
              readonly
              reactive-rules
              :rules="[val => !!val || 'Field is required']"
            />
            <q-input
              ref="nameUp"
              outlined
              v-model="pnameUpdate"
              label="Name"
              reactive-rules
              :rules="[val => !!val || 'Field is required']"
            />
            <q-input
              ref="descUp"
              outlined
              v-model="pdescUpdate"
              label="Description"
              reactive-rules
              :rules="[val => !!val || 'Field is required']"
            />
            <q-input
              ref="priceUp"
              outlined
              v-model.number="ppriceUpdate"
              type="number"
              reactive-rules
              :rules="[
                val => !!val || 'Field is required',
                val => val > 0 || 'Must be positive'
              ]"
              label="Price"
            />
            <div align="right" class="bg-white text-teal">
              <q-btn flat label="ADD" type="submit" />
            </div>
          </form>
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
      addItem: false,
      pname: "",
      pdesc: "",
      pprice: 0,
      pIdUpdate: 0,
      pnameUpdate: "",
      pdescUpdate: "",
      ppriceUpdate: 0,
      pSellerID: 0,
      updateItemDialog: false
    };
  },
  methods: {
    async onSubmitUpdate() {
      this.$refs.nameUp.validate();
      this.$refs.descUp.validate();
      this.$refs.priceUp.validate();

      if (
        this.$refs.nameUp.hasError ||
        this.$refs.descUp.hasError ||
        this.$refs.priceUp.hasError
      ) {
        this.formHasError = true;
      } else {
        await this.$store.dispatch("updateItem", {
          username: this.getUser.name,
          password: this.getUser.password,
          name: this.pnameUpdate,
          description: this.pdescUpdate,
          price: this.ppriceUpdate,
          id: this.pIdUpdate
        });

        if (this.getError !== null) {
          this.$q.notify({
            position: "top",
            icon: "done",
            color: "negative",
            message: this.getError
          });
        } else {
          await this.$store.dispatch("getAllItems", {
            username: this.getUser.name,
            password: this.getUser.password
          });
          this.$q.notify({
            position: "top",
            icon: "done",
            color: "positive",
            message: "Succesfully updated"
          });
          this.updateItemDialog = false;
        }
      }
    },
    async onSubmit() {
      this.$refs.name.validate();
      this.$refs.desc.validate();
      this.$refs.price.validate();

      if (
        this.$refs.name.hasError ||
        this.$refs.desc.hasError ||
        this.$refs.price.hasError
      ) {
        this.formHasError = true;
      } else {
        await this.$store.dispatch("addItem", {
          username: this.getUser.name,
          password: this.getUser.password,
          sellerID: this.getUser.id,
          name: this.pname,
          description: this.pdesc,
          price: this.pprice
        });

        if (this.getError !== null) {
          this.$q.notify({
            position: "top",
            icon: "done",
            color: "negative",
            message: this.getError
          });
        } else {
          await this.$store.dispatch("getAllItems", {
            username: this.getUser.name,
            password: this.getUser.password
          });
          this.$q.notify({
            position: "top",
            icon: "done",
            color: "positive",
            message: "Succesfully Added"
          });
          this.addItem = false;
        }
      }
    },
    updateItem(item) {
      this.pIdUpdate = item.id;
      this.pnameUpdate = item.name;
      this.pdescUpdate = item.description;
      this.ppriceUpdate = item.price;
      this.pSellerID = item.sellerID;
      this.updateItemDialog = true;
    },
    async deleteItem(id) {
      await this.$store.dispatch("deleteItemById", {
        username: this.getUser.name,
        password: this.getUser.password,
        id: id
      });

      if (this.getError !== null) {
        this.$q.notify({
          position: "top",
          icon: "done",
          color: "negative",
          message: this.getError
        });
      } else {
        await this.$store.dispatch("getAllItems", {
          username: this.getUser.name,
          password: this.getUser.password
        });
        this.$q.notify({
          position: "top",
          icon: "done",
          color: "positive",
          message: "Succesfully deleted"
        });
      }
    }
  },
  computed: {
    ...mapGetters(["getUser", "getItems", "getIsAuth", "getError"])
  }
};
</script>

<style scoped lanf="sass">
.my-card {
  width: 100%;
  max-width: 250px;
}
</style>
