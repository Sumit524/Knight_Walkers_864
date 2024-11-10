import React from "react";
import "../../styles/Header.css";
import { useNavigate } from "react-router-dom";

const Header = () => {
    const navigate = useNavigate()
    return (
        <header className="header">
            <img src={'https://www.hollywoodreporter.com/wp-content/uploads/2022/11/Kim-Kardashian-and-Kanye-West-WSJ-Carpet-GettyImages-1186029839-H-2022.jpg?w=1296&h=730&crop=1'} alt="y darshians" className="header-bg" />
            <div className="header-content">
              
                <h3>Find your Meet</h3>
                <button
                    onClick={() => navigate('/findMatch')}
                >Find Match</button>
            </div>
           
        </header>
    )
}

export default Header;