// InfoBlock component represents a styled container for displaying information.
// It takes two props: className for additional styling and children for nested content.
const InfoBlock = ({ className, children }) => {
    return (
      // The outer container with flex layout, padding, rounded corners, and specific colors.
      <div className={`flex flex-col p-6 rounded-md bg-primary-color text-text-color h-full ${className}`}>
        {children}
      </div>
    )
  }
  export default InfoBlock
  