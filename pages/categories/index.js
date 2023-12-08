// Importing necessary libraries and components
import { useEffect, useRef, useState } from "react"
import Layout from "../../components/Layout"
import axios from "axios"
import { RiEditLine, RiDeleteBin2Line, RiCheckFill, RiAddLine, RiArrowUpSLine } from "react-icons/ri"
import { AiOutlineEdit } from "react-icons/ai"
import { RxCross2 } from "react-icons/rx"
import { toast } from "react-hot-toast"
import { LoadingSpinner } from "../../components/Spinner"
import { useSpinner } from "../../context/SpinnerContext"
import Toggle from "../../components/Toggle"
import { MdSearch } from "react-icons/md"
import Pagination from "../../components/Pagination"
import { BiSortDown, BiSortUp } from "react-icons/bi"

/**
 * Categories component for managing product categories.
 *
 * @returns {JSX.Element} - Categories component.
 */
export default function Categories() {
    // State variables initialization
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
    const [searchToggle, setSearchToggle] = useState(false)
    const [searchText, setSearchText] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [sortDirection, setSortDirection] = useState('asc')
    const [sortColumn, setSortColumn] = useState('name')

    const { isLoading, showSpinner, hideSpinner } = useSpinner()
    const categoriesPerPage = 10
    const topRef = useRef(null)

    // Fetch categories on component mount
    useEffect(() => {
        showSpinner()
        fetchCategories()
    }, [])

    // Fetch categories from the server
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

    // Validate the form inputs
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

    // Validate the property inputs
    const validatePropery = () => {
        if (!isPropertyShowed) return
        const errors = {}
        const { name, values } = showedProperty

        if (!name) {
            errors.name = 'Add property name.'
        } else if (name.length < 3 || name.length > 100) {
            errors.name = 'Property name must be between 3 and 100 characters.'
        }

        if (!values) {
            errors.values = 'Add property values (comma separated).'
        } else if (values.length < 3 || values.length > 100) {
            errors.values = 'Property values must be between 3 and 100 characters.'
        }

        setFormErrors(errors)

        return Object.keys(errors).length === 0
    }

    // Clear property inputs
    const clearPorpertyInputs = () => {
        setShowedProperty({ name: '', values: '' })
        setShowedPropertyIndex(null)
    }

    // Clear all form data
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

    // Save category to server
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
                uniqueProperties.push(item)
            }
        })

        const data = {
            name,
            parentCategory: parentCategory !== '' ? parentCategory : null,
            properties: uniqueProperties?.map(item => {
                let valuesToUse = ''
                if (Array.isArray(item.values)) {
                    valuesToUse = item.values.join(',')
                } else if (item.values !== null && item.values !== undefined) {
                    valuesToUse = item.values.toString()
                }
                return {
                    name: item.name,
                    values: valuesToUse.split(',')
                }
            })
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

    // Edit a category
    const editCategory = async (category) => {
        setFormErrors({})
        setIsEditing(true)
        setIsClicked(true)
        setIsPropertyShowed(false)
        setEditedCategory(category)
        setName(category.name)
        setPerantCategory(category.parentCategory?._id || '')

        const mergedProperties = []

        if (category.parentCategory?._id) {
            const res = await axios.get(`/api/categories/?id=${category.parentCategory._id}`)
            const parentCategoryProperties = res?.data.properties || []

            // Check each property of the parent category
            parentCategoryProperties.forEach(parentProperty => {
                // Check if a property with the same name already exists
                const existingIndex = mergedProperties.findIndex(existingProperty => existingProperty.name === parentProperty.name)

                if (existingIndex !== -1) {
                    // If the property already exists, update its value
                    mergedProperties[existingIndex] = { ...parentProperty }
                } else {
                    // If the property doesn't exist yet, add it
                    mergedProperties.push(parentProperty)
                }
            })
        }

        // Add properties of the edited category
        if (category.properties) {
            category.properties.forEach(property => {
                // Check if a property with the same name already exists
                const existingIndex = mergedProperties.findIndex(existingProperty => existingProperty.name === property.name)

                if (existingIndex !== -1) {
                    // If the property already exists, update its value
                    mergedProperties[existingIndex] = { ...property }
                } else {
                    // If the property doesn't exist yet, add it
                    mergedProperties.push(property)
                }
            })
        }

        setProperties(mergedProperties.map(({ name, values }) => ({
            name,
            values: Array.isArray(values) ? values.join(',').trim() : values.trim()
        })))
    }

    // Delete a category
    const deleteCategory = async (_id) => {
        try {
            await axios.delete('/api/categories?_id=' + _id)
            toast.success('Category was successfully deleted!')

            const isLastOnPage = (categoriesToDisplay.length === 1)
            if (isLastOnPage && currentPage > 1) {
                setCurrentPage((prevPage) => prevPage - 1)
            }
            setCategories((prev) => prev.filter(category => category._id !== _id))
            setToggle(false)
        } catch (err) {
            toast.error('Oops, something went wrong: ', err)
        }
    }

    // Handle change of parent category
    const handleParentCategoryChange = (categoryId) => {
        setPerantCategory(categoryId)

        if (categoryId) {
            axios.get(`/api/categories/?id=${categoryId}`).then((res) => {
                editedCategory ? setProperties(res.data.properties || []) : setParentCategoryProperties(res.data.properties || [])
                setIsPropertyShowed(false)
            })
        } else {
            editedCategory ? setProperties([]) : setParentCategoryProperties([])
        }
    }

    // Handle change of property name
    const handlePropertyNameChange = (newName) => {
        setShowedProperty(prev => ({ ...prev, name: newName }))
    }

    // Handle change of property values
    const handlePropertyValuesChange = (newValues) => {
        setProperties(prevState => {
            const updatedProperties = [...prevState]
            if (showedPropertyIndex !== null) {
                updatedProperties[showedPropertyIndex] = { ...showedProperty, values: newValues }
            }
            return updatedProperties
        })
        setShowedProperty(prev => ({ ...prev, values: newValues }))
    }

    // Handle add property button click
    const handleAddProperty = () => (
        isPropertyShowed && !!showedProperty.name && !!showedProperty.values ?
            clearPorpertyInputs() :
            setIsPropertyShowed(prevState => !prevState)
    )

    // Add a property
    const addProperty = (property) => {
        const isValid = validatePropery()

        if (!isValid) {
            return
        }
        if (!!property.name && (property.values !== undefined && property.values !== null)) {
            const existingIndex = properties.findIndex(p => p.name === property.name)

            if (existingIndex !== -1) {
                setProperties(prevState => {
                    const updatedProperties = [...prevState]
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

    // Show property for editing
    const showProperty = (property, index) => {
        setIsPropertyShowed(true)
        setShowedProperty(property)
        setShowedPropertyIndex(index)
    }

    // Remove a property
    const removeProperty = (indexToRemove) => {
        setProperties(prevState => (
            [...prevState].filter((value, index) => index !== indexToRemove)
        ))
        setIsPropertyShowed(false)
        clearPorpertyInputs()
    }

    // Handle change of search text
    const handleSearchTextChange = (e) => {
        setSearchText(e.target.value)
        setCurrentPage(1)
    }

    // Filter categories based on search text
    const filteredCategories = categories.filter((category) => {
        const categoryName = category.name.toLowerCase()
        const search = searchText.toLowerCase()
        return categoryName.includes(search)
    })

    // Calculate the start and end index of categories to display
    const startIndex = (currentPage - 1) * categoriesPerPage
    const endIndex = startIndex + categoriesPerPage

    // Handle sorting of categories
    const handleSort = (column) => {
        if (column === sortColumn) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
        } else {
            setSortColumn(column)
            setSortDirection('asc')
        }
    }

    // Sort categories based on the selected column and direction
    const sortedCategories = [...filteredCategories].sort((a, b) => {
        const valueA = a[sortColumn]
        const valueB = b[sortColumn]

        if (sortDirection === 'asc') {
            return valueA > valueB ? 1 : -1
        } else {
            return valueA < valueB ? 1 : -1
        }
    })

    // Get the categories to display on the current page
    const categoriesToDisplay = sortedCategories.slice(startIndex, endIndex)
    const totalPages = Math.ceil(sortedCategories.length / categoriesPerPage)

    // Handle page change
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage)
    }

    // Scroll to the top of the page
    const scrollToTop = () => {
        if (topRef.current) {
            topRef.current.scrollIntoView({ behavior: "smooth", block: "end" })
        }
    }
    // Return JSX
    return (
        <Layout>
            <div className="flex row justify-between items-center">
                <div className="flex flex-row min-h-[34px]">
                    {
                        !isClicked ?
                            <button
                                type="button"
                                className={`btn-no-bg hover:bg-transparent btn-dark-text`}
                                onClick={() => {
                                    setIsEditing(true)
                                    setIsClicked(true)
                                }}>
                                <RiAddLine className="text-2xl" />
                            </button> :
                            <button
                                type="button"
                                className={`btn-no-bg hover:bg-transparent btn-dark-text`}
                                onClick={() => clearData()}
                            >
                                <RiArrowUpSLine className="text-2xl" />
                            </button>

                    }
                </div>
                <div className="flex flex-row-reverse gap-1">
                    <input
                        className={`leading-8 border-0 border-b outline-none focus-visible:border-b border-dark-text-color focus-visible:border-secondary-color hover:border-secondary-color placeholder:text-text-color focus-visible:placeholder:opacity-0 ${searchToggle ? 'search-visible sm-plus:w-full' : 'search-hidden'
                            }`}
                        type="text"
                        placeholder="Search..."
                        value={searchText}
                        onChange={handleSearchTextChange}
                        onBlur={() => !searchText && setSearchToggle(false)} />
                    <button
                        className={!searchToggle ? 'btn-no-bg btn-dark-text opacity-100' : 'opacity-0'}
                        onClick={() => setSearchToggle(true)
                        }><MdSearch className="text-2xl" /></button>
                </div>
            </div>
            {isEditing &&
                <div ref={topRef} id="top" className="flex flex-col gap-6">
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
                            <div className="flex flex-row gap-2 w-full flex-wrap">
                                <button type="button" className="rounded-sm py-2 my-2 text-sm" onClick={handleAddProperty}><RiAddLine />Add</button>
                                {
                                    properties?.length > 0 && properties.map((item, index) => (
                                        <button
                                            type="button"
                                            key={index}
                                            className={`py-2 my-2 text-sm ${categories.some(category => category._id === parentCategory && category.properties.some(property => property.name === item.name)) && 'opacity-70 hover:bg-secondary-color hover:cursor-default'}`}
                                            onClick={() => !categories.map(category => category._id === parentCategory && !category.properties.some(property => property.name === item.name) && showProperty(item, index))
                                            }
                                        >
                                            {item.name}
                                        </button>
                                    ))
                                }
                                {parentCategoryProperties?.map((property, index) => (
                                    <button
                                        type="button"
                                        key={index}
                                        className="py-2 my-2 text-sm opacity-70 hover:bg-secondary-color hover:cursor-default"
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
                                            className={`${formErrors.name ? "border border-danger-color" : ""}`}
                                        />
                                        {formErrors.name && <div className="flex self-start text-danger-color ">{formErrors.name}</div>}
                                    </div>
                                    <div className="flex flex-col w-full">
                                        <input type="text"
                                            value={showedProperty.values}
                                            onChange={e => handlePropertyValuesChange(e.target.value)}
                                            placeholder="Property value coma separated (example: black, white)"
                                            className={`${formErrors.values ? "border border-danger-color" : ""}`}
                                        />
                                        {formErrors.values && <div className="flex self-start text-danger-color ">{formErrors.values}</div>}
                                    </div>
                                    <div className="flex flex-col self-start md:self-center text-xl">
                                        <div className="flex flex-row gap-2">
                                            <button type="button"
                                                className="btn-success"
                                                onClick={() => addProperty(showedProperty)}>
                                                <RiCheckFill />
                                            </button>
                                            <button type="button"
                                                className="btn-danger"
                                                onClick={() => removeProperty(showedPropertyIndex)}>
                                                <RxCross2 />
                                            </button>
                                        </div>
                                        {(formErrors.name || formErrors.values) && <div className="hidden md:flex"><br /></div>}
                                    </div>
                                </div>
                            }
                        </div>
                        <div className="flex flex-row gap-1 text-white justify-end font-medium text-sm">
                            <button type="submit" className="btn-success">{editedCategory ? 'Save' : 'Add'}</button>
                            {editedCategory &&
                                <button type="button"
                                    className="btn-danger"
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
                        <th className="cursor-pointer" onClick={() => handleSort('name')}>
                            <div className="inline-flex items-center text-sm md:text-base">
                                Category name {sortColumn === "name" && sortDirection === "asc" ? <BiSortDown /> : <BiSortUp />}
                            </div>
                        </th>
                        <th>
                            <div className="inline-flex items-center text-sm md:text-base">Parent category</div>
                        </th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {categoriesToDisplay.length > 0 && categoriesToDisplay.map(item => (
                        <tr key={item._id}>
                            <td>{item.name}</td>
                            <td className="opacity-50 italic">{item?.parentCategory?.name}</td>
                            <td>
                                <div className="flex items-center justify-center md:justify-end w-full min-w-full gap-2">
                                    <button onClick={() => (scrollToTop(), editCategory(item))} className="btn-no-bg btn-dark-text hover:text-success-color">
                                        <RiEditLine size={18} />
                                    </button>
                                    <button onClick={() => (setdeletingCategoryId(item._id), setToggle(true))} className="btn-no-bg btn-dark-text hover:text-danger-color">
                                        <RiDeleteBin2Line size={18} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
                {!!toggle && <Toggle deleteItem={deleteCategory} setToggle={setToggle} itemId={deletingCategoryId} />}
            </table>
            {totalPages !== 1 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />}
        </Layout>
    )
}