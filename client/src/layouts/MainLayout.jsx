import Navbar from '../components/Navbar';
import { Toaster } from 'react-hot-toast';

const MainLayout = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen bg-amber-50/30 text-gray-900 font-sans antialiased">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
                {children}
            </main>
            <footer className="bg-gray-900 text-white py-6">
                <div className="container mx-auto px-4 text-center">
                    <p>&copy; {new Date().getFullYear()} GetFurnitures. All rights reserved.</p>
                </div>
            </footer>
            <Toaster position="top-right" />
        </div>
    );
};

export default MainLayout;
