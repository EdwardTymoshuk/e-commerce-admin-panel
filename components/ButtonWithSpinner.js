import { CircleSpinner } from "./Spinner";

export const ButtonWithSpinner = ({ onClick, isLoading, text, icon, size, color, ...rest }) => {
    return (
      <button onClick={onClick} disabled={isLoading} {...rest}>
        {isLoading ? <CircleSpinner size={size} color={color}/> : icon} {isLoading ? '' : text}
      </button>
    );
  }