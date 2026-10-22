import React from 'react';

export default function PhoneShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="phone-shell">
      <div className="dynamic-island">
        <div className="island-camera" />
        <div className="island-sensor" />
      </div>
      {children}
    </div>
  );
}
