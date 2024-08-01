import Header from './Header'
import Navbar from './Navbar'
import { Outlet, useLocation } from 'react-router-dom'
import Footer from './Footer'

export default function DefaultLayout() {

    const location = useLocation()
    let showHeader = true, showNavBar = true;
    if (location.pathname === "/login")
        showHeader = false;
    
    if (location.pathname === "/login" 
    || location.pathname === "/" 
    || location.pathname === "/mySociety" 
    || location.pathname === "/privacyPolicy" 
    || location.pathname === "/refundPolicy" 
    || location.pathname === "/termsandConditions" 
    || location.pathname.includes("/societySubscriptions/") 
    )
        showNavBar = false;

    return (
        <>
            {showHeader && <Header />}
            {showNavBar && <Navbar />}
            <main className={location.pathname === "/" ? "" : "main-container"}>
                <Outlet />
            </main>
            <Footer />
        </>
    )
}
