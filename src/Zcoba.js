import React, { useImperativeHandle, useRef } from "react";
import { render } from "react-dom";

// Main App component
const Age = React.forwardRef((props, ref) => {
    const ageInputRef = useRef();

    // focus the age input - will be called from outside i.e App.js
    const focusAgeInputField = () => {
        ageInputRef.current.focus();
    }

    const isAgeValid = () => {
        return !!ageInputRef.current.value;
    }

    useImperativeHandle(ref, () => {
        return {
            focus: focusAgeInputField,
            isValid: isAgeValid
        }
    })

    return (
        // React Fragment
        <>
            <label>Age </label>
            <input {...props} />
        </>
    );
});

export default Age