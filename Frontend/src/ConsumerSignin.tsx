import React from "react";
import ConsumerSigninCard from "./components/ConsumerSigninCard";
import AuthLayout from "./components/AuthLayout";

const ConsumerSignin = () => {
    return (
        <AuthLayout
            title="Consumer Login"
            subtitle="Access your secure medication history"
        >
            <ConsumerSigninCard />
        </AuthLayout>
    );
};

export default ConsumerSignin;