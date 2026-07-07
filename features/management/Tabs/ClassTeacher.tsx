"use client";

import Grid from "@/components/UI/Grid";
import { useRouter } from "next/navigation";
import { ClassTeacherWithDetails } from "@/types/management";
import {
  useUnassignClassTeacher,
  useGetAllClassTeachers,
} from "@/hooks/management/classTeacher";

const ClassTeacherList = () => {
  const { data, isLoading } = useGetAllClassTeachers();
  const { mutate: unassignClassTeacher, isPending } = useUnassignClassTeacher();
  const router = useRouter();

  const handleDelete = (row: ClassTeacherWithDetails) => {
    unassignClassTeacher(row.sectionId);
  };

  const columns = [
    {
      field: "teacher.fullName",
      headerName: "Teacher name",
    },
    {
      field: "class.name",
      headerName: "Class",
    },
    {
      field: "section.name",
      headerName: "Section",
    },
    {
      field: "actions",
      headerName: "Action",
      renderCell: (row: ClassTeacherWithDetails) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(row);
          }}
          disabled={isPending}
        >
          Unassign
        </button>
      ),
    },
  ];

  return (
    <Grid
      rows={data?.data ?? []}
      columns={columns}
      loading={isLoading}
      onRowClick={(row: ClassTeacherWithDetails) => {
        router.push(`/admin/management/class_teacher/${row.id}`);
      }}
    />
  );
};

export default ClassTeacherList;
