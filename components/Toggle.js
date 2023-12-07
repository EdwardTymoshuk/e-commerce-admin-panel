export default function Toggle({deleteItem, setToggle, itemId}) {
    return (
        <div onClick={e => setToggle(false)} className="fixed bg-black/50 w-full h-full z-20 left-0 top-0">
            <div className="absolute bg-white text-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 md:p-12 rounded-lg flex flex-col items-center gap-6">
                <h2 className="text-xs sm:text-sm md:text-lg">
                    Are you sure you want to delete this item? 
                </h2>
                <h3 className="text-red-600 text-sm">
                    Pressing the delete button will permamently delete it.
                </h3>
                <button onClick={() => deleteItem(itemId)} className="btn-danger text-sm">Delete</button>
            </div>
        </div>
    )
}