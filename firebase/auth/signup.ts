import { createUserWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth } from "../config";
import { setUserRole } from "../firestore/usersCollection";

// Get the authentication instance using the Firebase app
// const auth = getAuth(firebaseApp);

// Function to sign up a user with email and password
export default async function signUp(
  email: string,
  password: string,
  role: string
) {
  let result = null, // Variable to store the sign-up result
    error = null; // Variable to store any error that occurs

  try {
    const { user } = await createUserWithEmailAndPassword(
      firebaseAuth,
      email,
      password
    ); // Create a new user with email and password
    await setUserRole({ userId: user.uid, role });
    result = { ...user, role };
  } catch (e) {
    error = e; // Catch and store any error that occurs during sign-up
  }

  return { result, error }; // Return the sign-up result and error (if any)
}
