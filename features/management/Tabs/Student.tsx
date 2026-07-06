"use client";

import Grid from "@/components/UI/Grid";
import { useRouter } from "next/navigation";
import { EnrolledStudent } from "@/types/management";
import {
  useDeleteStudent,
  useGetAllStudents,
} from "@/hooks/management/student";

const StudentList = () => {
  const { data, isLoading } = useGetAllStudents();
  const { mutate: deleteStudent, isPending } = useDeleteStudent();
  const router = useRouter();

  const handleDelete = (row: EnrolledStudent) => {
    deleteStudent({
      studentId: row.studentId,
      classId: row.classId,
    });
  };

  const columns = [
    {
      field: "student.fullName",
      headerName: "Name",
    },
    {
      field: "student.email",
      headerName: "Email",
    },
    {
      field: "student.phoneNumber",
      headerName: "Phone number",
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
      renderCell: (row: EnrolledStudent) => (
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
      onRowClick={(row: EnrolledStudent) => {
        router.push(`/admin/management/student/${row.studentId ?? row.id}`);
      }}
    />
  );
};

export default StudentList;
