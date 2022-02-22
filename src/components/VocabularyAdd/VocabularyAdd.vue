<template>
  <v-container fluid>
    <div class="vocabulary-add-page" v-if="user != null && !showTranslations">
        <v-row no-gutters class="d-flex justify-space-between mt-5 mb-6">
            <h1 class="page-title">Mon vocabulaire</h1>
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
                    <p class="m-auto">Ajouter un vocabulary</p>
                    </v-col>
                </v-row>
            </v-card>
            </v-col>
            
            <v-col lg="4" sm="6" cols="12" v-for="word in vocabulary" :key="word.id">
                <v-card
                    class="mx-auto"
                    outlined
                    v-if="word.enabled==true"
                >
                    <v-list-item three-line>
                    <v-list-item-content>
                        <div class="text-overline mb-4">
                        {{word.language.name}}
                        </div>
                        <v-list-item-title class="text-h5 mb-1">
                        {{word.name}}
                        </v-list-item-title>
                        <v-list-item-subtitle>{{word.description}}</v-list-item-subtitle>
                        <v-list-item-subtitle class="body-2 pt-2">Traductions: 0</v-list-item-subtitle>
                        
                    </v-list-item-content>

                    <v-avatar size="80" >
                        <img  class="card-flag"
                            :src= word.language.flag
                            :alt= word.language.name
                        >
                    </v-avatar>
                    </v-list-item>
                    <v-card-actions v-if="page!='Home'">
                        <v-btn icon plain large class="ml-1" @click="editVocabulary(word)" >
                            <v-icon >mdi-square-edit-outline </v-icon>
                        </v-btn>
                        <v-btn icon plain large @click="deleteVocabulary(word)">
                            <v-icon >mdi-trash-can-outline </v-icon>
                        </v-btn>
                        <v-btn icon plain large @click="showDetail(word)">
                            <v-icon >mdi-eye  </v-icon>
                        </v-btn>
                    </v-card-actions>
                    
                </v-card>
            </v-col>
        </v-row>

        <v-row>
            <v-dialog v-model="dialog" max-width="400">
            <v-card>
                <v-card-title>Ajouter un nouveau mot</v-card-title>
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
                    label="Mot"
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
                        <v-btn color="primary" class="mr-4" @click="addVocabulary" rounded v-if="!editing"> Ajouter</v-btn>
                        <v-btn color="primary" class="mr-4" @click="editVocabulary" rounded v-else> Enregistrer</v-btn>
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
    <div v-else-if="user != null && showTranslations">
        <translate-add :user="user" :flags=flags :breadcrumbs=breadcrumbs :word=selectedWord @modifbreadcrumbs="breadcrumbsModif($event)"></translate-add>
    </div>
  </v-container>
</template>

<script>
import {mapActions} from "vuex";
import TranslateAdd from "@/components/TranslateAdd/TranslateAdd.vue";

export default {
  name: "VocabularyAdd",
  props: ["user", "page"],
  components: {
    TranslateAdd
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
      showTranslations: false,
      editing: false,
      selectedWord: undefined,
      rules: {
        required: (value) => !!value || "Required.",
      },
      vocabulary: [],
      
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
    ...mapActions("crud", ['getByUserId', 'add', 'delete', 'update']),
   
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
    async addVocabulary(){
        if(this.$refs.form.validate()){
            let payload = {
                tableName: 'vocabulary',
                payload:{
                    name: this.form.name,
                    languageId: this.form.language,
                    description: this.form.description,
                    uid: this.user.uid
                }
            }
            const response = await this.add(payload);
            if(response) {
                this.getVocabulary()
                this.showNotification("le mot a été ajoutées avec succès", 200)
                this.dialog = false
            } 
            else this.showNotification("le mot n'a pas été ajoutées", 500)
        }
    },
    async getVocabulary(){
        const tableName = 'vocabulary'
        const response = await this.getByUserId({ "tableName":tableName, 'uid': this.user.uid} );
        
        if(response){
            this.vocabulary = [];
            for(let word of response){
                for(let language of this.flags){
                    if(language.id == word.languageId){
                        this.vocabulary.push( { ...word, "language": {...language}  } )
                        break
                    }
                }
            }
        }
    },
    async deleteVocabulary(vocabulary){
        let response = this.delete({ 'tableName': "vocabulary", 'id': vocabulary.id })
        if(response) {
            this.showNotification("Le mot a été bien supprimé", 200)
            await this.getVocabulary()
        }
        else this.showNotification("Une erreur s'est produite lors de la suppression", 500)
    },
    async editVocabulary(vocabulary=undefined){
        if(!this.editing){
            this.form.id = vocabulary.id
            this.form.name = vocabulary.name
            this.form.language = vocabulary.languageId,
            this.form.description = vocabulary.description,
            this.dialog = true;
            this.editing = true;
            return
        }
        let payload = {
            name: this.form.name,
            languageId: this.form.language,
            description: this.form.description,
        }
        let response = this.update({ 'tableName': "vocabulary", 'id': this.form.id, "payload": payload})
        if(response) {
            this.getVocabulary()
            this.$refs.form.reset() 
            this.dialog = false;
            this.editing = false;
            this.showNotification("Le mot a été bien modifié", 200)
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
    showDetail(vocabulary){
        this.showTranslations = true;
        this.selectedWord = vocabulary;
    },
    
    //Return all the units and lessons in the home page
   
    breadcrumbsModif(breadcrumb){
        this.breadcrumbs.push(breadcrumb)
    }
  }, 
  async mounted() {
    await this.getLanguages()
    await this.getVocabulary()
    
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
        console.log(this.breadcrumbs);
        if(hash == 0) this.showTranslations = false
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

<style src="./VocabularyAdd.scss" lang="scss"/>
