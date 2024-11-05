import { useState, useEffect } from "react";
import AuthForm from "./AuthForm";

interface AuthPageProps {
    initialMethod: 'login' | 'register'; // Restricting initialMethod to either 'login' or 'register'
}

const AuthPage: React.FC<AuthPageProps> = ({ initialMethod }) => {
    const [method, setMethod] = useState<'login' | 'register'>(initialMethod);

    useEffect(() => {
        setMethod(initialMethod);
    }, [initialMethod]);

    const route = method === 'login' ? '/api/token/' : '/api/user/register/';

    return (
        <div>
            <AuthForm route={route} method={method} />
        </div>
    );
};

export default AuthPage;
