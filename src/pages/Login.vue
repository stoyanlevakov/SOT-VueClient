<template>
  <q-page
    class="full-height full-width row justify-center items-center"
    style="background: linear-gradient(#92c6f9, #0087d7);"
  >
    <div class="column q-pa-lg">
      <div class="row">
        <q-card square class="shadow-24" style="width:400px;height:600px;">
          <q-card-section class="bg-blue">
            <h4 class="text-h5 text-white q-my-md">{{ title }}</h4>
          </q-card-section>
          <q-card-section>
            <q-fab
              color="primary"
              @click="switchTypeForm"
              icon="add"
              class="absolute"
              style="top: 0; right: 12px; transform: translateY(-50%);"
            >
              <q-tooltip>
                Register
              </q-tooltip>
            </q-fab>
            <q-form class="q-px-sm q-pt-xl">
              <q-input
                ref="username"
                square
                clearable
                v-model="username"
                lazy-rules
                :rules="[this.required, this.short]"
                type="username"
                label="username"
              >
                <template v-slot:prepend>
                  <q-icon name="person" />
                </template>
              </q-input>
              <q-input
                ref="password"
                square
                clearable
                v-model="password"
                :type="passwordFieldType"
                lazy-rules
                :rules="[this.required, this.short]"
                label="password"
              >
                <template v-slot:prepend>
                  <q-icon name="lock" />
                </template>
                <template v-slot:append>
                  <q-icon
                    :name="visibilityIcon"
                    @click="switchVisibility"
                    class="cursor-pointer"
                  />
                </template>
              </q-input>
              <q-input
                ref="repassword"
                v-if="register"
                square
                clearable
                v-model="repassword"
                :type="passwordFieldType"
                lazy-rules
                :rules="[this.required, this.short, this.diffPassword]"
                label="Confirm password"
              >
                <template v-slot:prepend>
                  <q-icon name="lock" />
                </template>
                <template v-slot:append>
                  <q-icon
                    :name="visibilityIcon"
                    @click="switchVisibility"
                    class="cursor-pointer"
                  />
                </template>
              </q-input>
              <q-select
                ref="role"
                v-if="register"
                square
                clearable
                v-model="role"
                :options="options"
                lazy-rules
                :rules="[this.required]"
                label="Role"
              >
                <template v-slot:prepend>
                  <q-icon name="person" />
                </template>
              </q-select>
            </q-form>
          </q-card-section>

          <q-card-actions class="q-px-lg">
            <q-btn
              unelevated
              size="lg"
              color="secondary"
              @click="submit"
              class="full-width text-white"
              :label="btnLabel"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      title: "Login",
      username: "",
      password: "",
      repassword: "",
      register: false,
      passwordFieldType: "password",
      btnLabel: "Login",
      visibility: false,
      visibilityIcon: "visibility",
      role: "",
      options: ["BUYER", "SELLER"]
    };
  },
  methods: {
    required(val) {
      return (val && val.length > 0) || "This field is required";
    },
    diffPassword(val) {
      const val2 = this.$refs.password.value;
      return (val && val === val2) || "Passwords must match";
    },
    short(val) {
      return (val && val.length > 3) || "is too short";
    },
    async submit() {
      if (this.register) {
        this.$refs.username.validate();
        this.$refs.password.validate();
        this.$refs.repassword.validate();
        this.$refs.role.validate();
        if (
          this.$refs.username.hasError ||
          this.$refs.password.hasError ||
          this.$refs.repassword.hasError ||
          this.$refs.role.hasError
        ) {
          return;
        }
        await this.$store.dispatch("register", {
          name: this.username,
          password: this.password,
          role: this.role
        });
      } else {
        this.$refs.username.validate();
        this.$refs.password.validate();

        if (this.$refs.username.hasError || this.$refs.password.hasError) {
          return;
        }

        await this.$store.dispatch("login", {
          username: this.username,
          password: this.password
        });
      }
      if (this.getError !== null) {
        this.$q.notify({
          position: "top",
          icon: "done",
          color: "negative",
          message: this.getError
        });
      } else {
        await this.$store.dispatch("getUserByName", {
          username: this.username,
          password: this.password
        });
        if (this.getError !== null) {
          this.$q.notify({
            position: "top",
            icon: "done",
            color: "negative",
            message: this.getError
          });
        } else {
          this.$router.replace("/");
        }
      }
    },
    switchTypeForm() {
      this.register = !this.register;
      this.title = this.register ? "Register" : "Login";
      this.btnLabel = this.register ? "Register" : "Login";
    },
    switchVisibility() {
      this.visibility = !this.visibility;
      this.passwordFieldType = this.visibility ? "text" : "password";
      this.visibilityIcon = this.visibility ? "visibility_off" : "visibility";
    }
  },
  computed: {
    ...mapGetters(["getError"])
  }
};
</script>

<style></style>
