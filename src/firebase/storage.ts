import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from "firebase/storage";
import { storage } from "./config";
import heic2any from "heic2any";


export const uploadImage = async (file: File, path: string): Promise<string> => {
  try {
    const storageRef = ref(storage, path);
    console.log("ref\tdone")
    const snapshot = await uploadBytes(storageRef, file);
    console.log("bytes\tdone")
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log("URL\tdone")
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    console.log("Error uploading image:", error);
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
  // If it’s HEIC, convert first
  if (file.type === "image/heic" || file.name.endsWith(".heic")) {
    const blob = await heic2any({ blob: file, toType: "image/png" }) as Blob;
    return new File([blob], `${file.name.split(".")[0]}.png`, { type: "image/png" });
  }

  // Otherwise just return the file as-is or do your normal canvas conversion
  return file;
};

export const uploadPhotoForMonth = async (file: File, userId: string, month: string): Promise<string> => {
  // Convert to PNG before uploading
  console.log("Converting to PNG...")
  const pngFile = await convertToPNG(file);
  console.log("converted!")
  const path = `photos/${userId}/${month}_${Date.now()}.png`;
  console.log("uploading...")
  return uploadImage(pngFile, path);
};