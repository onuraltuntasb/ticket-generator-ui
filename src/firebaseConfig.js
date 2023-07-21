// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: 'AIzaSyBwcFGO1MPYNWX25p5Y4XYfqdCWyrIqWhY',
    authDomain: 'ticketgenerator-33065.firebaseapp.com',
    projectId: 'ticketgenerator-33065',
    storageBucket: 'ticketgenerator-33065.appspot.com',
    messagingSenderId: '213305440272',
    appId: '1:213305440272:web:b841bb98cf891f2fd33295',
    measurementId: 'G-0S0GEYQLCG'
};
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
