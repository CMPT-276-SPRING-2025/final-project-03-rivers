import React from 'react';
// import './MainP.css'
import logout from './MPimgs/logout.png';
const NavBar = () => {

    return (
        <nav className = "navBar">
        <ul className='focusF'>
            <li>FocusForge</li>
        </ul>
        <div>
        <ul className='themes'>
            <li>Themes</li>
        </ul>
        <img src = {logout}></img>
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