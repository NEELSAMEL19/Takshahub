"use client";

import { Button, Dropdown, TextField } from "@/components/UI";
import { Status } from "@/features/organization/types";
import { useAddRole } from "@/hooks/organization/roles";
import { useGetPermissionTemplate } from "@/hooks/permissions/permissions";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { addRoleSchema } from "../validation";
import PermissionTable, { Permission } from "../components/PermissionTable";
import Header from "@/components/Base/Header/Header";

const PORTAL_TYPE_OPTIONS = ["STAFF", "TEACHER", "STUDENT"] as const;
type PortalType = (typeof PORTAL_TYPE_OPTIONS)[number];

const AddRole = () => {
  const router = useRouter();

  const [formData, setFormData] = useState<{
    name: string;
    portalType: PortalType | "";
    permissions: Permission[];
  }>({
    name: "",
    portalType: "",
    permissions: [],
  });

  const [errors, setErrors] = useState<{
    name?: string;
    portalType?: string;
  }>({});

  const [status, setStatus] = useState<{
    name: Status;
    portalType: Status;
  }>({
    name: "info",
    portalType: "info",
  });

  const { data: templateData, isLoading: isTemplateLoading } =
    useGetPermissionTemplate(formData.portalType || null);

  const addRoleMutation = useAddRole(
    (backendErrors: Record<string, string>) => {
      setErrors(backendErrors);
      setStatus({
        name: backendErrors?.name ? "error" : "success",
        portalType: backendErrors?.portalType ? "error" : "success",
      });
    },
  );

  const validateField = (field: "name" | "portalType", value: string) => {
    const result = addRoleSchema.shape[field].safeParse(value);

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

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, name: value }));
    validateField("name", value);
  };

  const handlePortalTypeSelect = (
    e: React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLDivElement>,
    value: string | number | (string | number)[],
  ) => {
    const portalType = String(
      Array.isArray(value) ? value[0] : value,
    ) as PortalType;
    setFormData((prev) => ({
      ...prev,
      portalType,
      permissions: [],
    }));
    validateField("portalType", portalType);
  };

  const handlePermissionsChange = (updatedPermissions: Permission[]) => {
    setFormData((prev) => ({ ...prev, permissions: updatedPermissions }));
  };

  const onSubmit = async () => {
    const result = addRoleSchema.safeParse({
      name: formData.name,
      portalType: formData.portalType,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as "name" | "portalType";
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      });

      setErrors(fieldErrors);
      setStatus((prev) => ({
        ...prev,
        name: fieldErrors.name ? "error" : prev.name,
        portalType: fieldErrors.portalType ? "error" : prev.portalType,
      }));

      return;
    }

    setErrors({});

    try {
      await addRoleMutation.mutateAsync({
        name: formData.name,
        portalType: formData.portalType as string, // ← narrowed from PortalType | ""
        permissions: formData.permissions,
      });
      router.back();
    } catch (error) {}
  };

  const template = templateData?.data ?? [];

  const handleCancle = () => {
    router.back();
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <Header header="Add role" />
      </div>

      <div className="max-w-lg px-5 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <TextField
          label="Name"
          type="text"
          name="name"
          required
          maxLength={100}
          placeholder="Name"
          value={formData.name}
          onChange={handleNameChange}
          color={errors.name ? "error" : status.name}
          error={errors.name || ""}
        />

        <Dropdown
          label="Portal type"
          options={PORTAL_TYPE_OPTIONS.map((type) => ({
            label: type,
            value: type,
          }))}
          value={formData.portalType}
          onSelect={handlePortalTypeSelect}
          error={errors.portalType}
        />
      </div>

      {formData.portalType && (
        <div className="relative">
          {isTemplateLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-10 rounded">
              <span className="text-sm text-gray-500">
                Loading permissions...
              </span>
            </div>
          )}

          {!isTemplateLoading && template.length === 0 && (
            <p className="px-5 text-sm text-gray-400">
              No permissions available for this portal type.
            </p>
          )}

          {template.length > 0 && (
            <PermissionTable
              template={template}
              permissions={formData.permissions}
              onChange={handlePermissionsChange}
            />
          )}
        </div>
      )}

      <div className="px-5 flex flex-row gap-2.5">
        <Button
          onClick={handleCancle}
          disabled={addRoleMutation.isPending}
          variant="secondary"
        >
          Cancle
        </Button>
        <Button
          onClick={onSubmit}
          disabled={addRoleMutation.isPending}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {addRoleMutation.isPending ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
};

export default AddRole;
