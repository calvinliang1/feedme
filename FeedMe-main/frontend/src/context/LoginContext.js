import React from 'react';

const LoginContext = React.createContext();

const useLoginContext = () => {
  const context = React.useContext(LoginContext);
  if (!context) {
    throw new Error('useLoginContext must be used within a LoginProvider');
  }
  return context;
};

const LoginProvider = (props) => {
  const existingAuthToken = localStorage.getItem('token');
  const [authToken, setAuthToken] = React.useState(existingAuthToken);

  return (
    <LoginContext.Provider
      value={{
        existingAuthToken,
        authToken,
        setAuthToken
      }}
      {...props}
    />
  );
};

export { LoginProvider, useLoginContext };