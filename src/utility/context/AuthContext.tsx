import { Dispatch, SetStateAction, createContext, useContext, useEffect, useState } from "react";
import { AuthModel, UserModel } from "../../models/UserModel";

//https://stackoverflow.com/questions/71889082/show-or-hide-component-if-user-is-logged-in-reactjs
interface IAuthContext {
    auth: AuthModel;
    setAuth: Dispatch<SetStateAction<AuthModel>>;
}

export const initialFieldValues: AuthModel = {
    Token: "",
    UserId: "",
    UserName: "",
    Roles: [],
    FullName: "",
    SocietyId: ""
};

const AuthContext = createContext<IAuthContext>({
    auth: initialFieldValues,
    setAuth: () => { }
})

function AuthProvider(props: React.PropsWithChildren<{}>) {
    let currentUser: AuthModel = JSON.parse(localStorage.getItem("currentUser") || '{}');
    const [auth, setAuth] = useState<AuthModel>(currentUser || initialFieldValues);
    useEffect(() => {
        localStorage.setItem("currentUser", JSON.stringify(auth))
    }, [auth])
    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {props.children}
        </AuthContext.Provider>
    )
}
export { AuthContext, AuthProvider }







