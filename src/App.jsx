import { Route, Routes } from "react-router-dom";
import Sidebar from "./components/common/Sidebar";
import OverviewPage from "./pages/OverviewPage";
import ProductsPage from "./pages/ProductsPage";
import UsersPage from "./pages/UsersPage";
import SalesPage from "./pages/SalesPage";
import OrdersPage from "./pages/OrdersPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";

import { useState } from "react";
import { UserContext } from "./components/Hooks/UserContext";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";

function App() {
	const [products, setProducts] = useState([]);
	const [productmodalopen, setProductModalOpen] = useState(false);
	const [productkey, setProductKey] = useState();
	return (
		<UserContext.Provider value={{productmodalopen, setProductModalOpen, productkey, setProductKey, products, setProducts}}>
			<div className='flex h-screen dark:bg-gray-900 bg-[#F8F9FA] text-gray-100 overflow-hidden'>
				{/* BG */}
				<div className='fixed inset-0 z-0'>
					<div className='absolute inset-0 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 opacity-80 bg-gradient-to-br from-gray-200 via-gray-400 to-gray-200 ' />
					<div className='absolute inset-0 backdrop-blur-sm' />
				</div>

				<Sidebar />
				<Routes>
					<Route path='/' element={<OverviewPage />} />
					<Route path='/products' element={<ProductsPage />} />
					<Route path='/add-product' element={<AddProduct />} />
					<Route path="/edit-product/:id" element={<EditProduct />} />
					<Route path='/users' element={<UsersPage />} />
					<Route path='/sales' element={<SalesPage />} />
					<Route path='/orders' element={<OrdersPage />} />
					<Route path='/analytics' element={<AnalyticsPage />} />
					<Route path='/settings' element={<SettingsPage />} />
				</Routes>
			</div>
		</UserContext.Provider>
	);
}

export default App;
