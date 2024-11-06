import { motion } from "framer-motion";
import { Edit, Search, Trash2, Eye, Plus } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../Hooks/UserContext";



const ProductsTable = () => {
	const {setProductModalOpen, setProductKey, products, setProducts} = useContext(UserContext);
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredProducts, setFilteredProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const navigate = useNavigate();

	// Fetch products from API on mount
	useEffect(() => {
		fetch("http://localhost:5001/products")
			.then((res) => {
				if (!res.ok) throw new Error("Failed to fetch products");
				return res.json();
			})
			.then((data) => {
				setProducts(data);
				setFilteredProducts(data);
			})
			.catch((error) => setError(error.message))
			.finally(() => setLoading(false));
	}, [setProducts]);

	useEffect(() => {
        const filtered = products.filter((product) => 
            product.product_name.toLowerCase().includes(searchTerm) || 
            product.category.some(cat => cat.toLowerCase().includes(searchTerm)) // If category is an array
        );
        setFilteredProducts(filtered);
    }, [searchTerm, products]);

	const handleDelete = (id) => {
		if (window.confirm("Are you sure you want to delete this product?")) {
			// Make DELETE request or handle removal logic
			setProducts(products.filter((p) => p.id !== id));
			setFilteredProducts(filteredProducts.filter((p) => p.id !== id));
		}
	};

	return (
		<motion.div
			className="dark:bg-gray-800 bg-white bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
		>
			<div className="flex justify-between items-center mb-6">
				<h2 className="text-xl font-semibold dark:text-gray-100 text-[#1E1E1E]">
					Product List
				</h2>
				<div className="flex gap-5">
					<button
						className="flex gap-3 items-center border dark:border-white border-[#1e1e1e] rounded-md px-5 py-2 text-left text-xs font-medium dark:text-gray-400 text-[#1e1e1e] uppercase tracking-wider"
						onClick={() => navigate("/add-product")}
					>
						<Plus color="#10B981" size={18} /> ADD
					</button>
					<div className="relative">
						<input
							type="text"
							placeholder="Search products..."
							className="dark:bg-gray-700 outline-none bg-gray-400 text-[#1E1E1E] dark:text-white dark:placeholder-gray-400 placeholder:text-gray-500 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
							onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
							value={searchTerm}
						/>
						<Search
							className="absolute left-3 top-2.5 dark:text-gray-400 text-[#1E1E1E]"
							size={18}
						/>
					</div>
				</div>
			</div>

			{loading ? (
				<p className="text-center py-4 dark:text-gray-300 text-[#1e1e1e]">
					Loading products...
				</p>
			) : error ? (
				<p className="text-center py-4 dark:text-red-400 text-red-600">
					{error}
				</p>
			) : (
				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-700">
						<thead>
							<tr>
								{["Name", "Category", "Sub Category", "Price", "Stock", "Sales", "Actions"].map(
									(header) => (
										<th
											key={header}
											className="px-6 py-3 text-left text-xs font-medium dark:text-gray-400 text-[#1e1e1e] uppercase tracking-wider"
										>
											{header}
										</th>
									)
								)}
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-700">
								{
									filteredProducts?.map((product)=>(
										<motion.tr 
											key={product.id} 
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											transition={{ duration: 0.3 }}
										>
											<td className="px-6 py-4 whitespace-normal text-sm font-medium dark:text-gray-100 text-[#1E1E1E] flex gap-2 items-center">
												<img src={product.product_img} alt="" className="w-10 h-10 rounded-full" />
												<p className="break-words">{product.product_name}</p>
											</td>

											<td className="px-6 py-4 whitespace-nowrap text-sm dark:text-gray-300 text-[#1e1e1e]">
												<ul>
													{product.category.map((cat, index) => (
														<li key={index} className=" capitalize">{cat}</li>
													))}
												</ul>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm dark:text-gray-300 text-[#1e1e1e]">
												<ul>
													{product.subcategory.map((cat, index) => (
														<li key={index} className=" capitalize">{cat}</li>
													))}
												</ul>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm dark:text-gray-300 text-[#1e1e1e]">
												${product.price}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm dark:text-gray-300 text-[#1e1e1e]">
												{Number(product.total_product) - Number(product.sale)}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm dark:text-gray-300 text-[#1e1e1e]">
												{product.sale}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm dark:text-gray-300 text-[#1e1e1e]">
											<button
												className="text-indigo-400 hover:text-indigo-300 mr-2"
												onClick={() => navigate(`/edit-product/${product.id}`)}
											>
												<Edit size={18} />
											</button>
												<button
													className="text-red-400 hover:text-red-300 mr-2"
													onClick={() => handleDelete(product.id)}
												>
													<Trash2 size={18} />
												</button>
												<button>
													<Eye size={18} color="#10B981" onClick={()=>{
														setProductModalOpen(true);
														setProductKey(product.id)
													}}/>
												</button>
											</td>
										</motion.tr>
									))
								}
						</tbody>
						
					</table>
				</div>
			)}
		</motion.div>
	);
};

export default ProductsTable;
