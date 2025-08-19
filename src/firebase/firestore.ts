import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp
} from "firebase/firestore";
import { db } from "./config";

// Love Messages
export interface LoveMessage {
  id?: string;
  month: string;
  message: string;
  author?: string;
  createdAt: Timestamp;
  userId: string;
}

export const addLoveMessage = async (message: Omit<LoveMessage, 'id' | 'createdAt'>) => {
  try {
    const docRef = await addDoc(collection(db, "loveMessages"), {
      ...message,
      createdAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding love message:", error);
    throw error;
  }
};

export const getLoveMessages = async (userId: string) => {
  try {
    const q = query(
      collection(db, "loveMessages"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as LoveMessage[];
  } catch (error) {
    console.error("Error getting love messages:", error);
    throw error;
  }
};

// Date Plans
export interface DatePlan {
  id?: string;
  title: string;
  location: string;
  date: string;
  time: string;
  description: string;
  itemsToBring: string[];
  category: string;
  createdAt: Timestamp;
  userId: string;
}

export const addDatePlan = async (plan: Omit<DatePlan, 'id' | 'createdAt'>) => {
  try {
    const docRef = await addDoc(collection(db, "datePlans"), {
      ...plan,
      createdAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding date plan:", error);
    throw error;
  }
};

export const getDatePlans = async (userId: string) => {
  try {
    const q = query(
      collection(db, "datePlans"),
      where("userId", "==", userId),
      orderBy("date", "asc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as DatePlan[];
  } catch (error) {
    console.error("Error getting date plans:", error);
    throw error;
  }
};

// Photos
export interface Photo {
  id?: string;
  month: string;
  imageUrl: string;
  caption: string;
  location?: string;
  isFavorite: boolean;
  createdAt: Timestamp;
  userId: string;
}

export const addPhoto = async (photo: Omit<Photo, 'id' | 'createdAt'>) => {
  try {
    const docRef = await addDoc(collection(db, "photos"), {
      ...photo,
      createdAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding photo:", error);
    throw error;
  }
};

export const getPhotos = async (userId: string) => {
  try {
    const q = query(
      collection(db, "photos"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Photo[];
  } catch (error) {
    console.error("Error getting photos:", error);
    throw error;
  }
};

// Real-time listeners
export const subscribeToLoveMessages = (userId: string, callback: (messages: LoveMessage[]) => void) => {
  const q = query(
    collection(db, "loveMessages"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const messages = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as LoveMessage[];
    callback(messages);
  });
};