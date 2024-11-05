import React from "react";
import "../../styles/Header.css";
// import bgwoman from "../assets/bg-woman.jpeg";


const Header = () => {
    return (
        <header className="header">
            <img src={''} alt="Background woman" className="header-bg" />
            <div className="header-content">
                <h1></h1>
                <h3>Buy from us now!</h3>
                <button>Start singing</button>
            </div>
           
        </header>
    )
}

export default Header;