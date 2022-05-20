import * as React from 'react';

const SizeContext = React.createContext(undefined);

export const SizeContextProvider = ({ children, size }) => (
    <SizeContext.Consumer>
        {originSize => <SizeContext.Provider value={size || originSize}>{children}</SizeContext.Provider>}
    </SizeContext.Consumer>
);

export default SizeContext;
