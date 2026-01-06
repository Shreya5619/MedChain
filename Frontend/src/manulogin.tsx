import React from "react";
import ManuCard from "./components/manulogincard";
import AuthLayout from "./components/AuthLayout";

const ManuLogin = () => {
  return (
    <AuthLayout
      title="Manufacturer Portal"
      subtitle="Register your facility to start tracking logistics securely."
    >
      <ManuCard />
    </AuthLayout>
  );
};

export default ManuLogin;
