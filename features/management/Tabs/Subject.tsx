"use client";

import Grid from "@/components/UI/Grid";
import { useRouter } from "next/navigation";
import { SubjectWithAssignments } from "@/types/management";
import {
  useDeleteSubject,
  useGetAllSubjects,
} from "@/hooks/management/subject";

const Subject = () => {
  const { data, isLoading } = useGetAllSubjects();
  const { mutate: deleteSubject, isPending } = useDeleteSubject();
  const router = useRouter();

  const handleDelete = (row: SubjectWithAssignments) => {
    deleteSubject({ name: row.name });
  };

  const columns = [
    {
      field: "name",
      headerName: "Subject",
    },
    {
      field: "teacherAssignments",
      headerName: "Teacher",
      renderCell: (row: SubjectWithAssignments) =>
        row.teacherAssignments.length > 0
          ? row.teacherAssignments.map((a) => a.teacher.fullName).join(", ")
          : "—",
    },
    {
      field: "actions",
      headerName: "Action",
      renderCell: (row: SubjectWithAssignments) => (
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
        router.push(`/admin/management/subject/${row.id}`);
      }}
    />
  );
};

export default Subject;
