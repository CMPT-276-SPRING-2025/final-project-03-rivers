import React from 'react';
import './MainP.css'
import logout from './MPimgs/logout.png';
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
        <button className='navBar'><img src = {logout} style = {{width: '30px', height: '30px'}} ></img></button>
        </div>
        </nav>
    );
}




const MainP = () => {


    return (
        <div className = "mainP">
        {/* <h1>MAIN PAGE</h1> */}
        <NavBar />




        </div>
    )


}

export default MainP;