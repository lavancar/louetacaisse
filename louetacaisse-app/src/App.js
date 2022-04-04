import app from "./firebase";
import { GoogleAuthProvider, getAuth, signInWithRedirect, onAuthStateChanged, signOut } from "firebase/auth";
import {Container, Col, Row, Button, Navbar, NavbarBrand, NavbarToggler, Collapse, Nav, NavItem, NavLink} from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from 'react';
import {Route, Routes, Link} from "react-router-dom"
import { collection, doc, Firestore, getDocs, getFirestore } from "firebase/firestore";



const provider = new GoogleAuthProvider();
const auth = getAuth(app);
const db = getFirestore(app);

function Home(){
  return <div>Home</div>
}
function Cars(){
  const [cars, setCars] = useState([])
  useEffect(() => {
    async function getCars(){
      const querySnapshot = await getDocs(collection(db, "Cars"));
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
      });
      setCars(querySnapshot.docs.map(doc => doc.data()))
    }
    getCars()
  }, [])

  return <table>
    <thead>
        <td>Brand</td>
        <td>Model</td>
        <td>Plate</td>
    </thead>
    <tbody>
      <td>
        <li>key={doc.id}</li>
        </td>
    </tbody>
  </table>
}

function Settings(){
  return (
    <table>
      <tr>
      <td>Name :</td>
      <td><input type="text" id="name" /></td>
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
      <Button onClick={AddUser}>Valider</Button>      
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
              <Route path="Settings" element={<Settings />}/>
            </Routes>
          </Col>
        </Row>
      </Container>
  );
}


export default App;
