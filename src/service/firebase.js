import { useFirestore } from 'vuefire';
import { addDoc, collection, getDocs } from 'firebase/firestore';

const db = useFirestore();

export function getDatabase(database) {
    const colRef = collection(db, database);
    return getDocs(colRef)
        .then((res) => {
            const documents = [];
            res.forEach((doc) => {
                documents.push({ id: doc.id, ...doc.data() });
            });
            return documents;
        })
        .catch((error) => {
            console.log('Error getting documents:', error);
        });
}

export function addDatabase(database, data) {
    return addDoc(collection(db, database), data)
        .then((docRef) => {
            return docRef.id;
        })
        .catch((error) => {
            console.error('Error adding document: ', error);
            return console.log(error);
        });
}
