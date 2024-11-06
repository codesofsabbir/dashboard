import { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

const userData = [
	{ id: 1, name: "Sabbir Ahmed", email: "ilrsabbir@gmail.com", phone: "01303142498", status: "Active" },
	{ id: 2, name: "Shahariyar Hasan", email: "im.hasan@gmail.com", phone: "01733739807", status: "Active" },
	{ id: 3, name: "Saidul Haque", email: "i87.saidul@gmail.com", phone: "01961244202", status: "Inactive" },
	{ id: 4, name: "Rupok", email: "rupok@gmail.com", phone: "01956364548", status: "Active" },
	{ id: 5, name: "Akash", email: "akash@gmail.com", phone: "01300305439", status: "Active" },
];

const UsersTable = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredUsers, setFilteredUsers] = useState(userData);

	const handleSearch = (e) => {
		const term = e.target.value.toLowerCase();
		setSearchTerm(term);
		const filtered = userData.filter(
			(user) => user.name.toLowerCase().includes(term) || user.email.toLowerCase().includes(term)
		);
		setFilteredUsers(filtered);
	};

	return (
		<motion.div
			className='dark:bg-gray-800 bg-white bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
		>
			<div className='flex justify-between items-center mb-6'>
				<h2 className='text-xl font-semibold dark:text-gray-100 text-[#1E1E1E]'>Users</h2>
				<div className='relative'>
					<input
						type='text'
						placeholder='Search users...'
						className='dark:bg-gray-700 bg-gray-400 dark:text-white text-[#1E1E1E] dark:placeholder-gray-400 placeholder:text-gray-600 outline-none rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
						value={searchTerm}
						onChange={handleSearch}
					/>
					<Search className='absolute left-3 top-2.5 dark:text-gray-400 text-[#1E1E1E]' size={18} />
				</div>
			</div>

			<div className='overflow-x-auto'>
				<table className='min-w-full divide-y divide-gray-700'>
					<thead>
						<tr>
							<th className='px-6 py-3 text-left text-xs font-medium dark:text-gray-400 text-[#1E1E1E] uppercase tracking-wider'>
								Name
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium dark:text-gray-400 text-[#1E1E1E] uppercase tracking-wider'>
								Email
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium dark:text-gray-400 text-[#1E1E1E] uppercase tracking-wider'>
								Phone
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium dark:text-gray-400 text-[#1E1E1E] uppercase tracking-wider'>
								Status
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium dark:text-gray-400 text-[#1E1E1E] uppercase tracking-wider'>
								Actions
							</th>
						</tr>
					</thead>

					<tbody className='divide-y divide-gray-700'>
						{filteredUsers.map((user) => (
							<motion.tr
								key={user.id}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.3 }}
							>
								<td className='px-6 py-4 whitespace-nowrap'>
									<div className='flex items-center'>
										<div className='flex-shrink-0 h-10 w-10'>
											<div className='h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center dark:text-white text-[#1E1E1E] font-semibold'>
												{user.name.charAt(0)}
											</div>
										</div>
										<div className='ml-4'>
											<div className='text-sm font-medium dark:text-gray-100 text-[#1E1E1E]'>{user.name}</div>
										</div>
									</div>
								</td>

								<td className='px-6 py-4 whitespace-nowrap'>
									<div className='text-sm dark:text-gray-300 text-[#1E1E1E]'>{user.email}</div>
								</td>
								<td className='px-6 py-4 whitespace-nowrap'>
									<span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full dark:text-blue-100 text-[#1E1E1E]'>
										{user.phone}
									</span>
								</td>

								<td className='px-6 py-4 whitespace-nowrap'>
									<span
										className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
											user.status === "Active"
												? "bg-green-800 dark:text-green-100"
												: "bg-red-800 dark:text-red-100"
										}`}
									>
										{user.status}
									</span>
								</td>

								<td className='px-6 py-4 whitespace-nowrap text-sm dark:text-gray-300'>
									<button className='text-indigo-400 hover:text-indigo-300 mr-2'>View</button>
									<button className='text-red-400 hover:text-red-300'>Delete</button>
								</td>
							</motion.tr>
						))}
					</tbody>
				</table>
			</div>
		</motion.div>
	);
};
export default UsersTable;
