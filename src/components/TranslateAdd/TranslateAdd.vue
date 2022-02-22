<template>
  <v-container fluid>
    <div class="translations-add-page" v-if="user != null">
        <v-row no-gutters class="d-flex justify-space-between mt-5 mb-6">
            <h1 class="page-title">Mes traductions</h1>
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
                    <p class="m-auto">Ajouter une traduction</p>
                    </v-col>
                </v-row>
            </v-card>
            </v-col>
            
            <v-col lg="4" sm="6" cols="12" v-for="translation in translations" :key="translation.id">
                <v-card
                    class="mx-auto"
                    outlined
                    v-if="translation.enabled==true"
                >
                    <v-list-item three-line>
                    <v-list-item-content>
                        <div class="text-overline mb-4">
                        Traduction
                        </div>
                        <v-list-item-title class="text-h5 mb-1">
                        {{translation.name}}
                        </v-list-item-title>
                        <v-list-item-subtitle>{{translation.description}}</v-list-item-subtitle>

                        
                    </v-list-item-content>

                    <v-avatar size="80" >
                        <img  class="card-flag"
                            :src= translation.language.flag
                            :alt= translation.language.name
                        >
                    </v-avatar>
                    </v-list-item>
                    <v-card-actions v-if="page!='Home'">
                        <v-btn icon plain large class="ml-1" @click="editTranslations(translation)" >
                            <v-icon >mdi-square-edit-outline </v-icon>
                        </v-btn>
                        <v-btn icon plain large @click="deleteTranslations(translation)">
                            <v-icon >mdi-trash-can-outline </v-icon>
                        </v-btn>
                    </v-card-actions>
                    
                </v-card>
            </v-col>
        </v-row>

        <v-row>
            <v-dialog v-model="dialog" max-width="400">
            <v-card>
                <v-card-title>Ajouter une nouvelle traduction</v-card-title>
                <v-card-text>
                <v-row class="my-2 ml-2">
                    <div v-for="flag in flags" :key="flag.id" class="mr-2">
                        <v-avatar size="70" v-if="flag.id != word.languageId">
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
                    label="Traduction"
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
                        <v-btn color="primary" class="mr-4" @click="addtranslations" rounded v-if="!editing"> Ajouter</v-btn>
                        <v-btn color="primary" class="mr-4" @click="editTranslations" rounded v-else> Enregistrer</v-btn>
                    </v-col>
                
                </v-form>
                </v-card-text>
            </v-card>
            </v-dialog>
        </v-row>
    </div>
  </v-container>
</template>

<script>
import {mapActions} from "vuex";

export default {
  name: "TranslateAdd",
  props: ["user", "flags", 'word', "breadcrumbs"],
  components: {
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
        rules: {
            required: (value) => !!value || "Required.",
        },
        translations: [],
        languages: [],

    };
  },
  methods: {
    ...mapActions("files", { 
        addFile : 'add',
        getUrl: 'getUrl'
    }),
    ...mapActions("crud", ['getByUserId', 'add', 'delete', 'update', 'getByQuery']),
   
    
    async addImage(){
        const file =  this.formLanguage.flag;
        let payload = {
            name: file.name,
            file: file
        }
        return await this.addFile(payload)
    },
    async addtranslations(){
        if(this.$refs.form.validate()){
            let payload = {
                tableName: 'translations',
                payload:{
                    name: this.form.name,
                    languageId: this.form.language,
                    description: this.form.description,
                    uid: this.user.uid,
                    vocabularyId: this.word.id
                }
            }
            const response = await this.add(payload);
            if(response) {
                await this.getTranslations()
                this.showNotification("la traduction a été ajoutées avec succès", 200)
                this.dialog = false
            } 
            else this.showNotification("la traduction n'a pas été ajoutées", 500)
        }
    },
    async getTranslations(){
        const tableName = 'translations'
        const response = await this.getByQuery({ "tableName":tableName, 'id': this.word.id, 'field': 'vocabularyId'} );
        
        if(response){
            this.translations = [];
            for(let translation of response){
                if(!translation.enabled) continue
                for(let language of this.flags){
                    if(language.id == translation.languageId){
                        this.translations.push( { ...translation, "language": {...language}  } )
                        break
                    }
                }
            }
        }
    },
    async deleteTranslations(translations){
        let response = this.delete({ 'tableName': "translations", 'id': translations.id })
        if(response) {
            this.showNotification("la traduction a été bien supprimé", 200)
            await this.getTranslations()
        }
        else this.showNotification("Une erreur s'est produite lors de la suppression", 500)
    },
    async editTranslations(translations=undefined){
        if(!this.editing){
            this.form.id = translations.id
            this.form.name = translations.name
            this.form.language = translations.languageId,
            this.form.description = translations.description,
            this.dialog = true;
            this.editing = true;
            return
        }
        let payload = {
            name: this.form.name,
            languageId: this.form.language,
            description: this.form.description,
        }
        let response = this.update({ 'tableName': "translations", 'id': this.form.id, "payload": payload})
        if(response) {
            await this.getTranslations()
            this.$refs.form.reset() 
            this.dialog = false;
            this.editing = false;
            this.showNotification("la traduction a été bien modifié", 200)
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
   
    
    addBreadcrumb(breadcrumb){
      this.$emit("modifbreadcrumbs", breadcrumb);
    },
    getLanguages(){
        this.flags.forEach(element => {
            if(element.id != this.word.languageId) this.languages.push({ text:element.name, value: element.id})
        });
    },
  }, 
  async mounted() {
    await this.getTranslations()
    let breadcrumb = {
      text: this.word.name,
      disabled: false,
      to: `#1`,
    }
    this.addBreadcrumb(breadcrumb)
    this.getLanguages();
  },
  watch: {
      dialog: function (val) {
      if(!val && this.editing) this.editing= false
    }
    
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

<style src="./TranslateAdd.scss" lang="scss"/>
