import React from 'react';
import './MainP.css'
import logout from '../assets/logout.png';
import Soundcloud from './Components/Soundcloud'

const Login = () => {
  return (
    <>
        <Soundcloud />
    </>
  )
}

const NavBar = () => {

    return (
        <nav className = "navBar">
        <div className='tabs'>
        <ul className='focusF'>
            <li>FocusForge</li>
        </ul>
   
        <ul className='themes'>
            <li>Themes</li>
        </ul>
        <button className='logout'><img src = {logout} style = {{width: '35px', height: '35px'}} ></img></button>
        </div>
        </nav>
    );
}


const SideBar = () =>{


    return(
        <div className='Sidebar'>


        </div>
    )
}

const MainP = () => {


    return (
        <div className = "mainP">
        {/* <h1>MAIN PAGE</h1> */}
        <NavBar />
        <SideBar />
        <Login />


        </div>
    )


}
//Ade
export default MainP;