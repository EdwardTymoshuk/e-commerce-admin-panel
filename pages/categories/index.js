import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import axios from "axios";
import Link from "next/link";
import { RiEditLine, RiDeleteBin2Line, RiCheckFill, RiAddLine } from "react-icons/ri";
import { AiOutlineEdit } from "react-icons/ai";
import { RxCross2 } from "react-icons/rx";
import { toast } from "react-hot-toast";


export default function Categories() {
    const [editedCategory, setEditedCategory] = useState(null)
    const [deleteStatus, setDeleteStatus] = useState({});
    const [name, setName] = useState('')
    const [categories, setCategories] = useState([])
    const [parentCategory, setPerantCategory] = useState('')
    const [properties, setProperties] = useState([]);
    const [isEditing, setIsEditing] = useState(false)

    useEffect(() => {
        fetchCategories()
    }, [])
    const fetchCategories = () => {
        axios.get('/api/categories').then(res => {
            setCategories(res.data)
        })
    }
    const saveCategory = async (e) => {
        e.preventDefault()
        const data = { 
            name, 
            parentCategory: parentCategory !== '' ? parentCategory : null,
            properties: properties?.map(item => ({
                name: item.name,
                values: item.values.split(',')
            })) }
        if (name.trim().length === 0) return toast.error('Don`t leave the category field empty, type something.')
        if (editedCategory) {
            await axios.put('/api/categories', { ...data, _id: editedCategory._id })
            setEditedCategory(null)
        } else {
            await axios.post('/api/categories', data)
        }
        setName('')
        setPerantCategory('')
        setProperties([])
        editedCategory ? toast.success('The category was successfully edited!') : toast.success('New category was successfully added!')
        setIsEditing(false)
        fetchCategories()
    }

    const editCategory = async (category) => {
        setIsEditing(true)
        setEditedCategory(category)
        setName(category.name)
        setPerantCategory(category.parentCategory?._id || '')
        setProperties(category.properties?.map(({name, values}) => ({
            name,
            values: values.join(', ')
        })

        ))
    }

    const toggleDelete = (category) => {
        setDeleteStatus(prevState => ({
            ...prevState,
            [category._id]: !prevState[category._id] || false
        }));
    }

    const deleteCategory = async (category) => {
        await axios.delete('/api/categories?_id=' + category._id)
        fetchCategories()
    }

    const handlePropertyNameChange = (index, property, newName) => {
        setProperties(prevState => {
          if (prevState && prevState.length > index) {
            const updatedProperties = [...prevState];
            updatedProperties[index] = { ...property, name: newName };
            return updatedProperties;
          }
          return prevState;
        });
      };
      
      const handlePropertyValuesChange = (index, property, newValues) => {
        setProperties(prevState => {
          if (prevState && prevState.length > index) {
            const updatedProperties = [...prevState];
            updatedProperties[index] = { ...property, values: newValues };
            return updatedProperties;
          }
          return prevState;
        });
      };

      const addProperty = () => {
        setProperties(prevState => (
          (prevState || []).concat({ name: '', values: '' })
        ));
      };

    const removeProperty = (indexToRemove) => {
        setProperties(prevState => (
            [...prevState].filter((value, index) => index !== indexToRemove)
        ))

    }

    return (
        <Layout>
            {
                    <button 
                            type="button" 
                            className="flex items-center w-fit p-2 mb-2 gap-1 text-secondary-color hover:text-[#E2B43E]" 
                            onClick={() => {
                                editedCategory ? 
                                (setEditedCategory(false),
                                setName(''),
                                setPerantCategory(''),
                                setProperties([]))
                                :
                                setIsEditing(!isEditing)
                                }}>
                        <RiAddLine size="2em" />Add new category</button> 
            }


            {isEditing &&
                <form onSubmit={saveCategory} className="flex flex-col my-4 py-2 md:py-10">
                    <div className="flex flex-col md:flex-row gap-2 pb-4">
                        {editedCategory ? <p className="flex text-2xl items-center text-success-color"><AiOutlineEdit /></p> : <p className="flex text-2xl items-center text-success-color"><RiAddLine /></p>}
                        <input
                            type="text"
                            className="mb-0 w-full md:w-1/2"
                            placeholder="Category name"
                            onChange={e => setName(e.target.value)}
                            value={name} />
                        <select className="mb-0 w-full md:w-1/2 h-10 md:h-auto" onChange={e => setPerantCategory(e.target.value)} value={parentCategory}>
                            <option value={''}>No category</option>
                            {categories.length > 0 && categories.map(item => (
                                <option value={item._id} key={item._id}>{item.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col gap-2 justify-center pb-4">
                        <label>Properties:</label>
                        <button type="button" className="w-fit px-2 rounded-sm bg-secondary-color flex flex-row items-center" onClick={addProperty}><RiAddLine />Add</button>
                        {
                            properties?.length > 0 && properties.map((item, index) => (
                                <div className="flex flex-col md:flex-row gap-2 items-center" key={index}>
                                    <input type="text"
                                        value={item.name}
                                        onChange={e => handlePropertyNameChange(index, item, e.target.value)}
                                        placeholder="Property name (example: color)" />
                                    <input type="text"
                                        value={item.values}
                                        onChange={e => handlePropertyValuesChange(index, item, e.target.value)}
                                        placeholder="Property value coma separated (example: black, white)" />
                                    <button type="button" className="text-danger-color hover:text-red-600 cursor-pointer" onClick={() => removeProperty(index)}><RxCross2 /></button>
                                </div>
                            ))
                        }
                    </div>
                    <div className="flex flex-row gap-1 text-white justify-end font-medium text-sm">
                    <button type="submit" className="bg-success-color hover:bg-secondary-color ease-in-out focus:ring-1 focus:outline-none focus:ring-secondary-color px-4 py-2.5">{editedCategory ? 'Save' : 'Add'}</button>
                    {editedCategory && 
                    <button type="button" 
                            className="bg-danger-color hover:bg-secondary-color ease-in-out focus:ring-1 focus:outline-none focus:ring-secondary-color px-4 py-2.5"
                            onClick={() => {
                                setEditedCategory(null)
                                setName('')
                                setPerantCategory('')
                                setIsEditing(false)
                    }}>Cancel</button>
                    }
                    </div>
                </form>
            }
            <div className="flex flex-wrap gap-4 justify-between">
                {
                    categories.length > 0 && categories.map(item => (
                        <div key={item._id} className="flex flex-row lg:w-[31.75%] md:w-[48%] sm-plus:w-[48%] bg-white border border-gray-200  shadow dark:bg-gray-800 dark:border-gray-700">
                            <div className="w-1/2">
                                <a href="#">
                                    <img className="min-h-full" src={item.image || "astronaut.jpg"} alt="product image" />
                                </a>
                            </div>
                            <div className="px-5 flex flex-col min-w-[50%] justify-between items-center">
                                <div className="flex flex-col justify-center mt-2.5">
                                    <a href="#">
                                        <h5 className="lg:text-md text-center font-semibold tracking-tight text-secondary-color ">{item.name}</h5>
                                    </a>
                                    <h6 className="italic text-gray-600 lg:text-sm text-center">{item.parentCategory?.name}</h6>
                                </div>
                                <div className="flex items-center justify-between w-full gap-1">
                                    <button onClick={() => editCategory(item)} className="flex flex-row items-center text-white bg-success-color hover:bg-secondary-color ease-in-out focus:ring-1 focus:outline-none focus:ring-secondary-color font-medium text-sm px-4 py-2 text-center cursor-pointer">
                                        <AiOutlineEdit />
                                    </button>
                                    {
                                        !deleteStatus[item._id] ?
                                            <button onClick={() => toggleDelete(item)} className="flex flex-row items-center text-white bg-danger-color hover:bg-secondary-color ease-in-out focus:ring-1 focus:outline-none focus:ring-secondary-color font-medium text-sm px-4 py-2 text-center cursor-pointer">
                                                <RiDeleteBin2Line />
                                            </button> :
                                            <div className="flex flex-row gap-1">
                                                <button onClick={() => deleteCategory(item)} className="flex flex-row items-center text-success-color hover:text-green-500 ease-in-out focus:ring-1 focus:outline-none focus:ring-secondary-color font-medium text-xl md:text-lg px-2 md:px-0 text-center cursor-pointer">
                                                    <RiCheckFill />
                                                </button>
                                                <button onClick={() => toggleDelete(item)} className="flex flex-row items-center text-danger-color hover:text-red-500 ease-in-out focus:ring-1 focus:outline-none focus:ring-secondary-color font-medium text-xl md:text-lg px-2 md:px-0 text-center cursor-pointer">
                                                    <RxCross2 />
                                                </button>
                                            </div>
                                    }
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </Layout>
    )
}