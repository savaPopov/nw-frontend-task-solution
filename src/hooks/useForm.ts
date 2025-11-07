import { useState } from "react";

export function useForm<T extends Record<string, any>>(
    initialValues: T,
    submitCallback: (values: T) => Promise<void>,
) {
    const [values, setValues] = useState<T>(initialValues);


    const changeHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setValues(state => ({
            ...state,
            [e.target.name]: e.target.value
        }));
    };

    const submitHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        await submitCallback(values);
    };

    const setValue = (name: keyof T, value: any) => {
        setValues(state => ({
            ...state,
            [name]: value
        }));
    };

    return {
        values,
        changeHandler,
        submitHandler,
        setValue
    };
}