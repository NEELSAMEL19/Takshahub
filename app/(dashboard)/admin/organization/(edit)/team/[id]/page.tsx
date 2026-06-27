"use client";

import Header from "@/components/Base/Header/Header";
import { Dropdown, TextField } from "@/components/UI";
import { Status } from "@/features/organization/types";
import { useEditMember, useGetMemberById } from "@/hooks/organization/member";
import { useGetRolesByPortal } from "@/hooks/organization/roles";
import { useRouter, useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { addMemberSchema } from "@/features/organization/validation";
import { EditMemberPayload } from "@/types/organzation";

const PORTAL_TYPE_OPTIONS = ["ADMIN", "STAFF", "TEACHER", "STUDENT"] as const;
type PortalType = (typeof PORTAL_TYPE_OPTIONS)[number];

const EditMember = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const { data: memberData, isLoading: isMemberLoading } = useGetMemberById(id);
  const member = memberData?.data;

  const [overrides, setOverrides] = useState<{
    fullName: string | null;
    email: string | null;
    phoneNumber: string | null;
    portalType: PortalType | null;
    roleName: string | null;
    password: string | null;
  }>({
    fullName: null,
    email: null,
    phoneNumber: null,
    portalType: null,
    roleName: null,
    password: null,
  });

  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    phoneNumber?: string;
    portalType?: string;
    roleName?: string;
    password?: string;
  }>({});

  const [status, setStatus] = useState<{
    fullName: Status;
    email: Status;
    phoneNumber: Status;
    portalType: Status;
    roleName: Status;
    password: Status;
  }>({
    fullName: "info",
    email: "info",
    phoneNumber: "info",
    portalType: "info",
    roleName: "info",
    password: "info",
  });

  useEffect(() => {
    if (member) {
      setOverrides({
        fullName: null,
        email: null,
        phoneNumber: null,
        portalType: null,
        roleName: null,
        password: null,
      });
    }
  }, [member?.id]);

  const fullName = overrides.fullName ?? member?.fullName ?? "";
  const email = overrides.email ?? member?.email ?? "";
  const phoneNumber = overrides.phoneNumber ?? member?.phoneNumber ?? "";
  const portalType =
    overrides.portalType ?? (member?.role?.portalType as PortalType) ?? "";
  const roleName = overrides.roleName ?? member?.role?.name ?? "";
  const password = overrides.password ?? "";

  const { data: rolesData } = useGetRolesByPortal(portalType || null);
  const roleOptions = rolesData?.data ?? [];

  const editMemberMutation = useEditMember(
    (backendErrors: Record<string, string>) => {
      setErrors(backendErrors);
      setStatus({
        fullName: backendErrors?.fullName ? "error" : "success",
        email: backendErrors?.email ? "error" : "success",
        phoneNumber: backendErrors?.phoneNumber ? "error" : "success",
        portalType: backendErrors?.portalType ? "error" : "success",
        roleName: backendErrors?.roleName ? "error" : "success",
        password: backendErrors?.password ? "error" : "success",
      });
    },
  );

  const validateField = (field: keyof typeof errors, value: string) => {
    // ✅ Password is optional on edit — only validate if user typed something
    if (field === "password") {
      if (!value) {
        setErrors((prev) => ({ ...prev, password: undefined }));
        setStatus((prev) => ({ ...prev, password: "info" }));
        return;
      }
      const result = addMemberSchema.shape.password.safeParse(value);
      if (!result.success) {
        setErrors((prev) => ({
          ...prev,
          password: result.error.issues[0].message,
        }));
        setStatus((prev) => ({ ...prev, password: "error" }));
      } else {
        setErrors((prev) => ({ ...prev, password: undefined }));
        setStatus((prev) => ({ ...prev, password: "success" }));
      }
      return;
    }

    const schemaField = field as keyof typeof addMemberSchema.shape;
    if (!(schemaField in addMemberSchema.shape)) return;

    const result = addMemberSchema.shape[schemaField].safeParse(value);
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
    setOverrides((prev) => ({ ...prev, fullName: value }));
    validateField("fullName", value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setOverrides((prev) => ({ ...prev, email: value }));
    validateField("email", value);
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setOverrides((prev) => ({ ...prev, phoneNumber: value }));
    validateField("phoneNumber", value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setOverrides((prev) => ({ ...prev, password: value }));
    validateField("password", value);
  };

  const handlePortalTypeSelect = (
    e: React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLDivElement>,
    value: string | number | (string | number)[],
  ) => {
    const pt = String(Array.isArray(value) ? value[0] : value) as PortalType;
    setOverrides((prev) => ({ ...prev, portalType: pt, roleName: null }));
    validateField("portalType", pt);
  };

  const handleRoleNameSelect = (
    e: React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLDivElement>,
    value: string | number | (string | number)[],
  ) => {
    const role = String(Array.isArray(value) ? value[0] : value);
    setOverrides((prev) => ({ ...prev, roleName: role }));
    validateField("roleName", role);
  };

  const onSubmit = async () => {
    // ✅ Validate password only if filled — reuses addMemberSchema.shape.password
    if (password) {
      const passResult = addMemberSchema.shape.password.safeParse(password);
      if (!passResult.success) {
        setErrors((prev) => ({
          ...prev,
          password: passResult.error.issues[0].message,
        }));
        setStatus((prev) => ({ ...prev, password: "error" }));
        return;
      }
    }

    // ✅ Validate everything else (password omitted — optional on edit)
    const result = addMemberSchema.omit({ password: true }).safeParse({
      fullName,
      email,
      phoneNumber,
      portalType,
      roleName,
    });

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
        phoneNumber: fieldErrors.phoneNumber ? "error" : prev.phoneNumber,
        portalType: fieldErrors.portalType ? "error" : prev.portalType,
        roleName: fieldErrors.roleName ? "error" : prev.roleName,
      }));
      return;
    }

    setErrors({});

    try {
      const payload: EditMemberPayload = {
        id,
        fullName,
        email,
        phoneNumber,
        portalType,
        roleName,
      };

      // ✅ Only send password if user typed something
      if (password) payload.password = password;

      await editMemberMutation.mutateAsync(payload);
      router.back();
    } catch (_) {}
  };

  if (isMemberLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <span className="text-sm text-gray-500">Loading member...</span>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="flex items-center justify-center h-40">
        <span className="text-sm text-red-400">Member not found.</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-row gap-2.5 items-center px-5">
        <span onClick={() => router.back()} className="cursor-pointer">
          back
        </span>
        <Header header="Edit Member" />
      </div>

      <div className="px-5 flex flex-row gap-2.5 w-2xl">
        <TextField
          label="Full Name"
          type="text"
          name="fullName"
          required
          maxLength={100}
          placeholder="Full Name"
          value={fullName}
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
          value={email}
          onChange={handleEmailChange}
          color={errors.email ? "error" : status.email}
          error={errors.email || ""}
        />

        <TextField
          label="Phone Number"
          type="text"
          name="phoneNumber"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
          color={errors.phoneNumber ? "error" : status.phoneNumber}
          error={errors.phoneNumber || ""}
        />

        <TextField
          label="New Password"
          type="password"
          name="password"
          placeholder="Leave blank to keep current password"
          value={password}
          onChange={handlePasswordChange}
          color={errors.password ? "error" : status.password}
          error={errors.password || ""}
        />

        <Dropdown
          label="Portal Type"
          options={PORTAL_TYPE_OPTIONS.map((type) => ({
            label: type,
            value: type,
          }))}
          value={portalType}
          onSelect={handlePortalTypeSelect}
          error={errors.portalType}
        />

        <Dropdown
          label="Role"
          options={roleOptions}
          value={roleName}
          onSelect={handleRoleNameSelect}
          error={errors.roleName}
        />
      </div>

      <div className="px-5">
        <button
          onClick={onSubmit}
          disabled={editMemberMutation.isPending}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {editMemberMutation.isPending ? "Saving..." : "Update Member"}
        </button>
      </div>
    </div>
  );
};

export default EditMember;
