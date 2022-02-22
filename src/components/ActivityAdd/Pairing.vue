<template>
  <v-container fluid>
    <div class="paring">
     <v-row class="mb-0 pb-0">
        <v-col class="col-6">Phrase à traduire</v-col>
        <v-col class="col-6">{{langue.name}}:</v-col>
     </v-row>
     <v-form ref="form" v-model="valid" lazy-validation>
        <v-row class="my-0 py-0" v-for="question,index of array" :key="index">
            <v-col class="col-5 my-0 py-0">
                <v-text-field
                    label="Sasir le mot"
                    v-model="question.mot"
                    :rules="[rules.required]"
                ></v-text-field>
            </v-col>
            <v-col class="col-5 my-0 py-0">
                <v-text-field
                    v-model="question.translation"
                    label="Sasir le mot traduit"
                    :rules="[rules.required]"
                    v-if="question['file']==undefined"
                ></v-text-field>
                <v-file-input
                    accept="image/png, image/jpeg, image/bmp, image/jpg"
                    placeholder="Ressources"
                    prepend-icon="mdi-file"
                    label="Ressources"
                    v-model="question.file"
                    v-else
                ></v-file-input>
            </v-col>
            <v-col class="col-2">
                <v-btn icon plain @click="deleteToArray(index)"><v-icon dark color="secondary"> mdi-delete </v-icon></v-btn>
            </v-col>
        </v-row>
     </v-form>
     <v-row class="my-0 py-0">
        <v-col class="pl-3 my-0 py-2">

            <v-btn color="primary" rounded v-if="type==0" @click="array.push({'mot':'', 'translation': '' })">Ajouter un mot</v-btn>  
            <v-btn color="primary" rounded v-if="type==2" @click="array.push({'mot':'', 'translation': '' })">Ajouter un mot</v-btn>  
            <v-btn color="primary" rounded v-else-if="type==1" @click="array.push({'mot':'', 'translation': '' })">Ajouter une phrase</v-btn>  
            <v-btn color="primary" rounded v-else-if="type==3" @click="array.push({'mot':'', 'file': '' })">Ajouter un mot</v-btn>  
            <v-btn color="primary" rounded v-else-if="type==4" @click="array.push({'mot':'', 'file': '' })">Ajouter un mot</v-btn>  

        </v-col>
        <v-col class="pl-3">
            <v-btn color="secondary" @click="console()">Console</v-btn>  
        </v-col>
     </v-row>
    </div>
  </v-container>
</template>

<script>
import {mapActions} from "vuex";

export default {
    props: ['id', 'langue', 'type'],
    components: {},
    data() {
        return {
            tableName: 'parings',
            array: [],
            vocabulary: [],
            rules: {
                required: (value) => !!value || "Required.",
            },
            valid: false,
            typesActivites: ['GuessWord', 'Pairing', 'Translation', 'ListenAndSelectWord','SoundImageMatch', 'CompleteSentences']
        };
    },
    methods: {
        ...mapActions("files", { 
            addFileStorage : 'add',
            getUrl: 'getUrl'
        }),
        ...mapActions("crud", ['getById', 'add', 'delete', 'update', 'queryVocabularyActivity']),
        
        deleteToArray(index){
            this.array.splice(index, 1);
        },
        async start(id){
            console.log("START", id)
            this.array = []
            await this.getTable(id);
        },
        async activityListeAndSelectWord(){
            for(let e in this.array){
                let fileRef = await this.addFile(this.array[e].file)
                let url = await this.getUrl(fileRef)
                this.array[e].file = url
            }
        },
        async addActivity(){
            if(!this.$refs.form.validate()) return
            if(this.type == 3 || this.type == 4) await this.activityListeAndSelectWord()
            
            let name = this.typesActivites[this.type]
            let payload = {
                tableName: this.tableName,
                payload: {}
            }
            payload['payload'][name] = {...this.array}
            payload['payload']['enabled'] = false
            const response = await this.add(payload);
            if(response) {
                this.array = []
                this.$emit("addGame", response);
            } 
            else this.$emit("addGame", false);
        },
        async deleteActivity(id){
            const response = await this.delete({ 'tableName': this.tableName, 'id': id })
            if(response)  this.$emit("addGame", { 'code': 200, 'response': response});
            else this.$emit("addGame", { 'code': 500, 'response': false});
        },
        async editActivity(){
            if(!this.$refs.form.validate()) return
            let name = this.typesActivites[this.type]
            let payload = {}
            payload[name] = {...this.array}

            console.log(this.id)
            const response = await this.update({ tableName: this.tableName, 'id': this.id, "payload": payload})
            if(response){
                this.array = []
                this.$emit("addGame", null);
            }
            else this.$emit("addGame", this.id);
        },
        async getTable(id){
            let name = this.typesActivites[this.type]
            const response = await this.getById({ "tableName": this.tableName, 'id': id } );
            this.array = []
            if(response[name] !== undefined){
                for(let e in response[name]){
                    this.array.push(response[name][e])
                }
            }
            
        },
        async getVocabulary(){
            const response = await this.queryVocabularyActivity({'uid': this.user.uid, 'languageId': this.projet.language.id} );
            if(response){
                this.vocabulary = [];
                for(let word of response){
                    this.vocabulary.push({ text:word.name, value: word.id})
                }
            }
        },
        async addFile(file){
            let payload = {
                name: file.name,
                file: file
            }
            return await this.addFileStorage(payload)
        },
    },
    watch: {
        send: function(val){
            alert(val)
            if(val && !this.id) this.add() 
            else if(val && this.id) this.update(this.id) 
        }
    },
    async mounted() {
        if(this.id){
            await this.getTable(this.id);
        }
        await this.getVocabulary();
    },
};
</script>

<style src="./ActivityAdd.scss" lang="scss"/>
