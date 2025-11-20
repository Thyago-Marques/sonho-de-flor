'use client';

import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { initializeFirebase } from './index';
import { v4 as uuidv4 } from 'uuid';

/**
 * Uploads an image file to Firebase Storage and returns its public URL.
 * 
 * @param file The image file to upload.
 * @returns A promise that resolves to the public URL of the uploaded image.
 */
export async function uploadImageAndGetURL(file: File): Promise<string> {
  const { storage } = initializeFirebase();
  const fileExtension = file.name.split('.').pop();
  const fileName = `${uuidv4()}.${fileExtension}`;
  const storageRef = ref(storage, `products/${fileName}`);

  try {
    // Upload the file to the specified storage reference
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get the public download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image to Firebase Storage:", error);
    // Depending on your error handling strategy, you might want to re-throw the error
    // or return a specific error message.
    throw new Error("Image upload failed.");
  }
}
