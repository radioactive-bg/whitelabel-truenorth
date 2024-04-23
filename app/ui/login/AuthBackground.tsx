const AuthBackground = () => {
  return (
    <div
      style={{
        position: 'absolute',
        filter: 'blur(0px)',
        zIndex: -1,
        top: 0,
        right: 0,
        transform: 'rotate(180deg)', // Adjust the rotation based on your layout requirements
      }}
    >
      <svg
        width="600"
        height="576"
        viewBox="0 0 600 576"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M599.576 575.21H450.982L216.416 340.169H142.969V234.2H216.416L451.407 0.00634766H600L304.511 287.608L599.576 575.21Z"
          fill="#EFFBFF"
        />
        <path
          d="M0 234.193H142.968L383.584 0H234.99L0 234.193Z"
          fill="#EFFBFF"
        />
      </svg>
    </div>
  );
};

export default AuthBackground;
