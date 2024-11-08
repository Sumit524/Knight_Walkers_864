import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { AppDispatch } from "../app/store";
import { verify } from "../feature/auth/authActions";

const Activate: React.FC = () => {
    const [verified, setVerified] = useState<boolean>(false);

    const { uid, token } = useParams<{ uid: string; token: string; }>();
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();

    const verify_account = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (uid && token) {
            dispatch(verify({ uid, token }));
            setVerified(true);
        }
    }

    useEffect(() => {
        if (verified) {
            navigate('/');
        }
    }, [verified, navigate]);

    return (
        <div className="container mx-auto">
            <div className="flex flex-col justify-center items-center mt-48">
                <h1 className="text-2xl font-semibold">Verify your Account:</h1>
                <button
                    onClick={verify_account}
                    className="mt-12 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    type="button"
                >
                    Verify
                </button>
            </div>
        </div>

    );
}

export default Activate;