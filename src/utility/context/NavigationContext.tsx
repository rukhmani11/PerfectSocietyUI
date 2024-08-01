// NavigationContext.tsx
import React, { createContext, useContext, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROLES } from '../Config';
import { AuthContext } from './AuthContext';

interface NavigationContextProps {
    goToHome: () => void;
}

const NavigationContext = createContext<NavigationContextProps | undefined>(undefined);

interface NavigationProviderProps {
    children: ReactNode;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({ children }) => {
    const navigate = useNavigate();
    const { auth } = React.useContext(AuthContext);

    const goToHome = () => {
        if (auth && auth.Roles) {
            if (auth.Roles.some((x) => x === ROLES.Admin)) {
              navigate("/admin");
            } else if (auth.Roles.some((x) => x === ROLES.Subscriber || x === ROLES.Society || x == ROLES.ReadOnly)) {
              navigate("/mySociety");
            }
            // else if (auth.Roles.some((x) => x === ROLES.Society)) {
            //   navigate("/societySubscriptions/" + auth.SocietyId);
            // }
            else {
              navigate("/");
            }
          } else {
            navigate("/");
          }
    };

    return (
        <NavigationContext.Provider value={{ goToHome }}>
            {children}
        </NavigationContext.Provider>
    );
};

export const useSharedNavigation = (): NavigationContextProps => {
    const context = useContext(NavigationContext);
    if (!context) {
        throw new Error('useSharedNavigation must be used within a NavigationProvider');
    }
    return context;
};
