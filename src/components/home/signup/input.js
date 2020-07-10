/** @jsx jsx */
import { jsx } from 'theme-ui';

const Input = ({ type, name, handleChange, value, ariaLabel, placeholder }) => {
  return (
    <input
      sx={{
        border: '3px solid',
        borderColor: 'text',
        height: '2em',
        fontFamily: 'heading',
        padding: 2,
      }}
      placeholder={placeholder}
      aria-label={ariaLabel}
      value={value}
      type={type}
      name={name}
      onChange={handleChange}
    />
  );
};

export default Input;
