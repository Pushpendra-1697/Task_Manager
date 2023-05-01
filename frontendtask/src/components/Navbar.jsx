import { Box } from '@chakra-ui/react';
import React from 'react'
import { NavLink } from 'react-router-dom';

const Navbar = () => {
    const links = [
        {
            to: "/",
            title: "Home"
        },
        {
            to: "/login",
            title: "Login"
        },
        {
            to: "/register",
            title: "Register"
        },
        {
            to: "/admin",
            title: "Admin"
        }
    ];
    let activeStyle = {
        textDecoration: "none",
        color: "red",
    };
    let normalStyle = {
        textDecoration: "none",
        color: "black",
    };
    return (
        <Box mb={["10%", "10%", "4%"]}>
            <Box display={{ base: "flex", sm: 'flex', lg: "flex" }} boxShadow="rgba(0, 0, 0, 0.35) 0px 5px 15px;" position={"fixed"} top="0.1px" zIndex={"100"} bg="white" justifyContent="space-around" w="100%" padding={"10px"}>
                {links.map((ele) =>
                    <NavLink
                        className='icon'
                        key={ele.to}
                        style={({ isActive }) => (isActive ? activeStyle : normalStyle)}
                        to={ele.to}
                        end
                    >
                        {ele.title}
                    </NavLink>
                )}
            </Box>
        </Box>
    );
}

export default Navbar;