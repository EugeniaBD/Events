import { doc, setDoc } from "firebase/firestore";
import { firestore } from "../../config";

// Function to update data to a Firestore collection
export default async function updateDocument(
  path: string,
  id: string,
  data: Partial<unknown>
) {
  console.log("updateDocument", path, id, data);

  // Variable to store the result of the operation
  let result = null;
  // Variable to store any error that occurs during the operation
  let error = null;

  try {
    // Set the document with the provided data in the specified collection and ID
    result = await setDoc(doc(firestore, path, id), data, {
      merge: true, // Merge the new data with existing document data
    });
  } catch (e) {
    // Catch and store any error that occurs during the operation
    error = e;
  }

  // Return the result and error as an object
  return { result, error };
}
