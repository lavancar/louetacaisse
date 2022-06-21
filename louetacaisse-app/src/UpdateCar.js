import app from "./firebase";
import { collection, doc, Firestore, getDocs, getFirestore, setDoc, getDoc, addDoc, updateDoc, where, query, deleteField, deleteDoc } from "firebase/firestore";
import { useEffect, useState } from 'react';
import {Container, Col, Row, Button} from "reactstrap";
import {Route, Routes, Link, useParams} from "react-router-dom"
import { GoogleAuthProvider, getAuth, signInWithRedirect, onAuthStateChanged, signOut } from "firebase/auth";

const provider = new GoogleAuthProvider();
const auth = getAuth(app);
const db = getFirestore(app);

function UpdateCar(){
    const params = useParams();
    const uid = params.uid
    // const path = window.location.href
    // const uid = path.split('/').pop()
    console.log(uid)
  
    const [car, setMyCar] = useState(null)
    useEffect(async () => {
      const docRef = doc(db, "Cars", uid)
      const MyCar = await getDoc(docRef)
      console.log(MyCar.data())
  
      setMyCar(MyCar.data())
      
    
    }, [] )
  
    console.log("car = ", car)
    
    //Quand je suis en train de charger mes données, je mes un message d'attente 
    if(car == null){
      return(
        <p>Lownding...</p>
      )
    }
  
    async function ModifCar(){
        if(document.getElementById("ModelVoiture").value =="" || document.getElementById("MarqueVoiture").value =="" || document.getElementById("Immatriculation").value =="" || document.getElementById("PrixVente").value =="" || document.getElementById("Puissance").value ==""){
            alert("Missing informations !")
        } 
        else {
      
        const docRef = doc(db, "Cars", uid)
        updateDoc(docRef, car);
        alert("The car has correctly been updated")
        window.location.href = "/Voitures"
        }
    }

    async function DelCar(){
        console.log("Del car")
        console.log("UID car " + uid)
        if (window.confirm("WARN ! The car is about to be deleted. Continue ?")){
            const carRef = doc(db, "Cars", uid)
            await updateDoc(carRef, {
              Available: deleteField(),
              Brand: deleteField(),
              Fuel: deleteField(),
              HP: deleteField(),
              Model: deleteField(),
              PlateNumber: deleteField(),
              Price: deleteField()
            });
            await deleteDoc(doc(db, "Cars", uid));
            window.location.href = "/Voitures"
        }
      }
  
    
  
    //J'affiche mes informations
    return(
      <div id="div_ModifVoiture" >
      <table border="1" width="100%">
        <tr colspan="2">Updating a car</tr>
        <br/>
        <tr>
          <td>Modèle de la voiture</td>
          <td><input type="text" id="ModelVoiture" value={car.Model} onChange={e => setMyCar({...car, Model: e.target.value})}></input></td>
        </tr>
        <tr>
          <td>Type d'essence</td>
          <td><input type="text" id="EssenceVoiture" value={car.Fuel} onChange={e => setMyCar({...car, Fuel: e.target.value})}></input></td>
        </tr>
        <tr>
          <td>Type d'essence</td>
          <td><select id="EssenceVoiture">
            <option value={car.Fuel}></option>
            <option value="Essence">Essence</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Electric">Electric</option>
            <option value="PHEV">PHEV</option>
          </select></td>
        </tr>
        
        <tr>
          <td>Marque de la voiture</td>
          <td><input type="text" id="MarqueVoiture" value={car.Brand} onChange={e => setMyCar({...car, Brand: e.target.value})}></input></td>
        </tr>
        <tr>
          <td>Plaque d'immatriculation</td>
          <td><input type="text" id="Immatriculation" value={car.PlateNumber} onChange={e => setMyCar({...car, PlateNumber: e.target.value})}></input></td>
        </tr>
        <tr>
          <td> Prix de vente (€)</td>
          <td><input type="number" id="PrixVente" value={car.Price} onChange={e => setMyCar({...car, Price: e.target.value})}></input></td>
        </tr>
        <tr>
          <td> Puissance </td>
          <td><input type="text" id="Puissance" value={car.HP} onChange={e => setMyCar({...car, HP: e.target.value})}></input></td>
        </tr>
  
        <button onClick={ModifCar}> Modifier les informations</button>
  
      </table>
  
      <Button><Link to="/Voitures">BACK</Link></Button>
      <button onClick={DelCar}>DELETE</button>
  
    </div>
    )//fin de mon
  
  }

  export default UpdateCar