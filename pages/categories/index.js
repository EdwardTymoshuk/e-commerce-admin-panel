import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import axios from "axios";
import { RiEditLine, RiDeleteBin2Line, RiCheckFill, RiAddLine, RiArrowUpSLine } from "react-icons/ri";
import { AiOutlineEdit } from "react-icons/ai";
import { RxCross2 } from "react-icons/rx";
import { toast } from "react-hot-toast";
import { LoadingSpinner } from "../../components/Spinner";
import { useSpinner } from "../../context/SpinnerContext";
import Toggle from "../../components/Toggle";


export default function Categories() {

    const [editedCategory, setEditedCategory] = useState(null)
    const [name, setName] = useState('')
    const [categories, setCategories] = useState([])
    const [parentCategory, setPerantCategory] = useState('')
    const [parentCategoryProperties, setParentCategoryProperties] = useState([])
    const [properties, setProperties] = useState([])
    const [isPropertyShowed, setIsPropertyShowed] = useState(false)
    const [showedProperty, setShowedProperty] = useState({})
    const [showedPropertyIndex, setShowedPropertyIndex] = useState(null)
    const [isEditing, setIsEditing] = useState(false)
    const [isClicked, setIsClicked] = useState(false)
    const [toggle, setToggle] = useState(false)
    const [deletingCategoryId, setdeletingCategoryId] = useState('')
    const [formErrors, setFormErrors] = useState({})

    const { isLoading, showSpinner, hideSpinner } = useSpinner()

    useEffect(() => {
        showSpinner()
        fetchCategories()
    }, [])

    const fetchCategories = () => {
        axios.get('/api/categories')
            .then(res => {
                setCategories(res.data)
            })
            .catch((error) => {
                console.error(error)
            })
            .finally(() => {
                hideSpinner()
            })
    }

    const validateForm = () => {
        const errors = {}
        if (!name) {
            errors.title = 'Product name is required.'
        } else if (name.length < 3 || name.length > 100) {
            errors.title = 'Product name must be between 3 and 100 characters.'
        }
        validatePropery()
        setFormErrors(errors)

        return Object.keys(errors).length === 0
    }

    const validatePropery = () => {
        if (!isPropertyShowed) return
        const errors = {}
        const {name, values} = showedProperty

        if (!name) {
            errors.name = 'Add property name.'
        } else if (name.length < 3 || name.length > 100) {
            errors.name = 'Porperty name must be between 3 and 100 characters.'
        } else Object.keys(errors).length === 0

        if (!values) {
            errors.values = 'Add property values (coma separated).'
        } else if (values.length < 3 || values.length > 100) {
            errors.values = 'Porperty values must be between 3 and 100 characters.'
        } else Object.keys(errors).length === 0

        setFormErrors(errors)

        return Object.keys(errors).length === 0
    }

    const clearPorpertyInputs = () => {
        setShowedProperty({ name: '', values: '' })
        setShowedPropertyIndex(null)
    }

    const clearData = () => {
        setEditedCategory(null)
        setName('')
        setPerantCategory('')
        setProperties([])
        setIsEditing(false)
        setIsClicked(false)
        setIsPropertyShowed(false)
        clearPorpertyInputs()
        setParentCategoryProperties([])
        setFormErrors({})
    }

    const saveCategory = async (e) => {
        e.preventDefault()
        const isFormValid = validateForm()

        if (!isFormValid) {
            return
        }

        const validProperties = properties.filter(item => item.name.trim() !== '' && item.values !== [])
        const uniqueProperties = []

        validProperties.forEach(item => {
            if (!uniqueProperties.some(existingProperty => existingProperty.name === item.name)) {
                uniqueProperties.push(item);
            }
        })

        const data = {
            name,
            parentCategory: parentCategory !== '' ? parentCategory : null,
            properties: uniqueProperties?.map(item => {
                let valuesToUse = '';
                if (Array.isArray(item.values)) {
                    valuesToUse = item.values.join(',');
                } else if (item.values !== null && item.values !== undefined) {
                    valuesToUse = item.values.toString();
                }
                return {
                name: item.name,
                values: valuesToUse.split(',')
            }})
        }

        if (editedCategory) {
            await axios.put('/api/categories', { ...data, _id: editedCategory._id })
            setEditedCategory(null)
        } else {
            await axios.post('/api/categories', data)
        }
        clearData()
        clearPorpertyInputs()

        editedCategory ? toast.success('Category was successfully edited!') : toast.success('New category was successfully added!')
        fetchCategories()
    }

    const editCategory = async (category) => {
        setFormErrors({})
        setIsEditing(true)
        setIsClicked(true)
        setIsPropertyShowed(false)
        setEditedCategory(category)
        setName(category.name)
        setPerantCategory(category.parentCategory?._id || '')
        
        console.log(properties)

        const mergedProperties = [];

        if (category.parentCategory?._id) {
            const res = await axios.get(`/api/categories/?id=${category.parentCategory._id}`)
            const parentCategoryProperties = res?.data.properties || []

        
            // Перевірте кожну властивість батьківської категорії
            parentCategoryProperties.forEach(parentProperty => {
                // Перевірте, чи вже існує властивість з такою ж назвою
                const existingIndex = mergedProperties.findIndex(existingProperty => existingProperty.name === parentProperty.name);
        
                if (existingIndex !== -1) {
                    // Якщо властивість вже існує, оновіть її значення
                    mergedProperties[existingIndex] = { ...parentProperty };
                } else {
                    // Якщо властивість ще не існує, додайте її
                    mergedProperties.push(parentProperty);
                }
            });
        }
        
        // Додайте властивості редагованої категорії
        if (category.properties) {
            category.properties.forEach(property => {
                // Перевірте, чи вже існує властивість з такою ж назвою
                const existingIndex = mergedProperties.findIndex(existingProperty => existingProperty.name === property.name);
        
                if (existingIndex !== -1) {
                    // Якщо властивість вже існує, оновіть її значення
                    mergedProperties[existingIndex] = { ...property };
                } else {
                    // Якщо властивість ще не існує, додайте її
                    mergedProperties.push(property);
                }
            });
        }
    
        setProperties(mergedProperties.map(({ name, values }) => ({
            name,
            values: Array.isArray(values) ? values.join(',').trim() : values.trim()
        })))
    }

    const deleteCategory = async (_id) => {
        try {
            await axios.delete('/api/categories?_id=' + _id)
            toast.success('Category was successfully deleted!')
            setCategories((prev) => prev.filter(category => category._id !== _id))
            setToggle(false)
        } catch (err) {
            toast.error('Oops, something went wrong: ', err)
        }
    }

    const handleParentCategoryChange = (categoryId) => {
        setPerantCategory(categoryId)
      
        if (categoryId) {
            axios.get(`/api/categories/?id=${categoryId}`).then((res) => {
            editedCategory ? setProperties(res.data.properties || []) : setParentCategoryProperties(res.data.properties || [])
            setIsPropertyShowed(false)
          });
        } else {
            editedCategory ? setProperties([]) : setParentCategoryProperties([]);
        }
      }

    const handlePropertyNameChange = (newName) => {
        setShowedProperty(prev => ({ ...prev, name: newName }))
    }
    const handlePropertyValuesChange = (newValues) => {
        console.log("Reload")
        setProperties(prevState => {
            const updatedProperties = [...prevState]
            if (showedPropertyIndex !== null) {
                updatedProperties[showedPropertyIndex] = { ...showedProperty, values: newValues }
            }
            return updatedProperties
        })
        setShowedProperty(prev => ({ ...prev, values: newValues }));
    }

    const handleAddProperty = () => (
        isPropertyShowed && !!showedProperty.name && !!showedProperty.values ?
        clearPorpertyInputs() :
        setIsPropertyShowed(prevState => !prevState)
    )

    const addProperty = (property) => {
        const isValid = validatePropery()

        if (!isValid) {
            return
        }
        if (!!property.name && (property.values !== undefined && property.values !== null)) {
            const existingIndex = properties.findIndex(p => p.name === property.name)
    
            if (existingIndex !== -1) {
                setProperties(prevState => {
                    const updatedProperties = [...prevState];
                    updatedProperties[existingIndex] = { ...updatedProperties[existingIndex], values: property.values }
                    return updatedProperties
                })
            } else {
                setProperties(prevState => [...prevState, { name: property.name, values: property.values }])
            }
    
            clearPorpertyInputs()
            setIsPropertyShowed(false)
        }
    }
    

    const showProperty = (property, index) => {
        setIsPropertyShowed(true)
        setShowedProperty(property)
        setShowedPropertyIndex(index)
    }

    const removeProperty = (indexToRemove) => {
        setProperties(prevState => (
            [...prevState].filter((value, index) => index !== indexToRemove)
        ))
        setIsPropertyShowed(false)
        clearPorpertyInputs()
    }

    return (
        <Layout>
            <div className="flex row justify-between items-center">
                <div className="flex flex-row min-h-[34px]">
                    {
                        !isClicked ?
                            <button
                                type="button"
                                className={`flex items-center w-fit gap-1 text-dark-text-color hover:text-secondary-color`}
                                onClick={() => {
                                    setIsEditing(true)
                                    setIsClicked(true)
                                }}>
                                <div className="transition-transform transform rotate-0 p-2 mb-2">
                                    <RiAddLine className="text-2xl" />
                                </div>
                            </button> :
                            <button
                                type="button"
                                className={`flex items-center w-fit gap-1 text-dark-text-color hover:text-secondary-color`}
                                onClick={() => clearData()}
                            >
                                <div className="transition-transform transform rotate-0 p-2 mb-2">
                                    <RiArrowUpSLine className="text-2xl" />
                                </div>
                            </button>

                    }
                </div>
                {/* <div className="flex flex-row-reverse gap-1">
          <input
            className={`leading-8 border-0 border-b outline-none focus-visible:border-b border-text-color focus-visible:border-secondary-color hover:border-secondary-color placeholder:text-text-color focus-visible:placeholder:opacity-0 ${searchToggle ? 'search-visible sm-plus:w-full' : 'search-hidden'
              }`}
            type="text"
            placeholder="Search..."
            value={searchText}
            onChange={handleSearchTextChange}
            onBlur={() => !searchText && setSearchToggle(false)} />
          <button
            className={!searchToggle ? 'opacity-100 transition-opacity duration-1000 hover:text-secondary-color hover:transition-colors' : 'opacity-0'}
            onClick={() => setSearchToggle(true)
            }><MdSearch className="text-2xl" /></button>
        </div> */}
            </div>
            {isEditing &&
                <div className="flex flex-col gap-6">
                    <h2 className="font-bold">{editedCategory ? "Edit category:" : "Add new category:"}</h2>
                    <form onSubmit={saveCategory} className="flex flex-col gap-2">
                        <label className="italic">Category:</label>
                        <div className="flex flex-col w-full">
                            <div className="flex flex-col md:flex-row gap-2">
                                {editedCategory ? <p className="flex text-2xl items-center text-success-color"><AiOutlineEdit /></p> : <p className="flex text-2xl items-center text-success-color"><RiAddLine /></p>}
                                <input
                                    type="text"
                                    className={`mb-0 w-full md:w-1/2 ${formErrors.title ? "border border-danger-color" : ""}`}
                                    placeholder="Category name"
                                    onChange={e => setName(e.target.value)}
                                    value={name} />
                                {formErrors.title && <div className="text-danger-color md:hidden">{formErrors.title}</div>}
                                <select className="mb-0 w-full md:w-1/2 h-10 md:h-auto" onChange={e => handleParentCategoryChange(e.target.value)} value={parentCategory}>
                                    <option value={''}>No category</option>
                                    {categories.length > 0 && categories.map(item => (
                                        <option value={item._id} key={item._id}>{item.name}</option>
                                    ))}
                                </select>
                            </div>
                            {formErrors.title && <div className="text-danger-color pl-[32px] hidden md:flex">{formErrors.title}</div>}
                        </div>
                        <div className="flex flex-col gap-2 justify-center">
                            <label className="italic">Properties:</label>
                            <div className="flex flex-row gap-2">
                                <button type="button" className="w-fit px-2 rounded-sm bg-secondary-color flex flex-row items-center" onClick={handleAddProperty}><RiAddLine />Add</button>
                                {
                                    properties?.length > 0 && properties.map((item, index) => (
                                        <button
                                            type="button"
                                            key={index}
                                            className="w-fit px-2 rounded-md bg-secondary-color flex flex-row items-center"
                                            onClick={() => showProperty(item, index)}
                                        >
                                            {item.name}
                                        </button>
                                    ))
                                }
                                {parentCategoryProperties?.map((property, index) => (
                                    <button
                                        type="button"
                                        key={index}
                                        className="w-fit px-2 rounded-md bg-secondary-color flex flex-row items-center"
                                        onClick={() => showProperty(property, index)}
                                    >
                                        {property.name}
                                    </button>
                                ))}
                            </div>
                            {
                                !!isPropertyShowed &&
                                <div className="flex flex-col md:flex-row gap-2">
                                    <div className="flex flex-col w-full">
                                    <input type="text"
                                        value={showedProperty.name}
                                        onChange={e => handlePropertyNameChange(e.target.value)}
                                        placeholder="Property name (example: color)"
                                        className={`${formErrors.name ? "border border-danger-color": ""}`}
                                    />
                                          {formErrors.name && <div className="flex self-start text-danger-color ">{formErrors.name}</div>}
                                          </div>
                                          <div className="flex flex-col w-full">
                                    <input type="text"
                                        value={showedProperty.values}
                                        onChange={e => handlePropertyValuesChange(e.target.value)}
                                        placeholder="Property value coma separated (example: black, white)" 
                                        className={`${formErrors.values ? "border border-danger-color": ""}`}
                                    />
                                          {formErrors.values && <div className="flex self-start text-danger-color ">{formErrors.values}</div>}
                                    </div>
                                    <div className="flex flex-col self-start md:self-center text-xl">
                                    <div className="flex flex-row">
                                    <button type="button" className="text-success-color hover:text-green-600" onClick={() => addProperty(showedProperty)}><RiCheckFill /></button>
                                    <button type="button" className="text-danger-color hover:text-red-600" onClick={() => removeProperty(showedPropertyIndex)}><RxCross2 /></button>
                                    </div>
                                    {(formErrors.name || formErrors.values) &&  <div className="hidden md:flex"><br /></div>}
                                    </div>
                                </div>
                            }
                        </div>
                        <div className="flex flex-row gap-1 text-white justify-end font-medium text-sm">
                            <button type="submit" className="bg-success-color hover:bg-secondary-color ease-in-out focus:ring-1 focus:outline-none focus:ring-secondary-color px-4 py-2.5">{editedCategory ? 'Save' : 'Add'}</button>
                            {editedCategory &&
                                <button type="button"
                                    className="bg-danger-color hover:bg-secondary-color ease-in-out focus:ring-1 focus:outline-none focus:ring-secondary-color px-4 py-2.5"
                                    onClick={() => clearData()}>Cancel</button>
                            }
                        </div>
                    </form>
                </div>
            }
            {isLoading && <LoadingSpinner />}
            <table className="basic mt-2">
                <thead>
                    <tr>
                        <th>Category name</th>
                        <th>Parent category</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {categories.length > 0 && categories.map(item => (
                        <tr key={item._id}>
                            <td>{item.name}</td>
                            <td className="opacity-50 italic">{item?.parentCategory?.name}</td>
                            <td>
                                <div className="flex items-center justify-center md:justify-end w-full min-w-full gap-5">
                                    <button onClick={() => editCategory(item)} className="hover:text-success-color transition-all duration-250">
                                        <RiEditLine size={18} />
                                    </button>
                                    <button className="px-2" onClick={() => (setdeletingCategoryId(item._id), setToggle(true))}>
                                        <RiDeleteBin2Line size={18} className="hover:text-danger-color transition-all duration-250" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
                {!!toggle && <Toggle deleteItem={deleteCategory} setToggle={setToggle} itemId={deletingCategoryId} />}
            </table>
        </Layout>
    )
}