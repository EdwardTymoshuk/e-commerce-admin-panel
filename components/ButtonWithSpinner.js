import { CircleSpinner } from './Spinner'
/**
 * ButtonWithSpinner Component
 * @param {function} onClick - Click event handler
 * @param {boolean} isLoading - Loading state
 * @param {string} text - Button text
 * @param {JSX.Element} icon - Button icon
 * @param {string} size - Button size
 * @param {string} color - Button color
 * @param {...any} rest - Additional props
 * @returns {JSX.Element} - Rendered component
 */
const ButtonWithSpinner = ({ onClick, isLoading, text, icon, size, color, ...rest }) => {
  return (
    <button onClick={onClick} disabled={isLoading} {...rest}>
      {isLoading ? <CircleSpinner size={size} color={color} /> : icon} {isLoading ? '' : text}
    </button>
  )
}

export default ButtonWithSpinner // Export the component
