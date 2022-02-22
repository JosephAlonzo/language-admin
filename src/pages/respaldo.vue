<template>
  <v-container>
   
  </v-container>
</template>


<script>
import {mapActions} from "vuex";
import {firebase} from 'vue'
import { getFirestore, collection, getDocs, doc, setDoc  } from 'firebase/firestore/lite';


export default {
    name: "Test",
    data () {
        return {
        caption : '',
        img1: '',
        imageData: null
        }
    },
    methods:{
        ...mapActions("user", ["add"]),
    },
    async created(){
        const db = getFirestore(firebase);

        console.log(db)
        async function getCities(t) {
            const citiesCol = collection(t, 'cities');
            const citySnapshot = await getDocs(citiesCol);
            const cityList = citySnapshot.docs.map(doc => doc.data());
            return cityList;
        }
        console.log( "HERE", getCities(db) );

        let payload = {
            name: "Los Angeles",
            state: "CA",
            country: "USA"
        }
        // Add a new document in collection "cities"
        let response = await setDoc(doc(db, "cities"), {
            ...payload
        });
        console.log(response)
        
    }
 }
</script>