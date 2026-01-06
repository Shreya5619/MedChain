import React from "react";
import InterCard from "./components/interlogin";
import AuthLayout from "./components/AuthLayout";

const InterLogin = () => {
  return (
    <AuthLayout
      title="Intermediary Portal"
      subtitle="Connect supply chains. Verify authenticity. Ensure safety."
    >
      <InterCard />
    </AuthLayout>
  );
};

export default InterLogin;
