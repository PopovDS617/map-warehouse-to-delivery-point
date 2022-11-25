import { createContext, useState } from 'react';

export const AppContext = createContext({
  coordList: { lng: 0, lat: 0 },
  setCoordList: () => {},
});

export const ContextProvider = (props) => {
  const [coordList, setCoordList] = useState({ lng: 0, lat: 0 });

  const contextValue = {
    coordList: coordList,
    setCoordList: setCoordList,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {props.children}
    </AppContext.Provider>
  );
};
