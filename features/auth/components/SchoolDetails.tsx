import React from "react";
import { Dropdown, TextField } from "@/components/UI";
import { Status } from "../types";
import { registerSchema } from "../validation";
import type { RegisterFormData } from "../validation";

const SCHOOL_TYPES = [
  { label: "Government", value: "PUBLIC" },
  { label: "Private", value: "PRIVATE" },
  { label: "Other", value: "OTHER" },
];

const BOARDS = [
  { label: "CBSE", value: "CBSE" },
  { label: "ICSE", value: "ICSE" },
  { label: "State Board", value: "STATE" },
  { label: "Other", value: "OTHER" },
];

const STATES = ["Gujarat", "Maharashtra", "Rajasthan", "Delhi", "Karnataka"];

type SchoolField = keyof typeof registerSchema.shape.school.shape;
type SchoolTextFields = "name" | "city" | "website" | "udiseNumber";

interface SchoolDetailsProps {
  schoolData: RegisterFormData["school"];
  errors: Partial<Record<SchoolField, string>>;
  status: Record<SchoolTextFields, Status>;
  onChange: (field: SchoolField, value: string) => void;
}

const SchoolDetails = ({
  schoolData,
  errors,
  status,
  onChange,
}: SchoolDetailsProps) => {
  return (
    <div className="grid grid-cols-1 gap-5">
      <TextField
        label="School Name"
        name="name"
        required
        placeholder="Enter school name"
        value={schoolData.name}
        onChange={(e) => onChange("name", e.target.value)}
        error={errors.name}
        color={status.name}
      />

      {/* Cleaned: color status removed from Dropdowns */}
      <Dropdown
        label="School Type"
        options={SCHOOL_TYPES}
        value={schoolData.type}
        onSelect={(_, value) => onChange("type", String(value))}
        error={errors.type}
        search
      />

      <Dropdown
        label="Board"
        options={BOARDS}
        value={schoolData.board}
        onSelect={(_, value) => onChange("board", String(value))}
        error={errors.board}
        search
      />

      <TextField
        label="City"
        name="city"
        required
        placeholder="Enter city"
        value={schoolData.city}
        onChange={(e) => onChange("city", e.target.value)}
        error={errors.city}
        color={status.city}
      />

      <Dropdown
        label="State"
        options={STATES.map((state) => ({ label: state, value: state }))}
        value={schoolData.state}
        onSelect={(_, value) => onChange("type", String(value))}
        error={errors.state}
        search
      />

      <TextField
        label="Website (Optional)"
        name="website"
        placeholder="https://example.com"
        value={schoolData.website}
        onChange={(e) => onChange("website", e.target.value)}
        error={errors.website}
        color={status.website}
      />

      <TextField
        label="UDISE Number"
        name="udiseNumber"
        required
        placeholder="Enter UDISE number"
        value={schoolData.udiseNumber}
        onChange={(e) => onChange("udiseNumber", e.target.value)}
        error={errors.udiseNumber}
        color={status.udiseNumber}
      />
    </div>
  );
};

export default SchoolDetails;
