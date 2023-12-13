// InfoBlocksWraper component is a wrapper for arranging multiple InfoBlock components.
const InfoBlocksWraper = ({ children }) => {
  return (
    // The outer container with flex layout, centered items, a specified gap, and full width.
    <div className="flex flex-row items-center gap-4 w-full">
      {children}
    </div>
  )
}

export default InfoBlocksWraper