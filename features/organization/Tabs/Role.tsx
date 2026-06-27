"use client";

import Grid from "@/components/UI/Grid";
import { useGetAllRoles, useDeleteRole } from "@/hooks/organization/roles";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

const Role = () => {
  const { data, isLoading } = useGetAllRoles();
  const { mutate: deleteRole, isPending } = useDeleteRole();
  const router = useRouter();

  const handleDelete = (row: any) => {
    deleteRole({
      name: row.name,
      portalType: row.portalType,
    });
  };

  const columns = [
    {
      field: "schoolId",
      headerName: "SchoolId",
    },
    {
      field: "name",
      headerName: "Name",
    },
    {
      field: "portalType",
      headerName: "Portal Type",
    },
    {
      field: "actions",
      headerName: "Action",
      renderCell: (row: any) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(row);
          }}
          disabled={isPending}
        >
          Delete
        </button>
      ),
    },
  ];

  const rows = useMemo(() => {
    if (!data?.data) return [];

    return Object.entries(data.data).map(([_, role]) => ({
      id: role.id,
      schoolId: role.schoolId,
      name: role.name,
      portalType: role.portalType,
    }));
  }, [data]);

  return (
    <Grid
      rows={rows}
      columns={columns}
      loading={isLoading}
      onRowClick={(row) => {
        router.push(`/admin/organization/role/${row.id}`);
      }}
    />
  );
};

export default Role;
