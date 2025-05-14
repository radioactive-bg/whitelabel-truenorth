import React from 'react';

const Footer = () => {
  return (
    <footer
      className="w-full py-4  text-xl text-white"
      style={{
        background:
          'linear-gradient(135deg, #FFD700 0%, #FF4500 50%, #000000 100%)',
      }}
    >
      <div className="flex justify-center">
        <p>© Powered By HKS™. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
