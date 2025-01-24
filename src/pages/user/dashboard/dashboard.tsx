import { Route, Routes } from 'react-router-dom';
import { Header } from './components/header';
import { Menu } from './components/menu';
import styled from 'styled-components';
import { Home } from './nested/home/homepage';


export const Dashboard = () => {
    return (
        <DashboardStyles>
            <Header/>
            <Menu/>
            <Routes>
                <Route path="home" element={<Home />}/>
            </Routes>
        </DashboardStyles>
    )
}

const DashboardStyles = styled.div`
    display: grid;
    grid-template-columns: 200px 1fr;
    grid-template-rows: 100px 1fr;
    height: 100vh;
    width: 100vw;
    background-color: #f9f9f9;
`