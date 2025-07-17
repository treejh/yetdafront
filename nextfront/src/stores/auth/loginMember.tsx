import { createContext, useContext, useState, use } from "react";
import { useRouter } from "next/navigation";

type User = {
  id: number;
  name: string;
  email: string;
  image: string;
  account: string;
  bank: string;
  introduce: string;
  portfolioAddress: string;
  ssoProvider: string;
  role: string;
  userActive: string;
};

export const LoginUserContext = createContext<{
  loginUser: User;
  setLoginUser: (user: User) => void;
  isLoginUserPending: boolean;
  isLogin: boolean;
  logout: (callback: () => void) => void;
  logoutAndHome: () => void;
}>({
  loginUser: createEmptyUser(),
  setLoginUser: () => {},
  isLoginUserPending: true,
  isLogin: false,
  logout: () => {},
  logoutAndHome: () => {},
});

function createEmptyUser(): User {
  return {
    id: 0,
    name: "",
    email: "",
    image: "",
    account: "",
    bank: "",
    introduce: "",
    portfolioAddress: "",
    ssoProvider: "",
    role: "",
    userActive: "",
  };
}

export function useLoginUser() {
  const router = useRouter();

  const [isLoginUserPending, setLoginUserPending] = useState(true);
  const [loginUser, _setLoginUser] = useState<User>(createEmptyUser());

  const removeLoginUser = () => {
    _setLoginUser(createEmptyUser());
    setLoginUserPending(false);
  };

  const setLoginUser = (user: User) => {
    _setLoginUser(user);
    setLoginUserPending(false);
  };

  const setNoLoginUser = () => {
    setLoginUserPending(false);
  };

  const isLogin = loginUser.id !== 0;

  const logout = (callback: () => void) => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/user/logout`, {
      method: "POST",
      credentials: "include",
    }).then(() => {
      removeLoginUser();
      callback();
    });
  };

  const logoutAndHome = () => {
    logout(() => router.replace("/"));
  };

  return {
    loginUser: loginUser,
    setLoginUser: setLoginUser,
    isLoginUserPending: isLoginUserPending,
    setNoLoginUser: setNoLoginUser,
    isLogin,

    logout,
    logoutAndHome,
  };
}

export function useGlobalLoginUser() {
  return useContext(LoginUserContext);
}
