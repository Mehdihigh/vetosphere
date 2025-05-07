import AUTH from "../../config/authConfig.ts";

export const GetJwtToken = (): string | null => {
    const tokenString = localStorage.getItem(AUTH.TOKEN_KEY);
    return tokenString ? tokenString : null;
};

export const SaveJwtToken = (token:string) => {
    localStorage.setItem(AUTH.TOKEN_KEY, token);
    const now = new Date().getTime();
    localStorage.setItem(AUTH.LAST_ACTIVITY, now.toString());
};


export function DeleteJwtToken(){
    localStorage.removeItem(AUTH.TOKEN_KEY);
    window.location.reload();
}
