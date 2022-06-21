import app from "./firebase";
import "./App.css"
import { GoogleAuthProvider, getAuth, signInWithRedirect, onAuthStateChanged, signOut } from "firebase/auth";
import {Container, Col, Row, Button, Navbar, NavbarBrand, NavbarToggler, Collapse, Nav, NavItem, NavLink} from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from 'react';
import {Route, Routes, Link, useParams} from "react-router-dom"
import { collection, doc, Firestore, getDocs, getFirestore, setDoc, getDoc, addDoc, updateDoc, where, query } from "firebase/firestore";
import EditUser from "./EditUser"
import UpdateCar from "./UpdateCar"
import Cars from "./Cars"
import AddCar from "./AddCars"
import Profil from "./Profil"

const provider = new GoogleAuthProvider();
const auth = getAuth(app);
const db = getFirestore(app);

let newName;


// le problème viens de la !!! ****************************************************************************


function Home(){
  return <div>Home</div>
}

function App() {
const [user, setUser] = useState(null)
const [role, setRole] = useState(null)

/******************************** api get firebase ==> plusieurs useEffect possible ? ******************************************/

useEffect(() => onAuthStateChanged(auth, (newUser) => {

  console.log("auth",newUser)
  if (newUser){
    console.log(newUser.uid, newUser.email)
    setUser({uid: newUser.uid, email: newUser.email})
  } else {
    setUser(null)
  }
  }), [])

  useEffect(() => {
    async function getCurrentUser(){
      if(!user){
        setRole(null)
      }
      const docRef = doc(db, "Users", user.uid)
      const docSnap = await getDoc(docRef)
      const newRole = docSnap.data().Role
      console.log(newRole)
      setRole(newRole)
    }
    getCurrentUser()
  })


  return (
      <Container>
        <Navbar color="light" expand="md" light>
        <NavbarBrand href="/">
          <img width={"30%"} src="http://localhost:3000/loutacaisse.png" />
        </NavbarBrand>
        <NavbarToggler onClick={function noRefCheck() { }}/>
        <Collapse navbar>
          <Nav className="me-auto" navbar >
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
              <NavLink to={`/Profil/${user?.uid}`} tag={Link}>
              Profil
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/Settings" tag={Link}>
              <img
          width={"20%"}
          src="http://localhost:3000/gear.png"
          />
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
              <Route path="Voitures" element={<Cars user={user} />}/>

              <Route path="UpdateCar/:uid" element={<UpdateCar user={user} />} />

              <Route path="UpdateCar" element={<UpdateCar user={user}/>}>
                <Route path=":uid" element={<UpdateCar/>}></Route>
              </Route>
              <Route path="Update" element={<EditUser  user={user} role={role}/>}>
                <Route path=":uid" element={<EditUser  user={user} role={role}/>}/>
              </Route>
              {/* <Route path="products" element={<Products />}/> */}
              <Route path="AddCar" element={<AddCar />}/>
              {/* <Route path="Liste_voiture" element={<Liste_voiture />}/> */}

              <Route path="Profil" element={<Profil user={user} role={role}/>}>
                <Route path=":uid" element={<Profil/>}/>
              </Route>

            </Routes>
          </Col>
        </Row>
      </Container>
  );
}



export default App;
