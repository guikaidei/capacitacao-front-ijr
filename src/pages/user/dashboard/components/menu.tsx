import { menuItems } from "../constants/menu-items";
import styled from "styled-components";

export const Menu = () => {
    return (
        <MenuStyles>
            <h1>Menu</h1>
            {menuItems.map((item, index) => {
                return (
                    <a key={index} href={item.href}>
                        {item.icon}
                        {item.label}
                    </a>
                );
            })}
        </MenuStyles>
    );
}

const MenuStyles = styled.div`
    grid-column: 1;
    grid-row: 1 / span 2;
    background-color: #f9f9f9;
    padding: 20px;
    border-right: 1px solid #ddd;
`;
