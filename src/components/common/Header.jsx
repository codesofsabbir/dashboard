import { useState } from "react";
import { MdDarkMode } from "react-icons/md";
import { FaLightbulb } from "react-icons/fa";

const Header = ({ title }) => {
	const [dark, setdark] = useState(false);
	const body = document.getElementById('body')
	const handleDarkLight = () =>{
		setdark(!dark);
		body.classList.toggle('dark')
	}
	return (
		<header className='dark:bg-gray-800 bg-gray-100 dark:bg-opacity-50 backdrop-blur-md shadow-lg border-b border-gray-700'>

			<div className='max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8'>
				<div className=" flex justify-between items-center">
					<h1 className='text-2xl font-semibold dark:text-gray-100 text-gray-900'>{title}</h1>
					<i onClick={handleDarkLight} className="text-2xl cursor-pointer dark:text-gray-100 text-gray-900">
						{
							dark?<FaLightbulb />:<MdDarkMode />
						}
					</i>
				</div>
			</div>
		</header>
	);
};
export default Header;
