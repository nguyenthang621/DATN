// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  //   apiKey: 'AIzaSyCkiby-W_Yxmx4gRr-fFBafN3M-lrk4Mig',
  //   authDomain: 'cloudbookingcare.firebaseapp.com',
  //   projectId: 'cloudbookingcare',
  //   storageBucket: 'cloudbookingcare.appspot.com',
  //   messagingSenderId: '180156615416',
  //   appId: '1:180156615416:web:395cec2fa6df1765c9890d',
  //   measurementId: 'G-1EJ1DX7BGF'

  apiKey: 'AIzaSyCOXkRWhou-hqZ1Pa0xjBZGprlH0RvIJVo',
  authDomain: 'imagedatn.firebaseapp.com',
  projectId: 'imagedatn',
  storageBucket: 'imagedatn.appspot.com',
  messagingSenderId: '29216437251',
  appId: '1:29216437251:web:9866c46596fe80ff268a36',
  measurementId: 'G-9679R9FBQZ'
}
// Initialize Firebase
export const app = initializeApp(firebaseConfig)
export const storage = getStorage(app)
