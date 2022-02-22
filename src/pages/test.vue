<template>
  <v-container>
   
  </v-container>
</template>


<script>
import {mapActions} from "vuex";

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
        ...mapActions("crud", ["get", "getById", "add", "update", "delete", "testQuery"]),
    },
    async created(){
        // let data = await this.getById( { "tableName": "test", "id": 'XGieD65iAyVYaeoW9Gs6'} ) 
        // console.log(data)
        // let payload = {
        //     name: "Los update",
        //     state: "update",
        //     country: "update"
        // }
        // console.log( await this.delete( { "payload": payload, "tableName": "test", 'id': 'XGieD65iAyVYaeoW9Gs6'} ) )

        
    }
 }
</script>