import { Outlet } from "react-router-dom/dist"
import ScrollToTop from "../components/ScrollToTop"
import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"
import { AuthModeProvider } from "../hooks/AuthModeContext";

// Base component that maintains the navbar and footer throughout the page and the scroll to top functionality.
export const Layout = () => {
    return (
        <AuthModeProvider>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh'
            }}>
                <ScrollToTop>
                    <Navbar />
                    <main style={{ flex: 1 }}>
                        <Outlet />
                    </main>
                    <Footer />
                </ScrollToTop>
            </div>
        </AuthModeProvider>
    );
};