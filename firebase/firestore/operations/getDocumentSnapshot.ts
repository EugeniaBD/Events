import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../../config";

// Get the Firestore instance
// const db = getFirestore(firebase_app);

// Function to retrieve a document from a Firestore collection
export async function getDocumentSnapshot(
  path: string,
  ...pathSegments: string[]
) {
  // Get a document reference using the provided collection and ID
  const docRef = doc(firestore, path, ...pathSegments);
  // Variable to store the result of the operation
  let result = null;
  // Variable to store any error that occurs during the operation
  let error = null;

  try {
    // Retrieve the document using the document reference
    result = await getDoc(docRef);
  } catch (e) {
    // Catch and store any error that occurs during the operation
    error = e;
  }

  // Return the result and error as an object
  return { result, error };
}
