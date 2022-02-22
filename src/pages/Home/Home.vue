<template>
  <v-container fluid>
    <div class="home-page" v-if="user != undefined">
      <v-row no-gutters class="d-flex justify-space-between mt-10 mb-6">
        <h1 class="page-title" >Bienvenue {{user.currentUser.displayName}}</h1>
        <v-menu offset-y> </v-menu>
      </v-row>
      <v-row>
        <!-- <v-col lg="4" sm="6" cols="12">
          <v-card class="mx-1 mb-1 cards principal-cards">
            <v-card-title class="pa-6 pb-3">
              <p class="mb-3">Messages</p>
              <v-spacer></v-spacer>
            </v-card-title>
            <v-card-text class="pa-6 pt-0">
              <v-row no-gutters>
                <v-col cols="6" align="center">
                  <v-img
                    max-height="200"
                    max-width="100"
                    src="@/assets/icons/enveloppe.svg"
                    class="mb-2"
                  ></v-img>
                </v-col>
                <v-col cols="6" class="my-auto">
                  <span class="" style="font-size: 42px">199 </span>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col> -->
        <v-col lg="4" sm="6" cols="12">
          <v-card class="mx-1 mb-1 cards principal-cards">
            <v-card-title class="pa-6 pb-3">
              <p class="mb-3">Projets</p>
              <v-spacer></v-spacer>
            </v-card-title>
            <v-card-text class="pa-6 pt-0">
              <v-row no-gutters>
                <v-col cols="6" align="center">
                  <v-img
                    max-height="200"
                    max-width="100"
                    src="@/assets/icons/projet.svg"
                    class="mb-2"
                  ></v-img>
                </v-col>
                <v-col cols="6" class="my-auto">
                  <span class="" style="font-size: 42px">{{totals[0]}}</span>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
         <v-col lg="4" sm="6" cols="12">
          <v-card class="mx-1 mb-1 cards principal-cards">
            <v-card-title class="pa-6 pb-3">
              <p class="mb-3">Unités au total</p>
              <v-spacer></v-spacer>
            </v-card-title>
            <v-card-text class="pa-6 pt-0">
              <v-row no-gutters>
                <v-col cols="6" align="center">
                  <v-img
                    max-height="200"
                    max-width="100"
                    src="@/assets/icons/units.svg"
                    class="mb-2"
                  ></v-img>
                </v-col>
                <v-col cols="6" class="my-auto">
                  <span class="" style="font-size: 42px">{{totals[1]}} </span>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col lg="4" sm="6" cols="12">
          <v-card class="mx-1 mb-1 cards principal-cards">
            <v-card-title class="pa-6 pb-3">
              <p class="mb-3">leçons au total</p>
              <v-spacer></v-spacer>
            </v-card-title>
            <v-card-text class="pa-6 pt-0">
              <v-row no-gutters>
                <v-col cols="6" align="center">
                  <v-img
                    max-height="200"
                    max-width="100"
                    src="@/assets/icons/folder.svg"
                    class="mb-2"
                  ></v-img>
                </v-col>
                <v-col cols="6" class="my-auto">
                  <span class="" style="font-size: 42px">{{totals[2]}} </span>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row no-gutters class="d-flex justify-space-between mt-10 mb-6">
        <h1 class="page-sub-title">Activité récente</h1>
        <v-menu offset-y> </v-menu>
      </v-row>
     <div v-if="user!=null && user.currentUser!=undefined">
        <projet-add :user="user.currentUser" page="Home"></projet-add>
      </div>
    </div>
  </v-container>
</template>

<script>
import {mapActions} from "vuex";
import ProjetAdd from "@/components/ProjetAdd/ProjetAdd.vue";
export default {
  name: "Home",
  components: {
    ProjetAdd
  },
  data() {
    return {
      totals: [0,0,0],
      dialog: false,
      form:{
        name: "",
        language: "",
        description: ""
      },
      valid: false,
      rules: {
        required: (value) => !!value || "Required.",
      },
      user: undefined
    };
  },
  methods: {
    ...mapActions("login", ['getCurrentUser']),
    ...mapActions("crud", ['getProjetsUnitsLessons']),

    validate () {
      console.log(this.$refs.form.validate())
    },
  },
  async mounted() {
    this.totals = await this.getProjetsUnitsLessons();
    this.user = await this.getCurrentUser();
  },
};
</script>

<style src="./Home.scss" lang="scss"/>
