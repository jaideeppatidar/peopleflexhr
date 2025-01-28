import React from 'react';
import './StatusBadge.css';  // Make sure the CSS file is imported

const StatusBadge = ({ status }) => {
  let statusClass = '';

  // Determine the appropriate class based on the status
  if (status === 'Approved') {
    statusClass = 'status-approved';
  } else if (status === 'Rejected') {
    statusClass = 'status-rejected';
  } else if (status === 'Pending') {
    statusClass = 'status-pending';
  }

  return (
    <div className={statusClass}>
      {status}
    </div>
  );
};

export default StatusBadge;
