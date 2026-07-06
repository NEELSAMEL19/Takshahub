"use client";

import Grid from "@/components/UI/Grid";
import { useDeleteMember, useGetAllMembers } from "@/hooks/organization/member";
import { useRouter } from "next/navigation";
import type { MemberData } from "@/types/organzation";

const Team = () => {
  const { data, isLoading } = useGetAllMembers();
  const { mutate: deleteMember, isPending } = useDeleteMember();
  const router = useRouter();

  const handleDelete = (row: MemberData) => {
    deleteMember({
      email: row.email,
    });
  };

  const columns = [
    {
      field: "fullName",
      headerName: "Full Name",
    },
    {
      field: "email",
      headerName: "Email",
    },
    {
      field: "phoneNumber",
      headerName: "Phone Number",
    },
    {
      field: "isActive",
      headerName: "Status",
      renderCell: (row: MemberData) => (row.isActive ? "Active" : "Inactive"),
    },
    {
      field: "role.name",
      headerName: "Role Name",
    },
    {
      field: "role.portalType",
      headerName: "Portal Type",
    },
    {
      field: "actions",
      headerName: "Action",
      renderCell: (row: MemberData) => (
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
        router.push(`/admin/organization/team/${row.id}`);
      }}
    />
  );
};

export default Team;
