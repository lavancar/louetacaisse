import app from "./firebase";
import "./App.css"
import { GoogleAuthProvider, getAuth, signInWithRedirect, onAuthStateChanged, signOut } from "firebase/auth";
import {Container, Col, Row, Button, Navbar, NavbarBrand, NavbarToggler, Collapse, Nav, NavItem, NavLink} from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from 'react';
import {Route, Routes, Link, useParams} from "react-router-dom"
import { collection, doc, Firestore, getDocs, getFirestore, setDoc } from "firebase/firestore";


const provider = new GoogleAuthProvider();
const auth = getAuth(app);
const db = getFirestore(app);



function Profil(){
  const [Profils, setProfils] = useState([])
  useEffect(() => {
    async function getProfil(){
      const querySnapshot = await getDocs(collection(db, "Users"));
      querySnapshot.forEach((user) => {
        // doc.data() is never undefined for query doc snapshots
        // console.log(car.id, " => ", car.data());
      });
      setProfils(querySnapshot.docs.map(user => user.data()))
    }
    getProfil()
  }, [])

  return <table id="userTable">
  <thead>
      <td>Name</td>
      <td>First Name</td>
      <td>Birth Date</td>
      <td>Adress</td>
      <td>Phone Number</td>
      <td>Subscription Date</td>
      <td>Edit</td>
  </thead>
  <tbody>
    {Profils.map((user) => {
      // console.log(car);
      return (
        <tr>
          <td>
            <li>{user.Name}</li>
          </td>
          <td>
            <li>{user.FirstName}</li>
          </td>
          {/* <td>
            <li>{user.BirthDate}</li>
          </td> */}
          <td>

          </td>
          <td>
            <li>{user.Adress}</li>
          </td>
          <td>
            <li>{user.PhoneNumber}</li>
          </td>
          <td>
            bonjour
          </td>
          <td>
            <Button>Edit</Button>
          </td>
          {/* <td>
            <li>{user.SubscriptionDate}</li>
          </td> */}
        </tr>
      )
      
    }) }
    
  </tbody>
</table>
}


function Home(){
  return <div>Home</div>
}



function Cars(){
  const [cars, setCars] = useState([])
  useEffect(() => {
    async function getCars(){
      const querySnapshot = await getDocs(collection(db, "Cars"));
      querySnapshot.forEach((car) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(car.id, " => ", car.data());
      });
      setCars(querySnapshot.docs.map(car => car.data()))
    }
    getCars()
  }, [])

  return <table id="carsTable">
    <thead>
        <td>Brand</td>
        <td>Model</td>
        <td>Plate</td>
        <td>Fuel</td>
        <td>Price</td>
        <td>Power</td>
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
          </tr>
        )
        
      }) }
      
    </tbody>
  </table>
}

function Settings(props){

  const uid = useParams().uid ?? props.user.uid
  const [name, setName] = useState("")
  const [firstName, setfirstName] = useState("")
  const [birthDate, setBirthDate] = useState("")
  const [Adress, setAdress] = useState("")
  const [Phone, setPhone] = useState("")
  const [Licence, setLicence] = useState("")

  async function addUser(user){

    const querySnapshot = await setDoc(doc(db, "Users", uid), {
      Name: name,
      Firstname: firstName,
      Birthdate: birthDate,
      Adress: Adress,
      Phonenumber: Phone,
      Licencenumber: Licence
    });
      
  }
  return (
    <table id="tableSetting">
      <tr>
      <td>UID :{uid}</td>
      <td><input type="text" id="name" value={name} onChange={e=> setName(e.target.value)} /></td>
      </tr>
      <tr>
      <td>Name :</td>
      <td><input type="text" id="name" value={name} onChange={e=> setName(e.target.value)} /></td>
      </tr>
      <tr>
      <td>First name :</td>
      <td><input type="text" id="firstname" /></td>
      </tr>
      <tr>
      <td>Birth date :</td>
      <td><input type="date" id="birthdate" /></td>
      </tr>
      <tr>
      <td>Adress :</td>
      <td><input type="text" id="adress" /></td>
      </tr>
      <tr>
      <td>Phone number :</td>
      <td><input type="text" id="phonenumber" /></td>
      </tr>
      <tr>
      <td>Licence number :</td>
      <td><input type="text" id="licencenumber" /></td>
      </tr>
      <Button onClick={addUser}>Valider</Button>      
    </table>
  )
}


function App() {
const [user, setUser] = useState([])

/******************************** api get firebase ==> plusieurs useEffect possible ? ******************************************/ 

console.log("Test", user)
useEffect(() => onAuthStateChanged(auth, (newUser) => {
  console.log("auth",newUser)
  if (newUser){
    console.log(newUser.uid, newUser.email)
    setUser({uid: newUser.uid, email: newUser.email})
  } else {
    setUser(null)
  }
  }), [])


  return (
      <Container>
        <Navbar
          color="light"
          expand="md"
          light>
        <NavbarBrand href="/">
        <img
          width={"30%"}
          src="loutacaisse.png" />
        </NavbarBrand>
        <NavbarToggler onClick={function noRefCheck() { }}/>
        <Collapse navbar>
          <Nav
            className="me-auto"
            navbar
          >
            <NavItem>
              <NavLink to="/" tag={Link}>
                Home
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/Voitures" tag={Link}>
              Voitures
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/Profil" tag={Link}>
              Profil
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/Settings" tag={Link}>
              <img
          width={"30%"}
          src="gear.png" />
              </NavLink>
            </NavItem>
          </Nav>
          <Button onClick={user ? () => signOut(auth) : () => signInWithRedirect(auth, provider)}>{user ? user.email : "Login"}</Button>
        </Collapse>
        </Navbar>
        <Row>
          <Col>
            <Routes>
              <Route path="/" element={<Home />}/>
              <Route path="Voitures" element={<Cars />}/>
              <Route path="Settings" element={<Settings user={user} />}>
                <Route path=":uid" element={<Settings/>}/>
              </Route>
              <Route path="Profil" element={<Profil/>}>
                
              </Route>
            </Routes>
          </Col>
        </Row>
      </Container>
  );
}



export default App;