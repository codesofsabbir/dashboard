import { motion } from "framer-motion";
import { X } from "lucide-react"
import { useContext, useEffect, useState } from "react"
import { UserContext } from "../Hooks/UserContext"

function ProductDetailsView() {
    const {setProductModalOpen, productkey, products} = useContext(UserContext)
    const [filteredData, setFilteredData] = useState({})

    useEffect(() => {
        const findMatchData = products.find(product => product.id === productkey);
        setFilteredData(findMatchData);
    }, [productkey, products]);
    
    console.log(filteredData)
  return (
    <motion.div 
        className="fixed top-0 left-0 h-screen w-full bg-[rgba(0,0,0,0.7)] z-[1000]"
        initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ delay: 0.2 }}
    >
        <div className="productmodul w-3/5 h-5/6 absolute top-20 left-1/2 dark:bg-gray-800 bg-[#FFFFFF] bg-opacity-50 backdrop-blur-md overflow-hidden shadow-lg rounded-xl border border-gray-700 p-10 z-50">
        <div className="relative">
            <X className="absolute -right-5 -top-5 cursor-pointer" onClick={()=>{setProductModalOpen(false)}}/>
        </div>
        <div className="w-full h-full overflow-y-auto overflow-x-hidden no-scrollbar">
        <div className="flex flex-col items-center">
            <img src={filteredData.product_img} alt="" className="w-[550px]"/>
            <div className="flex justify-between w-full py-5">
                <h2 className="text-2xl font-mono text-gray-100">{filteredData.product_name}</h2>
                <span className="text-2xl font-mono text-gray-100">${filteredData.price}</span>
            </div>
            <p className="text-md font-sans text-justify text-gray-500">{filteredData.description}</p>
            <div className="flex gap-10 text-xl font-mono text-gray-100 py-5 w-full">
                <span>Stock: {Number(filteredData.total_product) - Number(filteredData.sale)}</span>
                <span>Sales: {filteredData.sale}</span>
            </div>
        </div>
        </div>
    </div>
    </motion.div>
  )
}

export default ProductDetailsView