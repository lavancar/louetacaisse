import app from "./firebase";
import { collection, doc, Firestore, getDocs, getFirestore, setDoc, getDoc, addDoc, updateDoc, where, query } from "firebase/firestore";
import { useEffect, useState } from 'react';
import {Container, Col, Row, Button} from "reactstrap";
import {Route, Routes, Link, useParams} from "react-router-dom"
import { GoogleAuthProvider, getAuth, signInWithRedirect, onAuthStateChanged, signOut } from "firebase/auth";

const provider = new GoogleAuthProvider();
const auth = getAuth(app);
const db = getFirestore(app);

let newName;

function Profil(props){
    console.log("props = " ,props)
    const [Profil, setProfils] = useState({})
    const [users, setUsers] = useState([])
    useEffect(async () => {
      async function getProfil(){
        if(! props.user) {
          return
        }
  
        const query = await getDocs(collection(db, "Users"));
        query.forEach((user) => {
        // doc.data() is never undefined for query doc snapshots
          console.log(user.id, " => ", user.data());
        })
  
        const docRef = doc(db, "Users", props.user.uid);
        const querySnapshot = await getDoc(docRef);
        // console.log("query = ")
        // console.log(querySnapshot.data())
        setProfils(querySnapshot.data())
        setUsers(query.docs.map(user => ({id:user.id, ...user.data()})))
      }
  
      newName = await checkInfos(Profil.Name)
      getProfil()
    }, [props.user])
  
    return (
      <div>
        {/* {console.log(Profil.Role)} */}
        {Profil.Role === "admin" ?
          // ListUsers()
          <table>
            <thead>
              <td>Name</td>
              <td>FirstName</td>
              <td>Phone Number</td>
              <td>Licence Number</td>
              <td>Role</td>
              <td></td>
            </thead>
            <tbody>
              {users.map((user) => {
                return (
                  <tr>
                  {console.log(user.id, " => ", user)}
                  <td>
                    <li>{user.Name}</li>
                  </td>
                  <td>
                    <li>{user.Firstname}</li>
                  </td>
                  <td>
                    <li>{user.Phonenumber}</li>
                  </td>
                  <td>
                    <li>{user.Licencenumber}</li>
                  </td>
                  <td>
                    <li>{user.Role}</li>
                  </td>
                  <td>
                  <Button><Link to={`/Update/${user.id}`}>UPDATE</Link></Button>
                  </td>
                </tr>
                )
  
              }) }
            </tbody>
          </table>
          :
          <table id="userTable">
            <tbody>
              <tr>
                <td>UID : </td>
                <td>{props.user?.uid ?? ''}</td>
              </tr>
              <tr>
                <td>Name : </td>
                { <td>{Profil.Name ?? ''}</td> }
              </tr>
              <tr>
                <td>First Name : </td>
                <td>{Profil.Firstname ?? ''}</td>
              </tr>
              <tr>
                <td>Phone Number : </td>
                <td>{Profil.Phonenumber ?? ''}</td>
              </tr>
              <tr>
                <td>Email : </td>
                <td>{props.user?.email ?? ''}</td>
              </tr>
              <tr>
                <td>Licence Number : </td>
                <td>{Profil.Licencenumber ?? ''}</td>
              </tr>
              <tr>
                <td>Role : </td>
                <td>{Profil.Role}</td>
              </tr>
            </tbody>
            <Button><Link to={`/Update/${props.user.uid}`}>UPDATE</Link></Button>
  
          </table>
        }
      </div>
  
  
    )
  
  
}
  
  
  
async function checkInfos(value){
  
    async function GetUser(){
     const path = window.location.href
     const uid = path.split('/').pop()
     const docRef = doc(db, "Users", uid);
    //  console.log(uid)
     const querySnapshot = await getDoc(docRef);
    //  console.log("query = ")
  
     return querySnapshot.data() === undefined
    }
  
    if(await GetUser() === true){
      const path = window.location.href
      const uid = path.split('/').pop()
      const querySnapshot = setDoc(doc(db, "Users", uid), {
       Name: "",
       Firstname: "",
       Birthdate: "",
       Adress: "",
       Phonenumber: "",
       Licencenumber: "",
       ProfilPicture: "",
     });
    }
}

  export default Profil