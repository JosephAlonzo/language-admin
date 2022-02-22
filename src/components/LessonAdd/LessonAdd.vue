<template>
  <v-container fluid>
    <div v-if="!showActivities">
      <div class="projets-add-page" v-if="user&& unit && flags && lessons && projet">
      <v-row no-gutters class="d-flex justify-space-between mt-5 mb-6">
        <h1 class="page-title">{{unit.name}}</h1>
        <h2 class="headline">Leçons</h2>
      </v-row>
      <v-breadcrumbs :items="breadcrumbs" divider="/"></v-breadcrumbs>

      <v-row>
          <v-col lg="4" sm="6" cols="12" @click="dialog = true; editing=false, $refs.form.reset(); ">
            <v-card class="mx-1 mb-1 pointed d-flex unit" elevation="0">
              <v-row class="align-self-center">
                  <v-col cols="12" align="center" class="inside py-0">
                      <v-icon size="60" class="inside">mdi-plus</v-icon>
                  </v-col>
                <v-col cols="12" align="center" class="inside py-0">
                    <p class="m-auto">Ajouter une leçon</p>
                  </v-col>
              </v-row>
            </v-card>
          </v-col>
          <v-col lg="4" sm="6" cols="12" v-for="lesson in lessons" :key="lesson.id">
                <v-card
                    class="mx-auto unit"
                    outlined
                    v-if="lesson.enabled==true"
                >
                    <v-list-item three-line>
                    <v-list-item-content>
                        <div class="text-overline mb-0">
                        {{lesson.name}} - {{lesson.numero}}
                        </div>
                        <v-list-item-title class="text-h5 mb-1">
                        <v-avatar size="60" >
                          <img  class="card-flag" :src= projet.language.flag :alt= projet.language.name>
                        </v-avatar>
                        </v-list-item-title>
                        <v-list-item-subtitle>{{lesson.description}}</v-list-item-subtitle>
                        <v-list-item-subtitle class="body-2 pt-2">Activities: {{lesson.activitiesNumber}}</v-list-item-subtitle>
                        
                    </v-list-item-content>
                    
                  
                    <v-btn rounded color="secondary" elevation="0" class="d-flex align-self-baseline mt-6" > {{unit.level}} </v-btn>
                    
                    </v-list-item>
                    <v-card-actions >
                        <v-btn icon plain large class="ml-1" @click="editLesson(lesson)" >
                            <v-icon >mdi-square-edit-outline </v-icon>
                        </v-btn>
                        <v-btn icon plain large @click="deleteLesson(lesson.id)">
                            <v-icon >mdi-trash-can-outline </v-icon>
                        </v-btn>
                        <v-btn icon plain large @click="showActivitiesAdmin(lesson)">
                              <v-icon >mdi-eye  </v-icon>
                          </v-btn>
                    </v-card-actions>
                    
                </v-card>
          </v-col>
      </v-row>

        <v-row>
          <v-dialog v-model="dialog" max-width="450">
            <v-card>
              <v-card-title>Ajouter nouvelle leçon {{unit.name}}</v-card-title>
              <v-card-text>
            
                <v-form ref="form" v-model="valid" lazy-validation>
                  <v-text-field
                    v-model="form.name"
                    label="Nom de la leçon"
                    :rules="[rules.required]"
                  ></v-text-field>
                  <v-text-field type="number" v-model="form.numero" :rules="[rules.required]"
                    label="Numéro de la leçon"
                  ></v-text-field>
                  <v-textarea
                    v-model="form.description"
                    label="Description"
                    :rules="[rules.required]"
                  ></v-textarea>

                  <v-col cols="12" align="center">
                      <v-btn color="primary" class="mr-4" @click="addLesson" rounded v-if="!editing"> Ajouter</v-btn>
                      <v-btn color="primary" class="mr-4" @click="editLesson" rounded v-else> Enregistrer</v-btn>
                  </v-col>
              
                </v-form>
              </v-card-text>
            </v-card>
          </v-dialog>
        </v-row>
      
      </div>
    </div>
    <div v-else>
      <activity-add :user="user" :projet=projet :flags=flags :id=selectedLesson.id :lesson=selectedLesson :unit=unit :breadcrumbs=breadcrumbs @modifbreadcrumbs="addBreadcrumb($event)"></activity-add>
    </div>
  </v-container>
</template>

<script>
import {mapActions} from "vuex";
import ActivityAdd from "@/components/ActivityAdd/ActivityAdd.vue";

export default {
  name: "LessonAdd",
  props: ["user", "flags", 'id', 'unit', 'breadcrumbs', 'projet'],
  components: {
    ActivityAdd
  },
  data() {
    return {
      dialog: false,
      form:{
        id: "",
        activities: "",
        name: "",
        numero: 1,
        description: ""
      },
      valid: false,
      editing: false,
      rules: {
        required: (value) => !!value || "Required.",
      },
      showActivities: false,
      selectedLesson: undefined,
      lessons: undefined
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
    async addLesson(){
      if(this.$refs.form.validate()){
        let payload = {
          tableName: 'lessons',
          payload:{
            name: this.form.name,
            numero: this.form.numero,
            description: this.form.description,
            unitId: this.id,
            uid: this.user.uid,
            enabled: true
          }
        }
        const response = await this.add(payload);
        if(response) {
          await this.getLessons()
          this.showNotification("la leçon a été ajoutées avec succès", 200)
          this.dialog = false
        } 
        else this.showNotification("la leçon n'a pas été ajoutée", 500)
      }
    },
    async deleteLesson(id){
      const response = await this.delete({ 'tableName': "lessons", 'id': id })
      if(response) {
        await this.getLessons()
        this.showNotification("la leçon a été bien supprimé", 200)
      } 
      else this.showNotification("Une erreur s'est produite lors de la suppression", 500)
    },
    async editLesson(lesson=undefined){
        if(!this.editing){
          this.form.name = lesson.name
          this.form.numero = lesson.numero,
          this.form.description = lesson.description,
          this.form.activities = lesson.activities,
          this.form.id = lesson.id,
          this.dialog = true;
          this.editing = true;
          return
        }
        let payload = {
          name: this.form.name,
          numero: this.form.numero,
          description: this.form.description,
          enabled: true
        }
        const response = await this.update({ 'tableName': "lessons", 'id': this.form.id, "payload": payload})
        if(response) {
          await this.getLessons()
          this.$refs.form.reset()
          this.dialog = false
          this.showNotification("la leçon a été mis a jour avec succès", 200)
        } 
        else this.showNotification("la leçon n'a pas été ajoutée", 500)
    },
    async getTotalActivities(activity){
        let payload = {
            'tableName': 'activities',
            'field': 'lessonId',
            'id': activity.id
        }
        let response = await this.getCount(payload)
        return response
    },
    async getLessons(){
      const tableName = 'lessons'
      const response = await this.getByQuery({ "tableName":tableName, "field": 'unitId', 'id': this.id } );
      if(response){
        this.lessons = []; 
        for(let lesson of response){
          lesson['activitiesNumber'] = await this.getTotalActivities(lesson)
          this.lessons.push( lesson )
        }
      }
    },
    showActivitiesAdmin(lesson){
      this.showActivities = true;
      this.selectedLesson = { ...lesson};
    },
    addBreadcrumb(breadcrumb){
      this.$emit("modifbreadcrumbs", breadcrumb);
    }
  },
  watch: {
    dialog: function (val) {
      if(!val && this.editing) this.editing= false
    },
    $route(val) {
      let hash = parseInt(val.hash.substring(1))
      if(hash == 2) this.showActivities = false
    },
  },
  async mounted() {
    await this.getLessons();
    console.log(this.projet)
    let breadcrumb = {
      text: this.unit.name,
      disabled: false,
      to: `#2`,
    }
    this.addBreadcrumb(breadcrumb)
  },
};
</script>

<style src="./LessonAdd.scss" lang="scss"/>
