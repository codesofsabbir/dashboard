import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

function EditProduct() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [inputValue, setInputValue] = useState(""); // State for input
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

  // Fetch product by ID
  useEffect(() => {
    // Fetch product by ID
    axios.get(`http://localhost:5001/products/${id}`)
      .then((res) => {
        const fetchedProduct = res.data;
        setProduct(fetchedProduct);
        setSelectedCategories(fetchedProduct.category);
        setSelectedSubcategories(fetchedProduct.subcategory);
        setImagePreview(fetchedProduct.product_img);
  
        // Populate subcategories based on the product's existing categories
        const initialSubcategories = fetchedProduct.category.flatMap(categoryName => {
          const category = categories.find(cat => cat.name === categoryName);
          return category ? category.subcategories : [];
        });
  
        setSubcategories(initialSubcategories);
      })
      .catch((err) => console.error("Error fetching product:", err));
  }, [id, categories]);

  // Fetch categories for dropdown
  useEffect(() => {
    axios.get("http://localhost:5001/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  const handleImageClick = () => document.getElementById("file-input").click();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagInputChange = (e) => setInputValue(e.target.value);

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(inputValue.toLowerCase())
  );

  const handleTagSelect = (category) => {
    if (!selectedCategories.includes(category.name)) {
      setSelectedCategories((prev) => [...prev, category.name]);
  
      // Add new subcategories when a category is selected
      setSubcategories((prev) => [
        ...prev,
        ...category.subcategories.filter(sub => !prev.includes(sub))
      ]);
  
      setInputValue(""); // Clear input after selection
    }
  };
  const handleTagRemove = (category) => {
    setSelectedCategories((prev) => prev.filter((tag) => tag !== category));
  
    const removedCategory = categories.find((cat) => cat.name === category);
    if (removedCategory) {
      setSubcategories((prev) =>
        prev.filter((sub) => !removedCategory.subcategories.includes(sub))
      );
    }
  
    // Remove corresponding subcategories from the selected subcategories list
    setSelectedSubcategories((prev) =>
      prev.filter((sub) => !removedCategory.subcategories.includes(sub))
    );
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
    if (!imageFile) return product.product_img;

    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${imgbbAPIKey}`,
        formData
      );
      return response.data.data.url;
    } catch (error) {
      console.error("Image upload failed:", error);
      return product.product_img;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const imageUrl = await uploadImageToImgbb();

    const updatedProduct = {
      ...product,
      product_img: imageUrl,
      category: selectedCategories,
      subcategory: selectedSubcategories,
    };

    try {
      const response = await axios.put(
        `http://localhost:5001/products/${id}`,
        updatedProduct
      );

      if (response.status !== 200) {
        throw new Error("Failed to update product");
      }

      console.log("Product updated:", response.data);
      navigate("/products");
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Helmet>
        <link rel="icon" type="image/svg+xml" href={svgFavicon} />
        <title>Edit Product</title>
      </Helmet>
      <Header title="Edit Product" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <form
            onSubmit={handleSubmit}
            className="dark:bg-gray-800 bg-white bg-opacity-50 shadow-lg rounded-xl p-6 border border-gray-700"
          >
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold dark:text-gray-100 text-[#1e1e1e]">Edit Product</h2>
                <button onClick={() => navigate("/products")} className="border dark:border-white border-[#1e1e1e] rounded-md px-5 py-2 text-xs font-medium dark:text-gray-400 text-[#1e1e1e] uppercase">Back</button>
              </div>
            <div className="grid gap-5 sm:grid-cols-1 md:grid-cols-2 mb-8">
              
              <div className="flex flex-col gap-5">
                <div onClick={handleImageClick} className="cursor-pointer">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="h-[300px]" />
                  ) : (
                    <img
                      src="https://i.ibb.co/gvdp7Zf/upload.png"
                      alt="Upload"
                      className="h-[300px]"
                    />
                  )}
                </div>
                <input
                  type="file"
                  id="file-input"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <input
                  type="text"
                  name="product_name"
                  placeholder="Product Name"
                  value={product.product_name}
                  onChange={handleInputChange}
                  className="bg-gray-800 rounded-xl px-6 py-2 border border-gray-700"
                />
                <input
                  type="text"
                  name="price"
                  placeholder="Product Price"
                  value={product.price}
                  onChange={handleInputChange}
                  className="bg-gray-800 rounded-xl px-6 py-2 border border-gray-700"
                />
                <input
                  type="text"
                  name="total_product"
                  placeholder="Total Product"
                  value={product.total_product}
                  onChange={handleInputChange}
                  className="bg-gray-800 rounded-xl px-6 py-2 border border-gray-700"
                />
              </div>

              <div className="flex flex-col gap-5">
                <textarea
                  name="description"
                  placeholder="Product Description"
                  value={product.description}
                  onChange={handleInputChange}
                  className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg placeholder:text-gray-600 rounded-xl px-6 py-3 border border-gray-700 w-full h-[300px] resize-none outline-none"
                />
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Select categories..."
                    value={inputValue}
                    onChange={handleTagInputChange}
                    className="bg-gray-800 placeholder:text-gray-600 shadow-lg rounded-xl px-6 py-2 border border-gray-700 w-full mt-5"
                  />
                  <div className="flex flex-wrap gap-2 my-2">
                    {selectedCategories.map((tag) => (
                      <span
                        key={tag}
                        className="bg-gray-800 rounded-md border px-2 py-1 flex gap-3 items-center"
                      >
                        {tag}{" "}
                        <button
                          onClick={() => handleTagRemove(tag)}
                          className="text-red-500"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                  {inputValue && (
                    <div className="absolute bg-gray-900 border rounded-md w-full mt-1 z-20">
                      {filteredCategories.map((category) => (
                        <div
                          key={category.name}
                          className="p-2 cursor-pointer hover:bg-gray-700"
                          onClick={() => handleTagSelect(category)}
                        >
                          {category.name}
                        </div>
                      ))}
                    </div>
                  )}
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

            

            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg"
            >
              Update Product
            </button>
          </form>
        </motion.div>
      </main>
    </div>
  );
}

export default EditProduct;
