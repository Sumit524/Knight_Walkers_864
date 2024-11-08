import React from "react";
import "../../styles/Header.css";

const Header = () => {

    return (
        <header className="header">
            <img src={''} alt="y darshians" className="header-bg" />
            <div className="header-content">
                <h1></h1>
                <h3>Buy from us now!</h3>
                <button>Start singing</button>
            </div>
           
        </header>
    )
}

export default Header;