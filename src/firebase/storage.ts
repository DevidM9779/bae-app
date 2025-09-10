import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from "firebase/storage";
import { storage } from "./config";

export const uploadImage = async (file: File, path: string): Promise<string> => {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

export const deleteImage = async (path: string): Promise<void> => {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (error) {
    console.error("Error deleting image:", error);
    throw error;
  }
};

// Convert image to PNG format
export const convertToPNG = async (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const pngFile = new File([blob], `${file.name.split('.')[0]}.png`, { type: 'image/png' });
          resolve(pngFile);
        } else {
          reject(new Error('Failed to convert image to PNG'));
        }
      }, 'image/png', 1.0);
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

export const uploadPhotoForMonth = async (file: File, userId: string, month: string): Promise<string> => {
  // Convert to PNG before uploading
  const pngFile = await convertToPNG(file);
  const path = `photos/${userId}/${month}_${Date.now()}.png`;
  return uploadImage(pngFile, path);
};