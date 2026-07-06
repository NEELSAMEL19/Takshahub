"use client";

import { Button, Dropdown, TextField } from "@/components/UI";
import { Status } from "@/types/ui";
import { useEditRole, useGetRoleById } from "@/hooks/organization/roles";
import { useGetPermissionTemplate } from "@/hooks/permissions/permissions";
import { useRouter, useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { addRoleSchema } from "@/features/organization/validation";
import PermissionTable, {
  Permission,
} from "@/features/organization/components/PermissionTable";
import Header from "@/components/Base/Header/Header";
import { RolePermission } from "@/types/organzation";

const PORTAL_TYPE_OPTIONS = ["ADMIN", "STAFF", "TEACHER", "STUDENT"] as const;
import type { PortalType } from "@/types/organzation";

function mapToPermissions(rolePermissions: RolePermission[]): Permission[] {
  return rolePermissions.map((rp) => ({
    module: rp.permission.module,
    feature: rp.permission.feature,
    canRead: rp.canRead,
    canCreate: rp.canCreate,
    canUpdate: rp.canUpdate,
    canDelete: rp.canDelete,
  }));
}

const EditRole = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const { data: roleData, isLoading: isRoleLoading } = useGetRoleById(id);
  const role = roleData?.data;

  const [overrides, setOverrides] = useState<{
    name: string | null;
    portalType: PortalType | null;
    permissions: Permission[];
  }>({
    name: null,
    portalType: null,
    permissions: [],
  });

  const [errors, setErrors] = useState<{
    newName?: string;
    portalType?: string;
  }>({});

  const [status, setStatus] = useState<{
    newName: Status;
    portalType: Status;
  }>({
    newName: "info",
    portalType: "info",
  });

  useEffect(() => {
    if (role) {
      // Avoid synchronous setState inside effect (ESLint rule).
      setTimeout(() => {
        setOverrides({
          name: null,
          portalType: null,
          permissions: mapToPermissions(role.permissions),
        });
      }, 0);
    }
  }, [role?.id]);

  // Derive current values — user override takes priority over server data
  const newName = overrides.name ?? role?.name ?? "";
  const oldPortalType = (role?.portalType as PortalType) ?? "";
  const newPortalType = overrides.portalType ?? oldPortalType;
  const permissions = overrides.permissions;

  const { data: templateData, isLoading: isTemplateLoading } =
    useGetPermissionTemplate(newPortalType || null);

  const template = templateData?.data ?? [];

  const editRoleMutation = useEditRole(
    (backendErrors: Record<string, string>) => {
      setErrors(backendErrors);
      setStatus({
        newName: backendErrors?.newName ? "error" : "success",
        portalType: backendErrors?.portalType ? "error" : "success",
      });
    },
  );

  const validateField = (field: "newName" | "portalType", value: string) => {
    const schemaField = field === "newName" ? "name" : "portalType";
    const result = addRoleSchema.shape[schemaField].safeParse(value);

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
    setOverrides((prev) => ({ ...prev, name: value }));
    validateField("newName", value);
  };

  const handlePortalTypeSelect = (
    e: React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLDivElement>,
    value: string | number | (string | number)[],
  ) => {
    const pt = String(Array.isArray(value) ? value[0] : value) as PortalType;
    setOverrides((prev) => ({ ...prev, portalType: pt, permissions: [] }));
    validateField("portalType", pt);
  };

  const handlePermissionsChange = (updatedPermissions: Permission[]) => {
    setOverrides((prev) => ({ ...prev, permissions: updatedPermissions }));
  };

  const onSubmit = async () => {
    const result = addRoleSchema.safeParse({
      name: newName,
      portalType: newPortalType,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path[0] === "name" ? "newName" : "portalType";
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
      setStatus((prev) => ({
        newName: fieldErrors.newName ? "error" : prev.newName,
        portalType: fieldErrors.portalType ? "error" : prev.portalType,
      }));
      return;
    }

    setErrors({});

    try {
      await editRoleMutation.mutateAsync({
        oldName: role!.name,
        newName,
        oldPortalType,
        newPortalType,
        permissions,
      });
      router.back();
    } catch (_) {}
  };

  if (isRoleLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <span className="text-sm text-gray-500">Loading role...</span>
      </div>
    );
  }

  if (!role) {
    return (
      <div className="flex items-center justify-center h-40">
        <span className="text-sm text-red-400">Role not found.</span>
      </div>
    );
  }

  const handleCancle = () => {
    router.back();
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <Header header="Edit role" />
      </div>

      <div className="max-w-lg px-5 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <TextField
          label="Name"
          type="text"
          name="newName"
          required
          maxLength={100}
          placeholder="Name"
          value={newName}
          onChange={handleNameChange}
          color={errors.newName ? "error" : status.newName}
          error={errors.newName || ""}
        />

        <Dropdown
          label="Portal type"
          options={PORTAL_TYPE_OPTIONS.map((type) => ({
            label: type,
            value: type,
          }))}
          value={newPortalType}
          onSelect={handlePortalTypeSelect}
          error={errors.portalType}
        />
      </div>

      {newPortalType && (
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
              permissions={permissions}
              onChange={handlePermissionsChange}
            />
          )}
        </div>
      )}

      <div className="px-5 flex flex-row gap-2.5">
        <Button
          onClick={handleCancle}
          disabled={editRoleMutation.isPending}
          variant="secondary"
        >
          Cancle
        </Button>
        <Button onClick={onSubmit} disabled={editRoleMutation.isPending}>
          {editRoleMutation.isPending ? "Saving..." : "Update Role"}
        </Button>
      </div>
    </div>
  );
};

export default EditRole;
