import React from "react";
import "../../styles/Header.css";
// import bgwoman from "../assets/bg-woman.jpeg";


const Header = () => {
    return (
        <header className="header">
            <img src={''} alt="Image" className="header-bg" />
            <div className="header-content">
                <h1></h1>
                <h3>Hii</h3>
                <button>Start singing</button>
            </div>
           
        </header>
    )
}

export default Header;