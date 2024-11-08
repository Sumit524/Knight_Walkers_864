import React from "react";

const Layout: React.FC<React.PropsWithChildren> = (props)=> {
    
    return (
        <>
        <div>Navbar</div>
        <div>{props.children}</div>
        </>
    );
}

export default Layout;