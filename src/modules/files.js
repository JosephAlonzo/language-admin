import { getStorage, ref, deleteObject, uploadBytes, getDownloadURL  } from "firebase/storage";

export default{
    namespaced: true,
    
    actions:{
        add: async (_, payload)=> {
            const storage = getStorage();
            const storageRef = ref(storage, payload['name']);

            let response = await uploadBytes(storageRef, payload['file']).then((snapshot) => {
                return snapshot
            });
            return response;
        },
        getUrl: async (_, snapshot)=> {
            const storage = getStorage();
            const imageName = snapshot.ref.fullPath
            
            let url = getDownloadURL(ref(storage, imageName))
            .then((url) => {
                return url
            })
            .catch((error) => {
                console.log(error)
                return null
            });

            return url
        },
        delete: async (_, name)=> {
            const storage = getStorage();
            const desertRef = ref(storage, name);
            let response = deleteObject(desertRef).then(() => {
                return true
            }).catch((error) => {
                console.log(error)
                return false
            });
            return response
        }
    },
    getters:{

    }

}