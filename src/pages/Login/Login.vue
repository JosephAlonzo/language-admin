<template>
  <v-app>
    <v-container fluid>
      <v-row no-gutters>
        <v-col cols="7" class="main-part d-none d-md-none d-lg-flex">
          <div class="d-flex">
            <div class=" rounded-circle">
              <v-img src="@/assets/icons/eagle_1_2.svg" contain class="mb-0" position="bottom -20px center" ></v-img>
              <v-img src="@/assets/icons/Books.svg" contain class="mt-0"></v-img>
            </div>
              <v-img src="@/assets/icons/Langues.png" position="top center" contain class="mt-0"></v-img>

          </div>
        </v-col>
        <v-col cols="12" lg="5" class="login-part d-flex align-center justify-center">
          <v-row no-gutters class="align-start">
            <v-col cols="12" class="login-part d-flex align-center justify-center flex-column">
              <div class="login-wrapper pt-md-4 pt-0">
                <v-tabs grow>
                  <v-tabs-slider></v-tabs-slider>
                  <v-tab :href="`#tab-login`">
                    LOGIN
                  </v-tab>
                  <v-tab :href="`#tab-newUser`">
                    s'inscrire
                  </v-tab>

                  <v-tab-item :value="'tab-login'" >
                    <v-form>
                      <v-container>
                        <v-row class="flex-column">
                          <v-col>
                            <p class="login-slogan display-2 text-center font-weight-medium my-10">Bienvenue</p>
                            <v-btn height="45" block color="white" elevation="0" class="google text-capitalize" @click="login(true)">
                              <v-img src="@/assets/google.svg" max-width="30" class="mr-4"></v-img>
                              Connectez-vous avec Google</v-btn>
                          </v-col>
                          <v-col cols="12" class="d-flex align-center my-8">
                            <v-divider></v-divider>
                            <span class="px-5"> or </span>
                            <v-divider></v-divider>
                          </v-col>
                          <v-form>
                            <v-col>
                              <v-text-field
                                  v-model="email"
                                  :rules="emailRules"
                                  value="admin@flatlogic.com"
                                  label="Email Address"
                                  required
                              ></v-text-field>
                              <v-text-field
                                  v-model="password"
                                  :rules="passRules"
                                  type="password"
                                  label="Password"
                                  hint="At least 6 characters"
                                  required
                              ></v-text-field>

                            </v-col>
                            <v-col class="d-flex justify-space-between">
                              <v-btn
                                  class="text-capitalize"
                                  large
                                  :disabled="password.length === 0 || email.length === 0"
                                  color="primary"
                                  @click="login()"
                              >
                                Se connecter</v-btn>
                              <v-btn large text class="text-capitalize primary--text">Mot de passe oublié</v-btn>
                            </v-col>
                          </v-form>
                        </v-row>
                      </v-container>
                    </v-form>
                  </v-tab-item>

                  <v-tab-item :value="'tab-newUser'" >
                    <v-form>
                      <v-container>
                        <v-row class="flex-column">

                          <v-col>
                            <p class="login-slogan display-2 text-center font-weight-medium mt-10">Bienvenu!</p>
                            <p class="login-slogan display-1 text-center font-weight-medium mb-0">Créez votre compte</p>
                          </v-col>

                          <v-form>
                            <v-col>
                              <v-text-field
                                  v-model="createFullName"
                                  label="Nom et prenom"
                                  required
                              ></v-text-field>
                              <v-text-field
                                  v-model="createEmail"
                                  :rules="emailRules"
                                  label="Email"
                                  required
                              ></v-text-field>
                              <v-text-field
                                  v-model="createPassword"
                                  :rules="passRules"
                                  type="password"
                                  label="Mot passe"
                                  hint="At least 6 characters"
                                  required
                              ></v-text-field>
                            </v-col>
                            <v-col class="d-flex justify-space-between">
                              <v-btn
                                  large
                                  block
                                  :disabled="createFullName.length === 0 || createEmail.length === 0 || createPassword === 0"
                                  color="primary"
                                  @click="createAccountLocal()"
                              >
                               Créez votre compte</v-btn>
                            </v-col>
                          </v-form>

                          <v-col cols="12" class="d-flex align-center my-2">
                            <v-divider></v-divider>
                            <span class="px-5"> ou </span>
                            <v-divider></v-divider>
                          </v-col>

                          <v-btn height="60" block color="white" elevation="0" class="google text-capitalize">
                            <v-img src="@/assets/google.svg" max-width="30" class="mr-4" @click="login(true)"></v-img>
                            Connectez-vous avec Google
                          </v-btn>
                        </v-row>
                      </v-container>
                    </v-form>
                  </v-tab-item>

                </v-tabs>
              </div>
            </v-col>
            <v-col cols="12" class="d-flex justify-center">
              <v-footer>
              </v-footer>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
  import {mapActions} from "vuex";

  export default {
    name: 'Login',
    data() {
      return {
        email: 'josepalonzoalonzo@gmail.com',
        emailRules: [
          v => !!v || 'E-mail is required',
          v => /.+@.+/.test(v) || 'E-mail must be valid',
        ],
        createFullName: 'Joseph Alonzo',
        createEmail: 'josepalonzoalonzo@gmail.com',
        createPassword: '123456',
        password: '123456',
        passRules: [
          v => !!v || 'Password is required',
          v => v.length >= 6 || 'Min 6 characters'
        ]
      }
    },
    methods: { 
      ...mapActions("login", ["loginWithGoogle", 'createAccount', 'loginWithEmail', 'addDisplayName']),
      async login(googleAuth=false){
        let response = null;
        if (googleAuth) response = await this.loginWithGoogle()
        else response = await this.loginWithEmail({"email": this.email, 'password': this.password, 'name': this.createFullName})
        if(response.code == 200) {
          this.$router.push('/home');
          this.showNotification( "authentification réussie" ,response.code)
          window.localStorage.setItem('authenticated', true);
          return
        }
        this.showNotification(response.errorCode, response.code)
      },
      async createAccountLocal(){
        let response = await this.createAccount({'email': this.createEmail, 'password': this.createPassword, 'name': this.createFullName})
        if(response.code == 200) {
          this.$router.push('/home');
          this.showNotification( "Création de compte réussie",response.code)
          window.localStorage.setItem('authenticated', true);
          return
        }
        this.showNotification(response.errorCode, response.code)
      },
      showNotification(message, code) {
        const options = { 
          position: 'top-right',
          timeout: 6000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          draggablePercent: 0.6,
          showCloseButtonOnHover: false,
          hideProgressBar: true,
          closeButton: "button",
          icon: true
        }
        if(code == "500") this.$toast.error(message, { ...options });
        if(code == "200") this.$toast.info(message, { ...options });
      },
    },
    created() {
      if (window.localStorage.getItem('authenticated') === 'true') {
        this.$router.push('/home');
      }
    }
  }

</script>

<style src="./Login.scss" lang="scss"/>
