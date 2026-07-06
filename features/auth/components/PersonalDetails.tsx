import React from "react";
import { TextField } from "@/components/UI";
import { Status } from "@/types/ui";
import type { RegisterFormData } from "@/types/auth";

type PersonalDetailsFields = "fullName" | "email" | "password" | "phoneNumber";

interface PersonalDetailsProps {
  formData: RegisterFormData;
  errors: Partial<Record<PersonalDetailsFields, string>>;
  status: Record<PersonalDetailsFields, Status>;
  onChange: (field: PersonalDetailsFields, value: string) => void;
}

const PersonalDetails = ({
  formData,
  errors,
  status,
  onChange,
}: PersonalDetailsProps) => {
  return (
    <div className="grid grid-cols-1 gap-5">
      <TextField
        label="Full Name"
        type="text"
        name="fullName"
        required
        placeholder="Full Name"
        value={formData.fullName}
        onChange={(e) => onChange("fullName", e.target.value)}
        error={errors.fullName}
        color={status.fullName}
      />

      <TextField
        label="Email"
        type="email"
        name="email"
        required
        placeholder="Email Address"
        value={formData.email}
        onChange={(e) => onChange("email", e.target.value)}
        error={errors.email}
        color={status.email}
      />

      <TextField
        label="Password"
        type="password"
        name="password"
        required
        placeholder="Password"
        value={formData.password}
        onChange={(e) => onChange("password", e.target.value)}
        error={errors.password}
        color={status.password}
      />

      <TextField
        label="Phone Number"
        type="tel"
        name="phoneNumber"
        placeholder="Phone Number"
        value={formData.phoneNumber}
        onChange={(e) => onChange("phoneNumber", e.target.value)}
        error={errors.phoneNumber}
        color={status.phoneNumber}
      />
    </div>
  );
};

export default PersonalDetails;
