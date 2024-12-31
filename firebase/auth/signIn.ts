import { signInWithEmailAndPassword } from "firebase/auth";
import { getUserRole } from "../firestore/usersCollection";
import { firebaseAuth } from "../config";

// Get the authentication instance using the Firebase app
// const firebaseAuth = getAuth(firebaseApp);

// Function to sign in with email and password
export default async function signIn(email: string, password: string) {
  let result = null, // Variable to store the sign-in result
    error = null; // Variable to store any error that occurs

  try {
    const { user } = await signInWithEmailAndPassword(
      firebaseAuth,
      email,
      password
    ); // Sign in with email and password
    const userRole = await getUserRole(user.uid);
    result = { ...user, role: "" };
    if (userRole) {
      result = { ...result, role: userRole.role };
    }
  } catch (e) {
    error = e; // Catch and store any error that occurs during sign-in
  }

  return { result, error }; // Return the sign-in result and error (if any)
}
