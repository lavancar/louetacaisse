import app from "./firebase";
import { collection, doc, Firestore, getDocs, getFirestore, setDoc, getDoc, addDoc, updateDoc, where, query } from "firebase/firestore";
import { useEffect, useState } from 'react';
import {Container, Col, Row, Button} from "reactstrap";
import {Route, Routes, Link, useParams} from "react-router-dom"
import { GoogleAuthProvider, getAuth, signInWithRedirect, onAuthStateChanged, signOut } from "firebase/auth";

const provider = new GoogleAuthProvider();
const auth = getAuth(app);
const db = getFirestore(app);



function Cars(props){
    const [cars, setCars] = useState([])
    const [role, setRole] = useState("user")
  
    async function getCars(){
      const user = props.user
      if(!user ){
        setRole("user")
        return
      }
      console.log(user)
      console.log(user.uid)
      const docRef = doc(db, "Users", user.uid)
      const docSnap = await getDoc(docRef)
      const newRole = docSnap.data().Role
      console.log(newRole)
      setRole(newRole)
  
      if (document.getElementById("CarsPage").checked){
        const q = query(collection(db, "Cars"), where("Available", "==", true));
        const querySnapshot = await getDocs(q)
        querySnapshot.forEach((car) => {
          // doc.data() is never undefined for query doc snapshots
          console.log(car.id, " => ", car.data());
          return role
        });
        setCars(querySnapshot.docs.map(car => ({id:car.id, ...car.data()})))
       }else{
        const q = query(collection(db, "Cars"));
        const querySnapshot = await getDocs(q)
        querySnapshot.forEach((car) => {
          // doc.data() is never undefined for query doc snapshots
          console.log(car.id, " => ", car.data());
          return role
        });
        setCars(querySnapshot.docs.map(car => ({id:car.id, ...car.data()})))
       }
    }
  
    useEffect(() => {
      
      getCars()
  
    }, [props.user])
  
    return (
    <div>
      <input type="checkbox" id="CarsPage" onChange={() => getCars()}></input>
      <label> Available Only</label>
      <table id="carsTable">
        <thead>
            <td>Brand</td>
            <td>Model</td>
            <td>Plate</td>
            <td>Fuel</td>
            <td>Price</td>
            <td>Power</td>
            {role === "admin" ?
                <td><button><Link to={`/AddCar`} style={{ textDecoration: 'none', color: "black"}}>ADD</Link></button></td>
                    :
                  <td></td>
                  }
  
        </thead>
        <tbody>
          {cars.map((car) => {
            console.log(car);
            return (
              <tr>
                <td>
                  <li>{car.Brand}</li>
                </td>
                <td>
                  <li>{car.Model}</li>
                </td>
                <td>
                  <li>{car.PlateNumber}</li>
                </td>
                <td>
                  <li>{car.Fuel}</li>
                </td>
                <td>
                  <li>{car.Price}</li>
                </td>
                <td>
                  <li>{car.HP}</li>
                </td>
                <td>
                  {role === "admin" ?
                    <li><button> <Link to={`/UpdateCar/${car.id}`} tag={Link}  style={{ textDecoration: 'none', color: "black"}}> UPDATE </Link></button></li>
                    :
                    <li><button onClick={() => Rent(props, car.id)}>RENT</button></li>
                  }
  
                </td>
              </tr>
            )
  
          }) }
  
        </tbody>
      </table>
    </div>)
  }
  function Rent(props, carID){
    var days = prompt("Select the number of day you want to rent : ", 0)
    days = parseInt(days, 10)
    if(days > 0){
      if(days > 30){
        alert("The maximum time for a location is 30 days !")
      }
      else{
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        today = mm + '/' + dd + '/' + yyyy;
        console.log(today)
        if(parseInt(mm) == 0, 2, 4, 6, 7, 9, 11){ //if mounth == jan, mar, may, jul, aug, oct, dec =>
          dd = parseInt(dd) + days
          if(parseInt(dd) > 31){
            mm = parseInt(mm)+1
            dd = parseInt(dd)-31
            var delta = mm + '/' + dd + '/' + yyyy;
            console.log(delta)
            alert("Your car is reserved until the "+delta)
          }
          if(parseInt(mm) == 11){
            if(dd > 30){
            yyyy = parseInt(yyyy)+1
            mm = 0
            var delta = mm + '/' + dd + '/' + yyyy;
            console.log(delta)
            }
          }
        }
        else if(parseInt(mm) == 1, 3, 5, 8, 10){
          dd = parseInt(dd) + days
          if(parseInt(dd) > 30){
            mm = parseInt(mm)+1
            dd = parseInt(dd)-30
            var delta = mm + '/' + dd + '/' + yyyy;
            console.log(delta)
          }
          var delta = mm + '/' + dd + '/' + yyyy;
        }
  
      }
  
    }
    else{
      alert("wrong value")
    }
    console.log(days)
    console.log(carID)
    const clientId = props.user.uid 
    console.log(clientId)
    const PUSH = addDoc(collection(db,'Reservation'), {
      CarId: carID,
      ClientId: clientId,
      DateEnd: delta,
    });
    const washingtonRef = doc(db, "Cars", carID);
    updateDoc(washingtonRef, {
      Available: false
    });
    window.location.href = "/Voitures"
  }
  export default Cars