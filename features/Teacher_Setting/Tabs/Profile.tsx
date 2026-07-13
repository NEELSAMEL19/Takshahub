"use client";

import Header from "@/components/Base/Header/Header";
import { Button, TextField } from "@/components/UI";
import { Status } from "@/types/ui";
import { useGetProfile, useUpdateProfile } from "@/hooks/setting/profile";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { updateProfileSchema } from "../validation";
import { UpdateProfilePayload } from "@/types/setting";

const Profile = () => {
  const router = useRouter();

  const { data: profileData, isLoading: isProfileLoading } = useGetProfile();
  const profile = profileData?.data;

  const [overrides, setOverrides] = useState<{
    fullName: string | null;
    email: string | null;
    phoneNumber: string | null;
    currentPassword: string | null;
    newPassword: string | null;
  }>({
    fullName: null,
    email: null,
    phoneNumber: null,
    currentPassword: null,
    newPassword: null,
  });

  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    phoneNumber?: string;
    currentPassword?: string;
    newPassword?: string;
  }>({});

  const [status, setStatus] = useState<{
    fullName: Status;
    email: Status;
    phoneNumber: Status;
    currentPassword: Status;
    newPassword: Status;
  }>({
    fullName: "info",
    email: "info",
    phoneNumber: "info",
    currentPassword: "info",
    newPassword: "info",
  });

  useEffect(() => {
    if (profile) {
      setTimeout(() => {
        setOverrides({
          fullName: null,
          email: null,
          phoneNumber: null,
          currentPassword: null,
          newPassword: null,
        });
      }, 0);
    }
  }, [profile?.id]);

  const fullName = overrides.fullName ?? profile?.fullName ?? "";
  const email = overrides.email ?? profile?.email ?? "";
  const phoneNumber = overrides.phoneNumber ?? profile?.phoneNumber ?? "";
  const currentPassword = overrides.currentPassword ?? "";
  const newPassword = overrides.newPassword ?? "";

  const updateProfileMutation = useUpdateProfile(
    (backendErrors: Record<string, string>) => {
      setErrors(backendErrors);
      setStatus({
        fullName: backendErrors?.fullName ? "error" : "success",
        email: backendErrors?.email ? "error" : "success",
        phoneNumber: backendErrors?.phoneNumber ? "error" : "success",
        currentPassword: backendErrors?.currentPassword ? "error" : "success",
        newPassword: backendErrors?.newPassword ? "error" : "success",
      });
    },
  );

  // ✅ Dirty-check: compare current field values against the fetched profile.
  // Save stays disabled until something actually changed.
  const isDirty =
    !!profile &&
    (fullName !== (profile.fullName ?? "") ||
      email !== (profile.email ?? "") ||
      phoneNumber !== (profile.phoneNumber ?? "") ||
      newPassword.length > 0);

  const validateField = (field: keyof typeof errors, value: string) => {
    // Passwords optional — only validate if the user typed something
    if (field === "currentPassword" || field === "newPassword") {
      if (!value) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
        setStatus((prev) => ({ ...prev, [field]: "info" }));
        return;
      }
      const schemaField = updateProfileSchema.shape[field];
      const result = schemaField.safeParse(value);
      if (!result.success) {
        setErrors((prev) => ({
          ...prev,
          [field]: result.error.issues[0].message,
        }));
        setStatus((prev) => ({ ...prev, [field]: "error" }));
      } else {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
        setStatus((prev) => ({ ...prev, [field]: "success" }));
      }
      return;
    }

    const schemaField = field as keyof typeof updateProfileSchema.shape;
    if (!(schemaField in updateProfileSchema.shape)) return;

    const result = updateProfileSchema.shape[schemaField].safeParse(value);
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

  const handleCurrentPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;
    setOverrides((prev) => ({ ...prev, currentPassword: value }));
    validateField("currentPassword", value);
  };

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setOverrides((prev) => ({ ...prev, newPassword: value }));
    validateField("newPassword", value);
  };

  const onSubmit = async () => {
    if (newPassword && !currentPassword) {
      setErrors((prev) => ({
        ...prev,
        currentPassword: "Current password is required to set a new password",
      }));
      setStatus((prev) => ({ ...prev, currentPassword: "error" }));
      return;
    }

    if (newPassword) {
      const passResult =
        updateProfileSchema.shape.newPassword.safeParse(newPassword);
      if (!passResult.success) {
        setErrors((prev) => ({
          ...prev,
          newPassword: passResult.error.issues[0].message,
        }));
        setStatus((prev) => ({ ...prev, newPassword: "error" }));
        return;
      }
    }

    const result = updateProfileSchema
      .omit({ currentPassword: true, newPassword: true })
      .safeParse({ fullName, email, phoneNumber });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof typeof errors;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      });
      setErrors((prev) => ({ ...prev, ...fieldErrors }));
      setStatus((prev) => ({
        ...prev,
        fullName: fieldErrors.fullName ? "error" : prev.fullName,
        email: fieldErrors.email ? "error" : prev.email,
        phoneNumber: fieldErrors.phoneNumber ? "error" : prev.phoneNumber,
      }));
      return;
    }

    setErrors({});

    try {
      // ✅ Only send fields that actually changed
      const payload: UpdateProfilePayload = {};
      if (fullName !== (profile?.fullName ?? "")) payload.fullName = fullName;
      if (email !== (profile?.email ?? "")) payload.email = email;
      if (phoneNumber !== (profile?.phoneNumber ?? ""))
        payload.phoneNumber = phoneNumber;
      if (newPassword) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }

      await updateProfileMutation.mutateAsync(payload);

      // ✅ Clear password fields after a successful save
      setOverrides((prev) => ({
        ...prev,
        currentPassword: null,
        newPassword: null,
      }));
    } catch (_) {}
  };

  if (isProfileLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <span className="text-sm text-gray-500">Loading profile...</span>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-40">
        <span className="text-sm text-red-400">Profile not found.</span>
      </div>
    );
  }

  const handleCancel = () => {
    setOverrides({
      fullName: null,
      email: null,
      phoneNumber: null,
      currentPassword: null,
      newPassword: null,
    });
    setErrors({});
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="px-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
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
          label="Current Password"
          type="password"
          name="currentPassword"
          placeholder="Required to set a new password"
          value={currentPassword}
          onChange={handleCurrentPasswordChange}
          color={errors.currentPassword ? "error" : status.currentPassword}
          error={errors.currentPassword || ""}
        />

        <TextField
          label="New Password"
          type="password"
          name="newPassword"
          placeholder="Leave blank to keep current password"
          value={newPassword}
          onChange={handleNewPasswordChange}
          color={errors.newPassword ? "error" : status.newPassword}
          error={errors.newPassword || ""}
        />
      </div>

      <div className="px-5 flex flex-row gap-2.5">
        <Button
          onClick={handleCancel}
          disabled={updateProfileMutation.isPending || !isDirty}
          variant="secondary"
        >
          Cancel
        </Button>
        <Button
          onClick={onSubmit}
          disabled={updateProfileMutation.isPending || !isDirty}
        >
          {updateProfileMutation.isPending ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
};

export default Profile;
