import React from "react";
import { NavLink } from "react-router-dom";

const NavLinks = ({ onLinkClick }) => {
    const links = [
        { to: "/", label: "Home" },
        { to: "/products", label: "Products" },
        { to: "/categories", label: "Categories" },
        { to: "/about", label: "About" },
        { to: "/contact", label: "Contact" },
    ];

    return (
        <ul className="nav justify-content-center py-2 mb-0">
            {links.map((link) => (
                <li className="nav-item" key={link.to}>
                    <NavLink
                        to={link.to}
                        className="nav-link fw-semibold text-dark px-3"
                        onClick={onLinkClick}
                    >
                        {link.label}
                    </NavLink>
                </li>
            ))}
        </ul>
    );
};

export default NavLinks;
