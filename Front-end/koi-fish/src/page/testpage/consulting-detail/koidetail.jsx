import React, { useState, useEffect } from "react";
import api from "../../../config/axios";
import { GiMetalBar } from "react-icons/gi";
import { Link, useParams } from "react-router-dom";
import { FaHeartCirclePlus } from "react-icons/fa6";
import { IoBookSharp } from "react-icons/io5";
import CardDetail from "../../../components/card-detail/carddetails";
import {  Tooltip } from "antd";
import {
  MdArrowBack,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdWater,
  MdLandscape,
  MdGrass,
  MdLocalFireDepartment,
} from "react-icons/md";
import Navbar from "../../../components/navbar/Navbar";
import "./animate.css";
import { set } from "lodash";
import { toast } from "react-toastify";

const koiDetails = () => {
  const colors = [
    { name: "Blue", hex: "#0000FF" },
    { name: "Black", hex: "#000000" },
    { name: "Red", hex: "#FF0000" },
    { name: "White", hex: "#FFFFFF" },
    { name: "Green", hex: "#006400" },
    { name: "Yellow", hex: "#FFD700" },
  ];
  const fitWithElements = [
    { name: "Metal", color: "#696969", icon: GiMetalBar },
    { name: "Wood", color: "#008000", icon: MdGrass },
    { name: "Water", color: "#0000FF", icon: MdWater },
    { name: "Fire", color: "#FF4500", icon: MdLocalFireDepartment },
    { name: "Earth", color: "#8B4513", icon: MdLandscape },
  ];

  const [koiDetail, setKoiDetail] = useState([]);
  const [loading, setLoading] = useState(true);
  const [relatedKoiLoading, setRelatedKoiLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1, // Current page
    pageSize: 3, // Default limit
    total: 0, // Initially 0
  });
  const { id } = useParams();
  const [datas, setDatas] = useState([]);
  const [selectedElement, setSelectedElement] = useState(); 
  const [selectIndex, setSelectIndex] = useState(null);  
  

  const style = {
    width: "300vw",
    height: "300vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const koiById = async () => {
    try {
      const response = await api.get(`v1/fish/getKoiById/${id}`);
      setKoiDetail(response.data); // Save the fetched object
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async () => {
    try {
      const response = await api.post(`v1/user/addToWishList?itemId=${id}&wishlistType=fishkois`);
  
      if (response.status === 400) {
        toast.info("Item already exists in your favorite list");
      } else if (response.status === 200) {
        toast.success("Item added to your favorite list successfully");
      } else {
        toast.warning("Unexpected response from server");
      }
    } catch (err) {
      console.error(err);
      if (err.response?.status === 400) {
        toast.info("Item already exists in your favorite list");
      } else {
        toast.error("Failed to add item to your favorite list");
      }
    }
  };
  

  useEffect(() => {
    setLoading(true);
    koiById();
  }, [id]);

  useEffect(() => {
    if (selectedElement) {
      // Only call related koi when pondetail.elementID is available
      relatedKoi(pagination.current, pagination.pageSize);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedElement, pagination.current, pagination.pageSize]);


   React.useEffect(() => {
     document.documentElement.scrollTop = document.documentElement.clientHeight;
     document.documentElement.scrollLeft = document.documentElement.clientWidth;
   }, []);

  const relatedKoi = async (
    page = pagination.current,
    limit = pagination.pageSize
  ) => {
    try {
    
      
    const  response = await api.get(
        `v1/fish/getKoiElement/${selectedElement}?page=${page}&limit=${limit}`
        );
      

      // Update state with fetched data
      setDatas(response.data.data);

      // Update pagination info
      setPagination((prev) => ({
        ...prev,
        current: response.data.currentPage,
        total: response.data.totalDocuments,
        pageSize: limit,
      }));
    } catch (err) {
      // Handle error
      console.error(err);
    } finally {
      setRelatedKoiLoading(false);
    }
  };

  // useEffect(() => {
  //   relatedKoi(pagination.current, pagination.pageSize);
  //   setRelatedKoiLoading(true);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [pagination.current, pagination.pageSize]);

  // Handle pagination change
  const handleTableChange = (page) => {
    setPagination((prev) => ({ ...prev, current: page }));
  };

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-100">
        <div className="flex justify-between items-center mb-8">
          <Link
            to="/consulting"
            className="text-red-600 flex items-center hover:text-red-500 hover:underline transition-colors"
          >
            <MdArrowBack className="mr-2" />
            Back To Consulting
          </Link>
        </div>

        {loading ? (
          // Display spinner while loading
          <div className="flex justify-center items-center h-64">
            <div className="spinner"></div>
          </div>
        ) : (
          <div className="animate-fadeIn bg-white p-8 rounded-lg shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <img
                src={koiDetail.image}
                alt="Koi fish"
                style={{ width: "450px", height: "700px" }}
                className=" object-cover rounded-lg "
              />
              <div>
                <div className="flex flex-col relative">
                  <h1 className="text-4xl font-bold mb-6 text-gray-800">
                    {koiDetail.koiName} Koi
                  </h1>
                  {/* select element button */}
                  <div className="element-container flex  ">
                 
                      <Tooltip title="please select element to view suitable koi " open={!selectedElement ? true : false }>
                        <div className="flex flex-row">
                          {koiDetail.elementID.map((element, index) => (
                            <span
                              onClick={() => {
                                setSelectedElement(element);
                                setSelectIndex(index);
                              }}
                              className={`cursor-pointer ml-2 mr-5 mb-5 flex p-2  hover:outline hover:outline-2 hover:shadow-lg hover:outline-red-600 rounded-lg transition-all ${
                                selectIndex === index
                                  ? "outline outline-2 outline-red-600 shadow-lg"
                                  : ""
                              }`}
                            >
                              {fitWithElements[element - 1]?.icon && (
                                <>
                                  {React.createElement(
                                    fitWithElements[element - 1].icon,
                                    {
                                      size: 40,
                                      style: {
                                        color:
                                          fitWithElements[element - 1].color,
                                      },
                                    }
                                  )}
                                  <span
                                    className=" cursor-pointer"
                                    style={{
                                      color: fitWithElements[element - 1].color,
                                      marginLeft: "8px",
                                      fontSize: "1.5rem",
                                    }}
                                  >
                                    {fitWithElements[element - 1].name}
                                  </span>
                                </>
                              )}
                            </span>
                          ))}
                        </div>
                      </Tooltip>
                    
                  </div>
                  <button
                    onClick={addToWishlist}
                    className="top-0 right-0  absolute ml-auto bg-red-600 text-white rounded-full p-2 hover:bg-red-500 transition-colors"
                  >
                    <FaHeartCirclePlus size={30} />
                  </button>
                </div>
                <div className="mb-6">
                  <div className="flex ">
                    <h3 className="text-2xl font-semibold text-gray-700">
                      Description
                    </h3>
                    <IoBookSharp size={24} className="ml-2 text-gray-700" />
                  </div>
                  <br />
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {koiDetail.description}
                  </p>

                  <h3 className="text-2xl font-semibold mb-3 text-gray-700">
                    Colors
                  </h3>
                  <div className="flex flex-wrap gap-4 mb-6">
                    {koiDetail.colors &&
                      Array.isArray(koiDetail.colors) &&
                      colors
                        .filter((color) =>
                          koiDetail.colors.includes(color.name)
                        )
                        .map((color, index) => (
                          <div
                            key={index}
                            className="flex items-center bg-gray-100 rounded-full px-3 py-1"
                          >
                            <div
                              className="w-6 h-6 rounded-full mr-2"
                              style={{ backgroundColor: color.hex }}
                            ></div>
                            <span className="text-gray-700">{color.name}</span>
                          </div>
                        ))}
                  </div>

                  <CardDetail elementID={selectedElement} />
                </div>
              </div>
            </div>
          </div>
        )}

        {relatedKoiLoading ? (
          // Display spinner while loading
          <div className="flex justify-center items-center h-64">
            <div className="spinner"></div>
          </div>
        ) : (
          <div className="mt-12">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">
              Related Kois
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {datas.map((koi, index) => (
                <Link
                  key={koi._id || index}
                  to={`/koidetail/${koi._id}`}
                  className="bg-white p-6 rounded-lg shadow-lg transition-transform hover:scale-105"
                >
                  <img
                    src={koi.image}
                    alt={`Image of ${koi.koiName}`}
                    className="w-full h-64 object-contain rounded-lg mb-4"
                  />
                  <h3 className="text-xl font-semibold mb-2 text-gray-700">
                    {koi.koiName}
                  </h3>
                  <p className="text-gray-600">
                    {koi.description.length > 70
                      ? `${koi.description.slice(0, 70)}...`
                      : koi.description}
                  </p>
                </Link>
              ))}
            </div>
            <div className="flex justify-center mt-8">
              <button
                onClick={() => handleTableChange(pagination.current - 1)}
                disabled={pagination.current === 1}
                className="mx-2 p-2 bg-red-600 text-white rounded-full disabled:opacity-50 hover:bg-red-500 transition-colors"
              >
                <MdKeyboardArrowLeft size={24} />
              </button>
              <span className="mx-4 text-lg font-semibold">
                Page {pagination.current} of{" "}
                {Math.ceil(pagination.total / pagination.pageSize)}
              </span>
              <button
                onClick={() => handleTableChange(pagination.current + 1)}
                disabled={
                  pagination.current ===
                  Math.ceil(pagination.total / pagination.pageSize)
                }
                className="mx-2 p-2 bg-red-600 text-white rounded-full disabled:opacity-50 hover:bg-red-500 transition-colors"
              >
                <MdKeyboardArrowRight size={24} />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default koiDetails;