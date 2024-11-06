import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/common/Header";
import { Helmet } from "react-helmet";
import ReactDOMServer from "react-dom/server";
import { ShoppingBag, X } from "lucide-react";
import axios from "axios";

const svgIcon = encodeURIComponent(
  ReactDOMServer.renderToStaticMarkup(<ShoppingBag stroke="#8B5CF6" />)
);
const svgFavicon = `data:image/svg+xml,${svgIcon}`;

const imgbbAPIKey = "bcebdff629edacb217cfd4cf4ac9ab39";

function AddProduct() {

  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [product, setProduct] = useState({
    product_img: "",
    product_name: "",
    price: "",
    total_product: "",
    description: "",
    category: [],
    subcategory: [],
    sale: 0,
  });
  const [imageFile, setImageFile] = useState(null);



  const handleImageClick = () => {
    document.getElementById("file-input").click();
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file)); // Set the preview URL directly
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    fetch('http://localhost:5001/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);


  const handleTagInputChange = (e) => {
    setInputValue(e.target.value);
  };
  const handleTagSelect = (category) => {
    if (!selectedCategories.includes(category.name)) {
      setSelectedCategories((prev) => [...prev, category.name]);
      setSubcategories((prev) => [
        ...prev,
        ...category.subcategories,
      ]);
      setInputValue(""); 
    }
  };
  
  console.log(selectedCategories)
  const handleTagRemove = (category) => {
    setSelectedCategories((prev) => prev.filter((tag) => tag !== category));

    const categoryToRemove = categories.find(cat => cat.name === category);
  
    if (categoryToRemove) {
      setSubcategories((prev) => 
        prev.filter(sub => !categoryToRemove.subcategories.includes(sub))
      );
    }
  
  };


  const handleSubcategorySelect = (subcategory) => {
    if (!selectedSubcategories.includes(subcategory.name)) {
      setSelectedSubcategories((prev) => [...prev, subcategory.name]);
    }
  };
  const handleSubcategoryRemove = (subcategory) => {
    setSelectedSubcategories((prev) =>
      prev.filter((item) => item !== subcategory)
    );
  };


  const uploadImageToImgbb = async () => {
    if (!imageFile) return null;

    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      const response = await axios.post(`https://api.imgbb.com/1/upload?key=${imgbbAPIKey}`, formData);
      return response.data.data.url; // Return the image URL
    } catch (error) {
      console.error("Image upload failed:", error);
      return null;
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const imageUrl = await uploadImageToImgbb();

    if (!imageUrl) {
      alert("Failed to upload image.");
      return;
    }

    const newProduct = { ...product, category: selectedCategories, subcategory: selectedSubcategories, product_img: imageUrl };

    try {
      const response = await fetch("http://localhost:5001/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduct),
      });

      if (!response.ok) {
        throw new Error("Failed to add product");
      }

      const data = await response.json();
      console.log("Product added:", data);
      navigate("/products");
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  // Filter categories based on input value
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Helmet>
        <link rel="icon" type="image/svg+xml" href={svgFavicon} />
        <title>Add New Product</title>
      </Helmet>
      <Header title="Add New Product" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <form onSubmit={handleSubmit} className="dark:bg-gray-800 bg-[#ffffff] bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8 w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold dark:text-gray-100 text-[#1e1e1e]">Add Product</h2>
              <button onClick={() => navigate("/products")} className="border dark:border-white border-[#1e1e1e] rounded-md px-5 py-2 text-xs font-medium dark:text-gray-400 text-[#1e1e1e] uppercase">Back</button>
            </div>

            <div className="grid gap-5 sm:grid-cols-1 md:grid-cols-2 mb-8">
              <div className="flex flex-col gap-5">
                <div>
                  <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl border border-gray-700 w-fit overflow-hidden cursor-pointer" onClick={handleImageClick}>
                    {imagePreview ? (
                      <img src={imagePreview} alt="Selected" className="h-[300px]" />
                    ) : (
                      <img src="https://i.ibb.co/gvdp7Zf/upload.png" alt="Upload" className="h-[300px]" />
                    )}
                  </div>
                  <input type="file" id="file-input" className="hidden" onChange={handleImageChange} />
                </div>
                <input
                  type="text"
                  name="product_name"
                  placeholder="Product Name"
                  value={product.product_name}
                  onChange={handleInputChange}
                  className="bg-gray-800 bg-opacity-50 placeholder:text-gray-600 backdrop-blur-md shadow-lg rounded-xl px-6 py-2 border border-gray-700 w-full outline-none"
                />
                <input
                  type="text"
                  name="price"
                  placeholder="Product Price"
                  value={product.price}
                  onChange={handleInputChange}
                  className="bg-gray-800 bg-opacity-50 placeholder:text-gray-600 shadow-lg rounded-xl px-6 py-2 border border-gray-700 w-full outline-none"
                />
                <input
                  type="text"
                  name="total_product"
                  placeholder="Total Product"
                  value={product.total_product}
                  onChange={handleInputChange}
                  className="bg-gray-800 bg-opacity-50 placeholder:text-gray-600 rounded-xl px-6 py-2 border border-gray-700 w-full outline-none"
                />
                
              </div>

              <div className="flex flex-col gap-5">
                

                {/* Tag input area */}
                <div className="flex flex-col">
                  <textarea
                    name="description"
                    placeholder="Product Description"
                    value={product.description}
                    onChange={handleInputChange}
                    className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg placeholder:text-gray-600 rounded-xl px-6 py-3 border border-gray-700 w-full h-[300px] resize-none outline-none"
                  ></textarea>
                  
                  <div className="relative">
                  <input
                    type="text"
                    placeholder="Select categories..."
                    value={inputValue}
                    onChange={handleTagInputChange}
                    className="bg-gray-800 bg-opacity-50 placeholder:text-gray-600 shadow-lg rounded-xl px-6 py-2 border border-gray-700 w-full outline-none mt-5"
                  />
                  <div className="flex flex-wrap gap-2 my-2">
                    {selectedCategories.map((tag) => (
                      <span key={tag} className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-md border border-gray-700 px-2 py-1 flex gap-3 items-center text-sm">
                        <span className=" uppercase">{tag}</span> 
                        <button onClick={() => handleTagRemove(tag)} className="text-red-500"><X size={12}/></button>
                      </span>
                    ))}
                  </div>
                  {inputValue && (
                    <div className="absolute dark:bg-gray-900 border border-gray-900 rounded-md max-h-60 overflow-y-auto z-10">
                      {filteredCategories.map((category) => (
                        <div
                          key={category.id}
                          className="px-4 py-2 hover:bg-gray-600 cursor-pointer"
                          onClick={() => handleTagSelect(category)}
                        >
                          {category.name}
                        </div>
                      ))}
                    </div>
                  )}
                  </div>
                </div>

                {selectedCategories.length > 0 && (
                  <div className="mb-4">
                    <select className="relative bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl border border-gray-700 px-5 py-2">
                      {subcategories.map((subcategory) => (
                        <option
                          value={subcategory.name}
                          key={subcategory._id}
                          onClick={() => handleSubcategorySelect(subcategory)}
                          className={"bg-opacity-50 dark:bg-gray-900 flex justify-between items-center cursor-pointer hover:bg-gray-700 px-4 py-2 bg-gray-800"}
                        >
                          <span>{subcategory.name}</span>
                        </option>
                      ))}
                    </select>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedSubcategories.map((sub) => (
                        <span key={sub} className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-md border border-gray-700 px-2 py-1 flex gap-3 items-center text-sm">
                          <span className=" uppercase">{sub}</span> 
                          <button onClick={() => handleSubcategoryRemove(sub)} className="text-red-500"><X size={12}/></button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                
              </div>
            </div>
            <button type="submit" className="bg-blue-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl px-6 py-2 border border-gray-700">Submit</button>
          </form>
        </motion.div>
      </main>
    </div>
  );
}

export default AddProduct;
