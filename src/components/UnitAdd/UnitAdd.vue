<template>
  <v-container fluid>
    <div v-if="!showLessons">
      <div class="projets-add-page" v-if="user != null && projet && flags != null ">
      <v-row no-gutters class="d-flex justify-space-between mt-5 mb-6">
        <h1 class="page-title">{{projet.name}}</h1>
        <h2 class="headline">Unités</h2>
        <v-menu offset-y> </v-menu>
      </v-row>
       <v-breadcrumbs :items="breadcrumbs" divider="/"></v-breadcrumbs>

      <v-row>
          <v-col lg="4" sm="6" cols="12" @click="dialog = true; editing=false; $refs.form.reset(); ">
            <v-card class="mx-1 mb-1 pointed d-flex unit" elevation="0">
              <v-row class="align-self-center">
                  <v-col cols="12" align="center" class="inside py-0">
                      <v-icon size="60" class="inside">mdi-plus</v-icon>
                  </v-col>
                <v-col cols="12" align="center" class="inside py-0">
                    <p class="m-auto">Ajouter une unité</p>
                  </v-col>
              </v-row>
            </v-card>
          </v-col>
          <v-col lg="4" sm="6" cols="12" v-for="unit, index in units" :key="unit.id">
                <v-card
                    class="mx-auto unit"
                    outlined
                    v-if="unit.enabled==true"
                >
                    <v-list-item three-line>
                    <v-list-item-content>
                        <div class="text-overline mb-0">
                        {{unit.name}}
                        </div>
                        <v-list-item-title class="text-h5 mb-1">
                        <v-avatar size="60" >
                          <img  class="card-flag" :src= projet.language.flag :alt= projet.language.name>
                        </v-avatar>
                        </v-list-item-title>
                        <v-list-item-subtitle>{{unit.description}}</v-list-item-subtitle>
                        <v-list-item-subtitle class="body-2 pt-2">Leçons: {{unit.lessonsNumber}}</v-list-item-subtitle>
                        
                    </v-list-item-content>
                    
                  
                    <v-btn rounded color="secondary" elevation="0" class="d-flex align-self-baseline mt-6" > {{unit.level}} </v-btn>
                    
                    </v-list-item>
                    <v-card-actions >
                        <v-btn icon plain large class="ml-1" @click="editUnit(unit, unit.id)" >
                            <v-icon >mdi-square-edit-outline </v-icon>
                        </v-btn>
                        <v-btn icon plain large @click="deleteUnit(unit.id, index)">
                            <v-icon >mdi-trash-can-outline </v-icon>
                        </v-btn>
                        <v-btn icon plain large @click="showLessonsAdmin(unit)">
                              <v-icon >mdi-eye  </v-icon>
                          </v-btn>
                    </v-card-actions>
                    
                </v-card>
          </v-col>
      </v-row>

        <v-row>
          <v-dialog v-model="dialog" max-width="400">
            <v-card>
              <v-card-title>Ajouter une nouvelle unité à {{projet.name}}</v-card-title>
              <v-card-text>
            
                <v-form ref="form" v-model="valid" lazy-validation>
                  <v-text-field
                    v-model="form.name"
                    label="Nom de l'unité"
                    :rules="[rules.required]"
                  ></v-text-field>
                  <v-select
                      v-model="form.level"
                      :items="levels"
                      :rules="[rules.required]"
                      menu-props="auto"
                      label="Niveau"
                      hide-details
                      prepend-icon="mdi-map"
                      single-line
                  ></v-select>
                  <v-textarea
                    v-model="form.description"
                    label="Description"
                    :rules="[rules.required]"
                  ></v-textarea>

                  <v-col cols="12" align="center">
                      <v-btn color="primary" class="mr-4" @click="addUnit" rounded v-if="!editing"> Ajouter</v-btn>
                      <v-btn color="primary" class="mr-4" @click="editUnit" rounded v-else> Enregistrer</v-btn>
                  </v-col>
              
                </v-form>
              </v-card-text>
            </v-card>
          </v-dialog>
        </v-row>
      
      </div>
    </div>
    <div v-else>
      <lesson-add :user="user" :projet=projet :flags=flags :id=selectedUnit.id :unit=selectedUnit :breadcrumbs=breadcrumbs @modifbreadcrumbs="addBreadcrumb($event)"></lesson-add>
    </div>
  </v-container>
</template>

<script>
import {mapActions} from "vuex";
import LessonAdd from "@/components/LessonAdd/LessonAdd.vue";

export default {
  name: "UnitAdd",
  props: ["user", "flags", 'id', 'breadcrumbs', 'projet'],
  components: {
    LessonAdd
  },
  data() {
    return {
      dialog: false,
      form:{
        id: "",
        lessons: "",
        name: "",
        level: "",
        description: ""
      },
      valid: false,
      editing: false,
      levels: ['Débutant', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
      rules: {
        required: (value) => !!value || "Required.",
      },
      units: undefined,
      showLessons: false,
      selectedUnit: undefined,
    };
  },
  methods: {
    ...mapActions("crud", ['getByQuery', 'add', 'delete', 'update', 'updateStructure', 'getCount']),
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
    async addUnit(){
      if(this.$refs.form.validate()){
        let payload = {
          tableName: 'units',
          payload:{
            name: this.form.name,
            level: this.form.level,
            description: this.form.description,
            projetId: this.id,
            uid: this.user.uid,
            enabled: true,
          }
        }
        const response = await this.add(payload);
        if(response) {
          await this.getUnits()
          this.showNotification("l'unité a été ajoutées avec succès", 200)
          this.dialog = false
        } 
        else this.showNotification("l'unité n'a pas été ajoutée", 500)
      }
    },
    async deleteUnit(id, index){
      let response = await this.delete({ 'tableName': "units", 'id': id })
      if(response) {
        this.units.splice(index, 1)
        this.showNotification("la traduction a été bien supprimé", 200)
        // await this.getUnits()
      }
      else this.showNotification("Une erreur s'est produite lors de la suppression", 500)
    },
    async editUnit(unit=undefined){
        if(!this.editing){
            this.form.name = unit.name
            this.form.level = unit.level,
            this.form.description = unit.description,
            this.form.id = unit.id,
            this.dialog = true;
            this.editing = true;
            return
        }
        let payload = {
          name: this.form.name,
          level: this.form.level,
          description: this.form.description,
          enabled: true
        }
        let response = await this.update({ 'tableName': "units", 'id': this.form.id, "payload": payload})
        if(response) {
          await this.getUnits()
          this.$refs.form.reset() 
          this.dialog = false
          this.showNotification("l'unité a été mis a jour avec succès", 200)
        } 
        else this.showNotification("l'unité n'a pas été ajoutée", 500)
    },
    async getUnits(){
      this.units = []; 
      const tableName = 'units'
      const response = await this.getByQuery({ "tableName":tableName, "field": 'projetId', 'id': this.id });
      if(response){
        for(let unit of response){
          unit['lessonsNumber'] = await this.getTotalLessons(unit)
          this.units.push( unit )
        }
      }
    },
    showLessonsAdmin(unit){
      this.showLessons = true;
      this.selectedUnit = { ...unit };
    },
    addBreadcrumb(breadcrumb){
      this.$emit("modifbreadcrumbs", breadcrumb);
    },
    async getTotalLessons(unit){
        let payload = {
            'tableName': 'lessons',
            'field': 'unitId',
            'id': unit.id
        }
        let response = await this.getCount(payload)
        return response
    },
  },
  watch: {
    dialog: function (val) {
      if(!val && this.editing) this.editing= false
    },
    $route(val) {
      let hash = parseInt(val.hash.substring(1))
      if(hash == 1) this.showLessons = false
    },
  },
  async mounted() {
    await this.getUnits();
    let breadcrumb = {
      text: this.projet.name,
      disabled: false,
      to: `#1`,
    }
    this.addBreadcrumb(breadcrumb)
  },
};
</script>

<style src="./UnitAdd.scss" lang="scss"/>
