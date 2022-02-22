import Vue from 'vue'
import App from './App.vue'
import router from './Routes'
import store from './store/index'
import vuetify from './plugins/vuetify'
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

Vue.use(Toast);

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCU5U8YFsz_M2AefEYz3o3yHuQ2bplkwSQ",
  authDomain: "holi-a96f9.firebaseapp.com",
  databaseURL: "https://holi-a96f9-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "holi-a96f9",
  storageBucket: "holi-a96f9.appspot.com",
  messagingSenderId: "449082469534",
  appId: "1:449082469534:web:5f85d009f288368dda9f8f"
};

// Initialize Firebase
export const firebase = initializeApp(firebaseConfig);


Vue.config.productionTip = false

new Vue({
  vuetify,
  router,
  render: h => h(App), store
}).$mount('#app')
