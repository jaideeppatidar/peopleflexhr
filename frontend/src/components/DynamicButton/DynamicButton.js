import React from 'react';
import './DynamicButton.css';
const DynamicButton = ({ text, onClick, height, width, color, backgroundColor, icon: IconComponent, link }) => {
  const buttonContent = (
    <>
      {IconComponent && <IconComponent className="icon" style={{ marginRight: '10px' }} />}
      <p style={{ color: color || '#ffffff' }}>{text}</p>
    </>
  );

  // If a link is provided, return an anchor tag; otherwise, return a div
  return link ? (
    <a
      href={link}
      rel="noopener noreferrer"
      style={{
        height: height || '40px',
        width: width || 'auto',
        backgroundColor: backgroundColor || '#007bff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        padding: '10px 20px',
        borderRadius: '5px',
        textDecoration: 'none', // Remove underline from link
        color: color || '#ffffff',
      }}
      className="dynamic-button"
    >
      {buttonContent}
    </a>
  ) : (
    <div
      className="dynamic-button"
      onClick={onClick}
      style={{
        height: height || '40px',
        width: width || 'auto',
        backgroundColor: backgroundColor || '#007bff',
        display: 'flex',
        alignItems: 'center',
        textAlign:'center',
        justifyContent: 'center',
        cursor: 'pointer',
        padding: '10px 20px',
        borderRadius: '5px',
        color: color,
      }}
    >
      {buttonContent}
    </div>
  );
};

export default DynamicButton;
