import React from "react";
import ConsumerSignupCard from "./components/ConsumerSignupCard";
import AuthLayout from "./components/AuthLayout";

const ConsumerSignup = () => {
    return (
        <AuthLayout
            title="Consumer Access"
            subtitle="Verify your medication instantly. Trust what you take."
        >
            <ConsumerSignupCard />
        </AuthLayout>
    );
};

export default ConsumerSignup;