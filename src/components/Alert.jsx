import React from 'react';

function Alert(props) {
    const capitalize = (word) => {
        if (word === "danger") word = "error";
        const lower = word.toLowerCase();
        return lower.charAt(0).toUpperCase() + lower.slice(1);
    }

    const alertStyles = {
        success: 'bg-green-100 border border-green-400 text-green-700',
        danger: 'bg-red-100 border border-red-400 text-red-700',
        info: 'bg-blue-100 border border-blue-400 text-blue-700',
        warning: 'bg-yellow-100 border border-yellow-400 text-yellow-700',
    };

    const alertType = props.alert ? alertStyles[props.alert.type] || '' : '';

    return (
        <div style={{ height: '50px' }} className='z-30'>
            {props.alert && (
                <div className={`relative p-4 mb-4 border-l-4 rounded ${alertType}`} role="alert">
                    <strong className="font-bold">{capitalize(props.alert.type)}</strong>: {props.alert.msg}
                </div>
            )}
        </div>
    );
}

export default Alert;
