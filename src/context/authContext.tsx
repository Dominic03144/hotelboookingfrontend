import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../app/store"; // ✅ adjust path
 // ✅ adjust path
import { setUser, clearUser } from "../features/auth/authSlice";
import { toast } from "react-toastify";

export interface AuthContextType {
  user: any; // your User type if you have one
  token: string | null;
  isLoggedIn: boolean;
  profileImageUrl: string | null;
  rehydrated: boolean;
  login: (token: string, profileImageUrl?: string) => void;
  logout: (callback?: () => void) => void;
  updateProfileImageUrl: (newUrl: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(
    localStorage.getItem("profileImageUrl") || null
  );

  const [rehydrated, setRehydrated] = useState(false);

  const isLoggedIn = !!token;

  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));

        const imgUrl =
          payload.profileImageUrl || localStorage.getItem("profileImageUrl");

        dispatch(
          setUser({
            userId: payload.userId,
            email: payload.email,
            role: payload.role,
            token: token,
            profileImageUrl: imgUrl || null,
          })
        );

        setProfileImageUrl(imgUrl || null);
      } catch (err) {
        console.error("❌ Invalid token:", err);
        dispatch(clearUser());
        setProfileImageUrl(null);
        localStorage.removeItem("token");
      }
    } else {
      dispatch(clearUser());
      setProfileImageUrl(null);
    }

    setRehydrated(true);
  }, [token, dispatch]);

  const login = (newToken: string, newProfileImageUrl?: string) => {
    if (!newToken) {
      console.error("❌ Tried to login with empty token");
      return;
    }

    setToken(newToken);
    localStorage.setItem("token", newToken);

    if (newProfileImageUrl) {
      setProfileImageUrl(newProfileImageUrl);
      localStorage.setItem("profileImageUrl", newProfileImageUrl);
    }

    try {
      const payload = JSON.parse(atob(newToken.split(".")[1]));

      dispatch(
        setUser({
          userId: payload.userId,
          email: payload.email,
          role: payload.role,
          token: newToken,
          profileImageUrl: newProfileImageUrl || null,
        })
      );
    } catch (err) {
      console.error("❌ Invalid token payload:", err);
    }
  };

  const logout = (callback?: () => void) => {
    setToken(null);
    setProfileImageUrl(null);
    localStorage.removeItem("token");
    localStorage.removeItem("profileImageUrl");
    dispatch(clearUser());
    toast.success("✅ Logged out");
    if (callback) callback();
  };

  const updateProfileImageUrl = (newUrl: string) => {
    setProfileImageUrl(newUrl);
    localStorage.setItem("profileImageUrl", newUrl);

    if (user) {
      dispatch(
        setUser({
          ...user,
          profileImageUrl: newUrl,
        })
      );
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoggedIn,
        profileImageUrl,
        login,
        logout,
        updateProfileImageUrl,
        rehydrated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
