"use client";

import Grid from "@/components/UI/Grid";
import { useDeleteClass, useGetAllClasses } from "@/hooks/management/class";
import { useRouter } from "next/navigation";
import { ClassData } from "@/types/management";

const Class = () => {
  const { data, isLoading } = useGetAllClasses();
  const { mutate: deleteClass, isPending } = useDeleteClass();
  const router = useRouter();

  const handleDelete = (row: ClassData) => {
    deleteClass(row.id);
  };

  const columns = [
    {
      field: "name",
      headerName: "Class",
    },
    {
      field: "sections",
      headerName: "Section",
      renderCell: (row: ClassData) =>
        row.sections.length > 0
          ? row.sections.map((s) => s.name).join(", ")
          : "—",
    },
    {
      field: "actions",
      headerName: "Action",
      renderCell: (row: ClassData) => (
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
        router.push(`/admin/management/class/${row.id}`);
      }}
    />
  );
};

export default Class;
