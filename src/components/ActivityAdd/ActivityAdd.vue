<template>
  <v-container fluid>
    <div class="projets-add-page" v-if=" user && projet && flags">
      <v-row no-gutters class="d-flex justify-space-between mt-5 mb-6">
        <h1 class="page-title">{{lesson.name}}</h1>
        <h2 class="headline">Activités</h2>
      </v-row>
      <v-breadcrumbs :items="breadcrumbs" divider="/"></v-breadcrumbs>
      <v-row>
          <v-col lg="4" sm="6" cols="12" @click="dialog = true; editing=false, $refs.form.reset(); $refs.pairing.start(); e1=1; idGame=null ">
            <v-card class="mx-1 mb-1 pointed d-flex lesson" elevation="0">
              <v-row class="align-self-center">
                  <v-col cols="12" align="center" class="inside py-0">
                      <v-icon size="60" class="inside">mdi-plus</v-icon>
                  </v-col>
                <v-col cols="12" align="center" class="inside py-0">
                    <p class="m-auto">Ajouter une activité</p>
                  </v-col>
              </v-row>

            </v-card>
          </v-col>
          <v-col lg="4" sm="6" cols="12" v-for="activity in activities" :key="activity.id">
                <v-card
                    class="mx-auto lesson"
                    outlined
                    v-if="activity.enabled==true"
                >
                    <v-list-item three-line>
                    <v-list-item-content>
                        <div class="text-overline mb-0">
                        {{activity.name}}
                        </div>
                        <v-list-item-title class="text-h5 mb-1">
                        <v-avatar size="60" >
                          <img  class="card-flag" :src= projet.language.flag :alt= projet.language.name>
                        </v-avatar>
                        </v-list-item-title>
                        <v-list-item-subtitle>{{activity.description}}</v-list-item-subtitle>                        
                    </v-list-item-content>
                    
                    <v-btn rounded color="secondary" elevation="0" class="d-flex align-self-baseline mt-6" > {{ unit.level}} </v-btn>
                    
                    </v-list-item>
                    <v-card-actions >
                        <v-btn icon plain large class="ml-1" @click="editActivity(activity)" >
                            <v-icon >mdi-square-edit-outline </v-icon>
                        </v-btn>
                        <v-btn icon plain large @click="deleteActivity(activity.id)">
                            <v-icon >mdi-trash-can-outline </v-icon>
                        </v-btn>
                       
                    </v-card-actions>
                    
                </v-card>
          </v-col>
      </v-row>

      <v-row>
        <v-dialog v-model="dialog" max-width="450">
          <v-card>
            <v-card-title>Ajouter nouvelle activité {{lesson.name}}</v-card-title>
            <v-card-text>
              <v-stepper v-model="e1" flat elevation="0">
                <v-stepper-header>
                  <v-stepper-step :complete="e1 > 1" step="1"></v-stepper-step>
                  <v-divider></v-divider>
                  <v-stepper-step :complete="e1 > 2" step="2"></v-stepper-step>
                  <v-divider></v-divider>
                  <v-stepper-step :complete="e1 > 3" step="3"></v-stepper-step>
                </v-stepper-header>
                <v-stepper-items>
                  <v-form ref="form" v-model="valid" lazy-validation>
                  <v-stepper-content step="1">
                    <v-card class="mb-5 stepper-card" elevation="0" height="150px" style="box-shadow: none !important;">
                      <v-text-field
                        v-model="form.name"
                        label="Nom de la activité"
                        :rules="[rules.required]"
                      ></v-text-field>
                      <v-select
                          v-model="form.type"
                          :items="typesActivites"
                          menu-props="auto"
                          label="Type d'activité"
                          hide-details
                          prepend-icon="mdi-seesaw "
                          single-line
                      ></v-select>
                    </v-card>
                    <v-btn color="primary" @click="e1++" elevation="0" > Suivant </v-btn> 
                  </v-stepper-content>
                  <v-stepper-content step="2">
                    <v-card class="mt-2 mb-10 stepper-card " height="300px" elevation="0"  style="box-shadow: none !important;">
                       <v-textarea
                        v-model="form.description"
                        label="Description"
                        :rules="[rules.required]"
                      ></v-textarea>
                      <v-textarea
                        v-model="form.instructions"
                        label="Instructions"
                        :rules="[rules.required]"
                      ></v-textarea>
                    </v-card>
                    <v-btn color="primary" @click="e1++; $refs.pairing.start(idGame)">Suivant</v-btn>
                    <v-btn text @click="e1--"> Annuler </v-btn>
                  </v-stepper-content>
                  <v-stepper-content step="3">
                    <v-card class="mb-12 stepper-card " min-height="300px" elevation="0" style="box-shadow: none !important;" >
                      <pairing @addGame="idGame = $event" :id="idGame" :langue="projet.language" ref="pairing" :type="form.type"></pairing>
                    </v-card>
                    <v-btn color="primary" @click="addActivity()" v-if="!idGame">Envoyer</v-btn>
                    <v-btn color="primary" @click="editActivity()" v-else>Modifier</v-btn>
                    <v-btn text @click="e1--"> Annuler </v-btn>
                  </v-stepper-content>
                  </v-form>
                </v-stepper-items>
              </v-stepper>
          
              
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-row>
      
    </div>
   
  </v-container>
</template>

<script>
import {mapActions} from "vuex";
import Pairing from "@/components/ActivityAdd/Pairing.vue";

export default {
  name: "ActivityAdd",
  props: ["user", "flags", 'id', 'lesson', "breadcrumbs", 'projet', 'unit'],
  components: {'pairing': Pairing},
  data() {
    return {
      e1: 1,
      dialog: false,
      form:{
        id: "",
        name: "",
        type: "",
        description: "",
        instructions: "",
        vocabulary: "",
      },
      idGame: "",
      valid: false,
      editing: false,
      send: false,
      rules: {
        required: (value) => !!value || "Required.",
      },
      typesActivites: [ 
        {'text': 'Deviner le mot', 'value': 0 },
        {'text': 'Appariement', 'value': 1 },
        {'text': 'Traduction', 'value': 2 },
        {'text': 'Écouter et sélectionner le mot', 'value': 3 },
        {'text': 'Correspondance son/image', 'value': 4 },
        {'text': 'Compléter les phrases', 'value': 5 },

      ],
      vocabulary: [],
      activities: undefined
    };
  },
  methods: {
    ...mapActions("crud", ['getByQuery', 'add', 'delete', 'update', 'updateStructure', 'queryVocabularyActivity']),
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
    async addActivity(){
      if(this.$refs.form.validate()){
        await this.$refs.pairing.addActivity();
        let payload = {
          tableName: 'activities',
          payload:{
            name: this.form.name,
            type: this.form.type,
            idGame: this.idGame,
            description: this.form.description,
            instructions: this.form.instructions,
            vocabulary: this.form.vocabulary,
            lessonId: this.lesson.id,
            uid: this.user.uid,
            enabled: true
          }
        }
        const response = await this.add(payload);
        if(response) {
          await this.getActivities()
          this.showNotification("la activité a été ajoutées avec succès", 200)
          this.dialog = false
        } 
        else this.showNotification("la activité n'a pas été ajoutée", 500)
        this.e1=1
      }
    },
    async deleteActivity(id){
      const response = await this.delete({ 'tableName': "activities", 'id': id })
      if(response) {
        await this.getActivities()
        this.showNotification("la activité a été bien supprimé", 200)
      } 
      else this.showNotification("Une erreur s'est produite lors de la suppression", 500)
    },
    async editActivity(activity=undefined){
      if(!this.editing){
        this.form.name = activity.name
        this.form.type = activity.type,
        this.idGame = activity.idGame,
        this.form.description = activity.description,
        this.form.instructions = activity.instructions,
        this.form.vocabulary = activity.vocabulary,
        this.form.id = activity.id,
        this.dialog = true;
        this.editing = true;
        await this.$refs.pairing.start(this.idGame)
        return
      }
      let payload = {
        name: this.form.name,
        type: this.form.type,
        idGame: this.idGame,
        description: this.form.description,
        instructions: this.form.instructions,
        vocabulary: this.form.vocabulary,
        enabled: true
      }
      await this.$refs.pairing.editActivity();
      const response = await this.update({ 'tableName': "activities", 'id': this.form.id, "payload": payload})
      if(response) {
        await this.getActivities();
        this.$refs.form.reset()
        this.dialog = false
        this.showNotification("la activité a été mis a jour avec succès", 200)
      } 
      else this.showNotification("la activité n'a pas été ajoutée", 500)
    },
    async getActivities(){
      const tableName = 'activities'
      const response = await this.getByQuery({ "tableName":tableName, "field": 'lessonId', 'id': this.id } );
      if(response){
        this.activities = []; 
        for(let activity of response){
          this.activities.push( activity )
        }
      }
    },
    addBreadcrumb(breadcrumb){
      this.$emit("modifbreadcrumbs", breadcrumb);
    },
    async getVocabulary(){
      const response = await this.queryVocabularyActivity({'uid': this.user.uid, 'languageId': this.projet.language.id} );
      if(response){
          this.vocabulary = [];
          for(let word of response){
            this.vocabulary.push({ text:word.name, value: word.id})
          }
      }
    }
  },
  watch: {
    dialog: function (val) {
      if(!val && this.editing) {
        this.editing= false
        this.e1 = 1
      }
    },
    
  },
  async mounted() {
    await this.getActivities();
    await this.getVocabulary();
    console.log(this.$refs.items)
    let breadcrumb = {
      text: this.lesson.name,
      disabled: false,
      to: `#3`,
    }
    this.addBreadcrumb(breadcrumb)
  },
};
</script>

<style src="./ActivityAdd.scss" lang="scss"/>
