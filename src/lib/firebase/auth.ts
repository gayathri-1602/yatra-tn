import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPhoneNumber, 
  RecaptchaVerifier,
  onAuthStateChanged,
  signOut
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "./config";

export const signUpWithEmail = async (email: string, pass: string, details: any) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const user = userCredential.user;
    
    // Save additional user details to Firestore
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      name: details.name,
      rollNumber: details.rollNumber,
      department: details.department,
      createdAt: new Date().toISOString(),
    });
    
    return user;
  } catch (error) {
    throw error;
  }
};

export const signInWithEmail = async (email: string, pass: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, pass);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

export const setupRecaptcha = (containerId: string) => {
  if (!auth.currentUser) {
    const recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: 'invisible',
      callback: (response: any) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
      }
    });
    return recaptchaVerifier;
  }
};

export const signInWithPhone = async (phoneNumber: string, appVerifier: any) => {
  try {
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
    return confirmationResult;
  } catch (error) {
    throw error;
  }
};

export const verifyOTP = async (confirmationResult: any, otp: string, details: any) => {
  try {
    const result = await confirmationResult.confirm(otp);
    const user = result.user;
    
    // Save user details to Firestore if it's a new user
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists()) {
      await setDoc(doc(db, "users", user.uid), {
        phoneNumber: user.phoneNumber,
        name: details.name,
        rollNumber: details.rollNumber,
        department: details.department,
        createdAt: new Date().toISOString(),
      });
    }
    
    return user;
  } catch (error) {
    throw error;
  }
};

export const getUserDetails = async (uid: string) => {
  try {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    throw error;
  }
};


