import { randomUUID } from 'crypto';
import {initializeApp, FirebaseApp} from 'firebase/app';
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  FirebaseStorage,
} from 'firebase/storage';

const {API_KEY, AUTH_DOMAIN, PROJECT_ID, BUCKET, SENDER_ID, APP_ID} =
  process.env as {[key: string]: string};

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  projectId: PROJECT_ID,
  storageBucket: BUCKET,
  messagingSenderId: SENDER_ID,
  appId: APP_ID,
};

const firebaseApp: FirebaseApp = initializeApp(firebaseConfig);
const firestore: FirebaseStorage = getStorage(firebaseApp);

const upload = async (file: Express.Multer.File, userId: string) => {
  const filename = `$${file.originalname}-${randomUUID()}`;
  const fileRef = ref(firestore, `/${userId}/${filename}`);
  const snapshot = await uploadBytes(fileRef, file.buffer);
  const fileURL = await getDownloadURL(snapshot.ref);

  return fileURL;
};

export {upload};
