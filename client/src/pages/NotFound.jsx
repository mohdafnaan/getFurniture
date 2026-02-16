import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { motion } from 'framer-motion';

const NotFound = () => {
    return (
        <MainLayout>
            <div className="flex flex-col items-center justify-center py-20">
                <motion.h1 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-9xl font-bold text-gray-200"
                >
                    404
                </motion.h1>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center mt-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Page Not Found</h2>
                    <p className="text-gray-600 mb-6">The page you are looking for does not exist.</p>
                    <Link to="/" className="bg-amber-700 text-white px-6 py-2 rounded-md hover:bg-amber-800 transition-colors">
                        Go Home
                    </Link>
                </div>
            </div>
        </MainLayout>
    );
};

export default NotFound;
