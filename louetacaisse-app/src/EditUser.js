import app from "./firebase";
import { collection, doc, Firestore, getDocs, getFirestore, setDoc, getDoc, addDoc, updateDoc, where, query } from "firebase/firestore";
import { useEffect, useState } from 'react';
import {Container, Col, Row, Button} from "reactstrap";
import {Route, Routes, Link, useParams} from "react-router-dom"

const db = getFirestore(app);


function EditUser(props){
    const path = window.location.href
    const uwu = path.split('/').pop()
    const docRef = doc(db, "Users", uwu);
    // console.log(uwu)
    // console.log(props)
    // console.log(props.user)
    if(uwu != props.user.uid){
      // console.log("salut")
    }
    else{
    }
    // console.log(props.user.uid)
    const uid = useParams().uid ?? props.user.uid
    const [name, setName] = useState("")
    const [firstName, setfirstName] = useState("")
    // const [birthDate, setBirthDate] = useState("")
    const [Adress, setAdress] = useState("")
    const [Phone, setPhone] = useState("")
    const [Licence, setLicence] = useState("")
    const [ProfilPicture, setPicture] = useState("")
    const [users, setUsers] = useState()
    const [Role, setRole] = useState("")
  
    useEffect(() => {
      async function getProfil(){
  
        // const docRef = doc(db, "Users", props.user.uid);
        const docRef = doc(db, "Users", uwu);
        const querySnapshot = await getDoc(docRef);
        // console.log("query = ")
        // console.log(querySnapshot.data())
        setUsers(querySnapshot.data())
        if (querySnapshot.exists()){
          setName(querySnapshot.data().Name)
          setfirstName(querySnapshot.data().Firstname)
          setAdress(querySnapshot.data().Adress)
          setPhone(querySnapshot.data().Phonenumber)
          setLicence(querySnapshot.data().Licencenumber)
          setPicture(querySnapshot.data().ProfilPicture)
          setRole(querySnapshot.data().Role)
          // setBirthDate(querySnapshot.data().birthDate)
        }
      }
      getProfil()
  
    }, [props])
  
  
    async function addUser(user){
      // console.log(props.user.uid)
      // console.log(uid)
      if(props.user.uid != uid){
        // console.log("different value !")
        if(name !="" || firstName !="" || Adress !="" || Phone !="" || Licence !="" ){
          alert("Missing information")
        } 
        else {
        const querySnapshot = await updateDoc(doc(db, "Users", uid), {
          Name: name,
          Firstname: firstName,
          Adress: Adress,
          Phonenumber: Phone,
          Licencenumber: Licence,
          ProfilPicture: ProfilPicture,
          Role: Role
        });
        console.log(querySnapshot)
        alert("The profil has corectly been updated !");
      window.location.href = "/"
      }
      }
      else if(props.user.uid == uid){
        if(name !="" || firstName !="" || Adress !="" || Phone !="" || Licence !="" ){
          alert("Missing information")
        } else {
        const querySnapshot = await updateDoc(doc(db, "Users", props.user.uid), {
          Name: name,
          Firstname: firstName,
          Adress: Adress,
          Phonenumber: Phone,
          Licencenumber: Licence,
          ProfilPicture: ProfilPicture,
          Role: Role
        });
        console.log(querySnapshot)
        alert("The profil has corectly been updated !");
      window.location.href = "/"
      }
  
      }
      
  
    }
    return (
      <table id="tableSetting">
        {props.user &&
        <>
        <tr>
        <td>Name :</td>
        <td><input type="text" id="name" value={name} onChange={e=> setName(e.target.value)} /></td>
        </tr>
        <tr>
        <td>First name :</td>
        <td><input type="text" id="firstname" value={firstName} onChange={e=> setfirstName(e.target.value)}/></td>
        </tr>
        <tr>
        <td>Adress :</td>
        <td><input type="text" id="adress" value={Adress} onChange={e=> setAdress(e.target.value)}/></td>
        </tr>
        <tr>
        <td>Phone number :</td>
        <td><input type="number" id="phonenumber" value={Phone} onChange={e=> setPhone(e.target.value)}/></td>
        </tr>
        <tr>
        <td>Licence number :</td>
        <td><input type="number" id="licencenumber" value={Licence} onChange={e=> setLicence(e.target.value)}/></td>
        </tr>
        <tr>
        <td>Profil Picture :</td>
        <td><input type="text" id="ProfilPicture" value={ProfilPicture} onChange={e=> setPicture(e.target.value)}/></td>
        </tr>
        {props.role === "admin" ? 
        <tr>
          <td>Role :</td>
          {/* {checkRole(Role)} */}
          <td><input type="radio" id="radioadmin" value="admin" onChange={e=> setRole(e.target.value)} checked={Role === "admin"}/>Admin</td>
          <td><input type="radio" id="radioowner" value="owner" onChange={e=> setRole(e.target.value)} checked={Role === "owner"}/>Owner</td>
          <td><input type="radio" id="radiouser" value="user" onChange={e=> setRole(e.target.value)} checked={Role === "user"}/>User</td>
  
        </tr>
        : 
        <tr>
          <td>Role :</td>
          <td>{Role}</td>
        </tr>      
        }
  
        <Button><Link to={`/Profil/${props.user.uid}`}>Back</Link></Button>
        <Button onClick={addUser}>Valider</Button>
        </>
        }
  
      </table>
    )
  }
  
export default EditUser