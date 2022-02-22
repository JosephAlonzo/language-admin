import {firebase} from 'vue'
import { getFirestore, collection, addDoc, doc, setDoc, updateDoc, getDoc, getDocs , query, where  } from 'firebase/firestore/lite';


export default{
    namespaced: true,
    actions:{
        add: async ( _, data)=>{
            const db = getFirestore(firebase);
            const tableName = data["tableName"]
            let payload = data["payload"]
            if(data['enabled'] != false) payload['enabled'] = true 
            const docRef = await addDoc(collection(db, tableName), {
                ...payload,
            });
            return docRef.id;
        },
        update: async(_, data) =>{
            try {
                const db = getFirestore(firebase);
                const docRef = doc(db, data['tableName'], data['id']);
                updateDoc(docRef, data['payload']);
                return true
            } catch (error) {
                console.log(error)
                return false
            }
            
        },
        delete: async(_, data) =>{
            try {
                const db = getFirestore(firebase);
                const docRef = doc(db, data['tableName'], data['id']);
                updateDoc(docRef, {enabled: false} );
                return true
            } catch (error) {
                console.log(error)
                return false
            }
        },
        get:async(_, tableName) =>{
            const db = getFirestore(firebase);
            const querySnapshot = await getDocs(collection(db, tableName));
            let data = []
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                data.push ({ 'id': doc.id, ...doc.data() })
            });
            return data
        },
        getById:async(_, data) =>{
            const db = getFirestore(firebase);
            const ref = doc(db, data['tableName'], data['id']);
            const docSnap = await getDoc(ref);
            if (docSnap.exists()) {
                return docSnap.data();
            } else {
                return false
            }
        },
        getByUserId:async(_, data) => {
            const db = getFirestore(firebase);
            const docRef = collection(db, data['tableName']);
            const q = query(docRef, where("uid", "==", data['uid']),where( 'enabled', "==", true));
            const querySnapshot = await getDocs(q);
            let response = []
            querySnapshot.forEach((doc) => {
                response.push ({ 'id': doc.id, ...doc.data() })
            });
            return response
        },
        getByQuery:async(_, data) => {
            console.log(data)
            const db = getFirestore(firebase);
            const docRef = collection(db, data['tableName']);
            const q = query(docRef, where( data['field'], "==", data['id']),where( 'enabled', "==", true) );
            const querySnapshot = await getDocs(q);
            let response = []
            querySnapshot.forEach((doc) => {
                response.push ({ 'id': doc.id, ...doc.data() })
            });
            return response
        },
        queryVocabularyActivity:async(_, data) => {
            const db = getFirestore(firebase);
            const docRef = collection(db, 'vocabulary');
            let q1 = query(docRef, 
                where( 'languageId', "==", data['languageId']),
                where( 'uid', "==", data['uid']),
                where( 'enabled', "==", true),
            );
        
            const querySnapshot = await getDocs(q1);
            let response = []
            querySnapshot.forEach((doc) => {
                response.push ({ 'id': doc.id, ...doc.data() })
            });
            return response
        },
        //Agregar campos a una tabla
        updateStructure: async(_, data) =>{
            const db = getFirestore(firebase);
            const docRef = doc(db, data['tableName'], data['id']);
            let merge = false
            if(data['merge'] != undefined) merge= data['merge']

            //Si merge es true la informacion del documento se combinara si no la sustituira
            try {
                setDoc(docRef, data['payload'] , { merge: merge });
                return true
            } catch (error) {
                return false
            }
            
        },
        getCount:async(_, data) => {
            const db = getFirestore(firebase);
            const docRef = collection(db, data['tableName']);
            const q = query(docRef, where( data['field'], "==", data['id']),where( 'enabled', "==", true) );
            const querySnapshot = await getDocs(q);
            let total = querySnapshot.docs.length
            return total
        },
        getProjetsUnitsLessons:async() => {
            const db = getFirestore(firebase);
            let response = []
            let tables = ['projets', 'units' , 'lessons']
            for(let table of tables ){
                const docRef = collection(db, table);
                const q = query(docRef, where( 'enabled', "==", true) );
                const querySnapshot = await getDocs(q);
                let total = querySnapshot.docs.length
                response.push(total)
            }
            return response
        },
    },
}
