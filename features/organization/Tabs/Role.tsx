"use client";

import Grid from "@/components/UI/Grid";
import { useDeleteRole, useGetAllRoles } from "@/hooks/organization/roles";
import { useRouter } from "next/navigation";

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
      headerName: "School ID",
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

  return (
    <Grid
      rows={data?.data ?? []}
      columns={columns}
      loading={isLoading}
      onRowClick={(row) => {
        router.push(`/admin/organization/role/${row.id}`);
      }}
    />
  );
};

export default Role;
