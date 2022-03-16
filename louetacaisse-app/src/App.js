// import logo from './logo.svg';
// import './App.css';
// import {FirebaseApp} from "./firebase";

import app from "./firebase";
import { GoogleAuthProvider, getAuth, signInWithRedirect, onAuthStateChanged, signOut } from "firebase/auth";
import {container, col, row, button} from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from 'react';

const provider = new GoogleAuthProvider();
const auht = getAuth(app);

function App() {
const [user, setUser] = useState(null)

console.log("Test", user)
useEffect(() => onAuthStateChanged(auht, (newUser) => {
  console.log("auth",newUser)
  if (newUser){
    console.log(newUser.uid, newUser.email)
    setUser({uid: newUser.uid, email: newUser.email})
  } else {
    setUser(null)
  }
  }), [])

  return (
    <div>
      <header>
        <h1>Louetacaisse</h1>
        <div>
          Hello {user ? user.email : "guest"}
        <button onClick={user ? () => signOut(auht) : () => signInWithRedirect(auht, provider)}>{user ? "Logout" : "Login"}</button>
        </div>
      </header>
    </div>
  );
}

export default App;