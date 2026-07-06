"use client";

import Header from "@/components/Base/Header/Header";
import { Button, Dropdown, TextField } from "@/components/UI";
import { Status } from "@/types/ui";
import type { PortalType } from "@/types/organzation";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAddMember } from "@/hooks/organization/member";
import { useGetRolesByPortal } from "@/hooks/organization/roles"; // adjust import path
import { addMemberSchema } from "../validation"; // you'll need to create this

const PORTAL_TYPE_OPTIONS = ["STAFF", "TEACHER", "STUDENT"] as const;
type RoleType = string;

const AddMember = () => {
  const router = useRouter();

  const [formData, setFormData] = useState<{
    fullName: string;
    email: string;
    password: string;
    phoneNumber: string;
    portalType: PortalType | "";
    roleName: RoleType | "";
  }>({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    portalType: "",
    roleName: "",
  });

  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    phoneNumber?: string;
    portalType?: string;
    roleName?: string;
  }>({});

  const [status, setStatus] = useState<{
    fullName: Status;
    email: Status;
    password: Status;
    phoneNumber: Status;
    portalType: Status;
    roleName: Status;
  }>({
    fullName: "info",
    email: "info",
    password: "info",
    phoneNumber: "info",
    portalType: "info",
    roleName: "info",
  });

  const { data: rolesData } = useGetRolesByPortal(formData.portalType || null);

  const addMemberMutation = useAddMember(
    (backendErrors: Record<string, string>) => {
      setErrors(backendErrors);
      setStatus({
        fullName: backendErrors?.fullName ? "error" : "success",
        email: backendErrors?.email ? "error" : "success",
        password: backendErrors?.password ? "error" : "success",
        phoneNumber: backendErrors?.phoneNumber ? "error" : "success",
        portalType: backendErrors?.portalType ? "error" : "success",
        roleName: backendErrors?.roleName ? "error" : "success",
      });
    },
  );

  const validateField = (field: keyof typeof errors, value: string) => {
    const result = addMemberSchema.shape[field].safeParse(value);
    if (!result.success) {
      setErrors((prev) => ({
        ...prev,
        [field]: result.error.issues[0].message,
      }));
      setStatus((prev) => ({ ...prev, [field]: "error" }));
    } else {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
      setStatus((prev) => ({ ...prev, [field]: value ? "success" : "info" }));
    }
  };

  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, fullName: value }));
    validateField("fullName", value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, email: value }));
    validateField("email", value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, password: value }));
    validateField("password", value);
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, phoneNumber: value }));
    validateField("phoneNumber", value);
  };

  const handlePortalTypeSelect = (
    e: React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLDivElement>,
    value: string | number | (string | number)[],
  ) => {
    const portalType = String(
      Array.isArray(value) ? value[0] : value,
    ) as PortalType;
    setFormData((prev) => ({ ...prev, portalType, roleName: "" })); // reset role on portal change
    validateField("portalType", portalType);
  };

  const handleRoleNameSelect = (
    e: React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLDivElement>,
    value: string | number | (string | number)[],
  ) => {
    const roleName = String(Array.isArray(value) ? value[0] : value);
    setFormData((prev) => ({ ...prev, roleName }));
    validateField("roleName", roleName);
  };

  const onSubmit = async () => {
    const result = addMemberSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof typeof errors;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      });

      setErrors(fieldErrors);
      setStatus((prev) => ({
        ...prev,
        fullName: fieldErrors.fullName ? "error" : prev.fullName,
        email: fieldErrors.email ? "error" : prev.email,
        password: fieldErrors.password ? "error" : prev.password,
        phoneNumber: fieldErrors.phoneNumber ? "error" : prev.phoneNumber,
        portalType: fieldErrors.portalType ? "error" : prev.portalType,
        roleName: fieldErrors.roleName ? "error" : prev.roleName,
      }));
      return;
    }

    setErrors({});

    try {
      await addMemberMutation.mutateAsync(formData);
      router.back();
    } catch (error) {}
  };

  const roleOptions = rolesData?.data ?? [];

  const handleCancle = () => {
    router.back();
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <Header header="Add Member" />
      </div>

      <div className="px-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
        <TextField
          label="Full Name"
          type="text"
          name="fullName"
          required
          maxLength={100}
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleFullNameChange}
          color={errors.fullName ? "error" : status.fullName}
          error={errors.fullName || ""}
        />

        <TextField
          label="Email"
          type="email"
          name="email"
          required
          placeholder="Email"
          value={formData.email}
          onChange={handleEmailChange}
          color={errors.email ? "error" : status.email}
          error={errors.email || ""}
        />

        <TextField
          label="Password"
          type="password"
          name="password"
          required
          placeholder="Password"
          value={formData.password}
          onChange={handlePasswordChange}
          color={errors.password ? "error" : status.password}
          error={errors.password || ""}
        />

        <TextField
          label="Phone Number"
          type="text"
          name="phoneNumber"
          placeholder="Phone Number"
          value={formData.phoneNumber}
          onChange={handlePhoneNumberChange}
          color={errors.phoneNumber ? "error" : status.phoneNumber}
          error={errors.phoneNumber || ""}
        />

        <Dropdown
          label="Portal Type"
          options={PORTAL_TYPE_OPTIONS.map((type) => ({
            label: type,
            value: type,
          }))}
          value={formData.portalType}
          onSelect={handlePortalTypeSelect}
          error={errors.portalType}
        />

        <Dropdown
          label="Role"
          options={roleOptions}
          value={formData.roleName}
          onSelect={handleRoleNameSelect}
          error={errors.roleName}
        />
      </div>

      <div className="px-5 flex flex-row gap-2.5">
        <Button
          onClick={handleCancle}
          disabled={addMemberMutation.isPending}
          variant="secondary"
        >
          Cancle
        </Button>
        <Button onClick={onSubmit} disabled={addMemberMutation.isPending}>
          {addMemberMutation.isPending ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
};

export default AddMember;
