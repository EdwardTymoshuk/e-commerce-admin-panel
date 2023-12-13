const PageHeader = ({children}) => {
  return (
    <div className="flex">
      <h1 className="text-xl lg:text-2xl text-dark-text-color py-2 italic">{children}</h1>
    </div>
  )
}

export default PageHeader
