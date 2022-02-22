<template>
  <v-container fluid>
    <div class="projets-add-page" v-if="user != null && !showUnits">
        <v-row no-gutters class="d-flex justify-space-between mt-5 mb-6">
            <h1 class="page-title">Mes projets</h1>
            <v-menu offset-y> </v-menu>
        </v-row>
        <v-breadcrumbs :items="breadcrumbs" divider="/"></v-breadcrumbs>

        <v-row>
            <v-col lg="4" sm="6" cols="12" @click="dialog = true; editing=false, $refs.form.reset(); ">
            <v-card class="mx-1 mb-1 pointed d-flex" elevation="0">
                <v-row class="align-self-center">
                    <v-col cols="12" align="center" class="inside py-0">
                        <v-icon size="60" class="inside">mdi-plus</v-icon>
                    </v-col>
                <v-col cols="12" align="center" class="inside py-0">
                    <p class="m-auto">Ajouter un projet</p>
                    </v-col>
                </v-row>
            </v-card>
            </v-col>
            
            <v-col lg="4" sm="6" cols="12" v-for="projet in projets" :key="projet.id">
                <v-card
                    class="mx-auto"
                    outlined
                    v-if="projet.enabled==true"
                >
                    <v-list-item three-line>
                    <v-list-item-content >
                        <div class="text-overline mb-4">
                        {{projet.language.name}}
                        </div>
                        <v-list-item-title class="text-h5 mb-1" @click="showUnitsAdmin(projet)">
                        {{projet.name}}
                        </v-list-item-title>
                        <v-list-item-subtitle>{{projet.description}}</v-list-item-subtitle>
                        <v-list-item-subtitle class="body-2 pt-2">Unités: {{projet.unitsNumber}}</v-list-item-subtitle>
                        
                    </v-list-item-content>

                    <v-avatar size="80" >
                        <img  class="card-flag"
                            :src= projet.language.flag
                            :alt= projet.language.name
                        >
                    </v-avatar>
                    </v-list-item>
                    <v-card-actions v-if="page!='Home'">
                        <v-btn icon plain large class="ml-1" @click="editProjet(projet)" >
                            <v-icon >mdi-square-edit-outline </v-icon>
                        </v-btn>
                        <v-btn icon plain large @click="deleteProjet(projet)">
                            <v-icon >mdi-trash-can-outline </v-icon>
                        </v-btn>
                        <v-btn icon plain large @click="showUnitsAdmin(projet)">
                            <v-icon >mdi-eye  </v-icon>
                        </v-btn>
                    </v-card-actions>
                    
                </v-card>
            </v-col>
        </v-row>

        <v-row>
            <v-dialog v-model="dialog" max-width="400">
            <v-card>
                <v-card-title>Ajouter un nouveau projet</v-card-title>
                <v-card-text>
                <v-row class="my-2 ml-2">
                    <div class="mr-2">
                        <v-avatar
                            color="grey lighten-4"
                            size="70"
                            @click="dialogLanguage = true"
                        >
                            <v-icon class="flag">
                            mdi-plus
                            </v-icon>
                        </v-avatar>
                    </div>
                    <div v-for="flag in flags" :key="flag.id" class="mr-2">
                        <v-avatar size="70" >
                            <img  class="flag"
                                :src= flag.flag
                                :alt= flag.name
                                @click="form.language=flag.id"
                                v-bind:class="classObject(flag.id)"
                            >
                        </v-avatar>
                    </div>
                
                </v-row>
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-text-field
                    v-model="form.name"
                    label="Nom du projet"
                    :rules="[rules.required]"
                    ></v-text-field>
                    <v-select
                        v-model="form.language"
                        :items="languages"
                        :rules="[rules.required]"
                        menu-props="auto"
                        label="Langue"
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
                        <v-btn color="primary" class="mr-4" @click="addProjet" rounded v-if="!editing"> Ajouter</v-btn>
                        <v-btn color="primary" class="mr-4" @click="editProjet" rounded v-else> Enregistrer</v-btn>
                    </v-col>
                
                </v-form>
                </v-card-text>
            </v-card>
            </v-dialog>
        </v-row>
        <v-row>
            <v-dialog v-model="dialogLanguage" max-width="400">
            <v-card>
                <v-card-title>Ajouter un nouvelle langue</v-card-title>
                <v-card-text>
                
                <v-form ref="formLanguage" v-model="validLanguage" lazy-validation>
                    <v-text-field
                    v-model="formLanguage.name"
                    label="langage"
                    :rules="[rules.required]"
                    ></v-text-field>
                <template>
                    <v-file-input
                        accept="image/png, image/jpeg, image/bmp, image/jpg"
                        placeholder="Drapeau"
                        prepend-icon="mdi-image"
                        label="Drapeau"
                        v-model="formLanguage.flag"
                    ></v-file-input>
                    </template>

                    <v-col cols="12" align="center">
                    <v-btn
                    color="primary"
                    class="mr-4"
                    @click="addLanguage()"
                    rounded
                    >
                    Ajouter
                    </v-btn>
                    </v-col>
                
                </v-form>
                </v-card-text>
            </v-card>
            </v-dialog>
        </v-row>
    </div>
    <div v-else-if="user != null && showUnits">
        
        <unit-add :user="user" :flags=flags :breadcrumbs=breadcrumbs :id=selectedProjet.id  :projet=selectedProjet @modifbreadcrumbs="breadcrumbsModif($event)"></unit-add>
    </div>
  </v-container>
</template>

<script>
import {mapActions} from "vuex";
import UnitAdd from "@/components/UnitAdd/UnitAdd.vue";

export default {
  name: "ProjetAdd",
  props: ["user", "page"],
  components: {
    UnitAdd
  },
  data() {
    return {
      dialog: false,
      form:{
        id: null,
        name: "",
        language: "",
        description: ""
      },
      valid: false,
      showUnits: false,
      editing: false,
      selectedProjet: undefined,
      rules: {
        required: (value) => !!value || "Required.",
      },
      projets: [],
      
      //Languages
      dialogLanguage: false,
      formLanguage:{
        name: "",
        flag: ""
      },
      validLanguage: false,
      languages: [],
      flags: [],
      //Breadcrums
      breadcrumbs: [
      ]
    };
  },
  methods: {
    ...mapActions("files", { 
        addFile : 'add',
        getUrl: 'getUrl'
    }),
    ...mapActions("crud", ['getByUserId', 'add', 'delete', 'update', 'getCount', 'getProjetsUnitsLessons']),
   
    async getLanguages(){
        const tableName = 'language'
        const response = await this.getByUserId({ "tableName":tableName, 'uid': this.user.uid} );
        if(response){
            let selectList = []
            response.forEach(element => {
                let array = {
                    text:  element.name,
                    value: element.id
                }
                selectList.push(array)
            });
            this.flags = response
            this.languages = selectList
        }
    },
    async addLanguage () {
      if(this.$refs.formLanguage.validate()){
        const imageRef = await this.addImage()
        const url = await this.getUrl(imageRef)
        const uid = await this.user.uid
        let payload = {
            tableName: 'language',
            payload:{
                name: this.formLanguage.name,
                flag: url,
                uid: uid
            }
        }
        const response = await this.add(payload);
        if(response) {
            this.getLanguages()
            this.showNotification("la langue a été ajoutées avec succès", 200)
            this.dialog = false
        } 
        else this.showNotification("la langue n'a pas été ajoutées", 500)
    
      }
    },
    async addImage(){
        const file =  this.formLanguage.flag;
        let payload = {
            name: file.name,
            file: file
        }
        return await this.addFile(payload)
    },
    async addProjet(){
        if(this.$refs.form.validate()){
            let payload = {
                tableName: 'projets',
                payload:{
                    name: this.form.name,
                    languageId: this.form.language,
                    description: this.form.description,
                    unit:[],
                    uid: this.user.uid
                }
            }
            const response = await this.add(payload);
            if(response) {
                this.getProjets()
                this.showNotification("le projet a été ajoutées avec succès", 200)
                this.dialog = false
            } 
            else this.showNotification("le projet n'a pas été ajoutées", 500)
        }
    },
    async getProjets(){
        const tableName = 'projets'
        const response = await this.getByUserId({ "tableName":tableName, 'uid': this.user.uid} );
        
        if(response){
            this.projets = [];
            for(let projet of response){
                if(!projet.enabled) continue
                projet['unitsNumber'] = await this.getTotalUnits(projet)
                for(let language of this.flags){
                    if(language.id == projet.languageId){
                        this.projets.push( { ...projet, "language": {...language}  } )
                        break
                    }
                }
                if(this.page=="Home" && this.projets.length > 4){
                    break
                }
            }
        }
    },
    async deleteProjet(projet){
        let response = this.delete({ 'tableName': "projets", 'id': projet.id })
        if(response) {
            this.showNotification("Le projet a été bien supprimé", 200)
            await this.getProjets()
        }
        else this.showNotification("Une erreur s'est produite lors de la suppression", 500)
    },
    async editProjet(projet=undefined){
        if(!this.editing){
            this.form.id = projet.id
            this.form.name = projet.name
            this.form.language = projet.languageId,
            this.form.description = projet.description,
            this.dialog = true;
            this.editing = true;
            return
        }
        let payload = {
            name: this.form.name,
            languageId: this.form.language,
            description: this.form.description,
        }
        let response = this.update({ 'tableName': "projets", 'id': this.form.id, "payload": payload})
        if(response) {
            this.getProjets()
            this.$refs.form.reset() 
            this.dialog = false;
            this.editing = false;
            this.showNotification("Le projet a été bien modifié", 200)
        }
        else this.showNotification("Une erreur s'est produite lors de la modification", 500)
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
    classObject: function (id) {
        return {
            active: this.form.language == id
        }
    },
    showUnitsAdmin(projet){
        this.showUnits = true;
        this.selectedProjet = projet;
    },
    async getTotalUnits(projet){
        let payload = {
            'tableName': 'units',
            'field': 'projetId',
            'id': projet.id
        }
        let response = await this.getCount(payload)
        return response
    },
    //Return all the units and lessons in the home page
 
    breadcrumbsModif(breadcrumb){
        this.breadcrumbs.push(breadcrumb)
    }
  }, 
  async mounted() {
    await this.getLanguages()
    await this.getProjets()
    this.breadcrumbs.push(
        {
          text: this.currentRouteName,
          disabled: false,
          to: `#0`,
        },
    )
  },
  watch: {
      dialog: function (val) {
      if(!val && this.editing) this.editing= false
    },
    $route(val) {
        let hash = parseInt(val.hash.substring(1))
        while (this.breadcrumbs.length > hash+1){
            
            this.breadcrumbs.pop()
        }
        if(hash == 0) this.showUnits = false
    },
    
  },
 
  computed: {
    currentRouteName() {
        return this.$route.name;
    },
    currentRoutePath() {
        return this.$router.currentRoute.path
    },
  }
};
</script>

<style src="./ProjetAdd.scss" lang="scss"/>
