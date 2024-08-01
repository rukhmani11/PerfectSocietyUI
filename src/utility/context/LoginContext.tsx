import { Dispatch, SetStateAction, createContext, useEffect, useState } from "react"
import { AuthModel } from "../../models/UserModel";

//https://stackoverflow.com/questions/71889082/show-or-hide-component-if-user-is-logged-in-reactjs
interface ILoginContext {
    isAuth: boolean;
    token: string,
    setAuth1: Dispatch<SetStateAction<boolean>>;
}

const LoginContext = createContext<ILoginContext>({
    isAuth: false,
    token: "",
    setAuth1: () => { }
})

function LoginProvider(props: React.PropsWithChildren<{}>) {
    const [isAuth, setAuth1] = useState(localStorage.getItem("isAuth") == "true" ? true : false || false)
    const [token, setToken] = useState(localStorage.getItem("token") || "zxcz")
    useEffect(() => {
        localStorage.setItem("isAuth", isAuth == true ? "true" : "false")
    }, [isAuth])
    return (
        <LoginContext.Provider value={{ isAuth, token, setAuth1 }}>
            {props.children}
        </LoginContext.Provider>
    )
}
export { LoginContext, LoginProvider }



// const LoginProvider = ({ child }: any) => {
//     const [isAuth, setAuth1] = useState(localStorage.getItem("isAuth") || "false")
//     const [token, setToken] = useState(localStorage.getItem("token") || "")
//     useEffect(() => {
//         localStorage.setItem("isAuth", isAuth.toString())
//     }, [isAuth])
//     return (
//         <LoginContext.Provider value={{ isAuth, token, setAuth1 }}>
//             {child}
//         </LoginContext.Provider>
//     )
// }