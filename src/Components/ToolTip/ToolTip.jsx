import React from 'react';
import './ToolTip.css';
const Tooltip = React.memo(({ text, children, isOpen, response }) => {


    return <div className="tooltip-container">
        {children}
        <span className="tooltip-text">{text}</span>
    </div>
});
export default Tooltip;




