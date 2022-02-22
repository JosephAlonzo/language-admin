import axios from "axios"
import { getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";

export default{
    namespaced: true,
    actions:{
       
        createAccount: async (_,payload)=>{
            const auth = await getAuth();
            const response = await createUserWithEmailAndPassword(auth, payload['email'], payload['password'])
            .then( async userCredential => {
                const response = { "code": 200, ...userCredential.user};
                const user = await auth.currentUser;

                updateProfile((user), {
                displayName: payload['name']
                }).then((user) => {
                    // Profile updated!
                    console.log('Profile updated!', user);
                }).catch((error) => {
                // An error occurred
                console.log(error);
                });
                return response;
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                const response = { "code": 500, 'errorCode': errorCode, 'errorMessage': errorMessage}
                return response
            });
            return response
        },
        
        loginWithEmail: async(_, payload)=>{
            const auth = getAuth();
            const response = await signInWithEmailAndPassword(auth, payload['email'], payload['password'])
            .then((userCredential) => {
                const user = { "code": 200, ...userCredential.user};
                return user;
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                const response = { "code": 500, 'errorCode': errorCode, 'errorMessage': errorMessage}
                console.log(response)
                return response
            });
            return response
        },
        loginWithGoogle: async () =>{
            const provider = new GoogleAuthProvider();
            const auth = getAuth();
            auth.languageCode = 'fr';
            const response = await signInWithPopup(auth, provider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                //const credential = GoogleAuthProvider.credentialFromResult(result);
                //const token = credential.accessToken;
                // The signed-in user info.
                const user = { 'code':200, ...result.user};
                return user
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.email;
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);
                const response = { 'code':500, "errorCode": errorCode, "errorMessage": errorMessage, "email": email, "credential": credential }
                console.log( response )
                return response
            });
            return response
        },
        resetPassword: async ( email)=>{
            let data = await axios
            .post("https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyCU5U8YFsz_M2AefEYz3o3yHuQ2bplkwSQ", {
              "requestType": "PASSWORD_RESET",
              "email": email
            })
            .then(function (response) {
                return response
            })
            .catch(function (error) {
                data = null
                console.log(error)
                return data
            })
        },
        getCurrentUser: async ()=> {
            const auth = await getAuth();
            return auth
        }
    },
    getters:{

    }

}