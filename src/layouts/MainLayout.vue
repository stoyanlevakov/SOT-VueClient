<template>
  <q-layout view="hHh Lpr LFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          SOT Client
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-item v-if="getIsAuth" class="q-mt-sm">
        <q-item-section top avatar>
          <q-avatar>
            <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label
            >{{ getUser.name }}
            <span style="font-weight:bold;color:blue;"
              >({{ getUser.role }})</span
            ></q-item-label
          >
          <q-item-label caption>{{ "ID: " + getUser.id }}</q-item-label>
        </q-item-section>
      </q-item>
      <q-list>
        <q-item-label header class="text-grey-8">
          Links
        </q-item-label>
        <div v-if="!getIsAuth">
          <EssentialLink
            v-for="link in essentialLinks"
            :key="link.title"
            v-bind="link"
          />
        </div>
        <div v-else>
          <EssentialLink
            v-for="link in essentialLinksAuth"
            :key="link.title"
            v-bind="link"
          />
          <q-item clickable tag="a" target="_blank" @click="logout()">
            <q-item-section avatar>
              <q-icon name="person_off" />
            </q-item-section>

            <q-item-section>
              <q-item-label>Log out</q-item-label>
              <q-item-label caption>
                log out of your account
              </q-item-label>
            </q-item-section>
          </q-item>
        </div>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from "components/EssentialLink.vue";

const linksData = [
  {
    title: "Home",
    caption: "Home page with products",
    icon: "home",
    link: "/"
  },
  {
    title: "Log In",
    caption: "log into your account",
    icon: "person",
    link: "login"
  }
];

const linksDataAuth = [
  {
    title: "Home",
    caption: "Home page with products",
    icon: "home",
    link: "/"
  },
  {
    title: "My products",
    caption: "users products and info",
    icon: "person",
    link: "userPage"
  }
];

import { mapGetters } from "vuex";

export default {
  name: "MainLayout",
  components: { EssentialLink },
  data() {
    return {
      leftDrawerOpen: false,
      essentialLinks: linksData,
      essentialLinksAuth: linksDataAuth
    };
  },
  methods: {
    logout() {
      this.$store.dispatch("logout");
    }
  },
  computed: {
    ...mapGetters(["getUser", "getIsAuth"])
  }
};
</script>
