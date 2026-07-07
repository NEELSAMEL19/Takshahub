"use client";

import Grid from "@/components/UI/Grid";
import { useRouter } from "next/navigation";
import { SubjectTeacherWithDetails } from "@/types/management";
import {
  useUnassignSubjectTeacher,
  useGetAllSubjectTeachers,
} from "@/hooks/management/SubjectTeacher";

const SubjectTeacherList = () => {
  const { data, isLoading } = useGetAllSubjectTeachers();
  const { mutate: unassignSubjectTeacher, isPending } =
    useUnassignSubjectTeacher();
  const router = useRouter();

  const handleDelete = (row: SubjectTeacherWithDetails) => {
    unassignSubjectTeacher({
      teacherId: row.teacherId,
      classId: row.classId,
      sectionId: row.sectionId,
      subjectId: row.subjectId,
    });
  };

  const columns = [
    {
      field: "teacher.fullName",
      headerName: "Teacher name",
    },
    {
      field: "subject.name",
      headerName: "Subject",
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
      renderCell: (row: SubjectTeacherWithDetails) => (
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
      onRowClick={(row: SubjectTeacherWithDetails) => {
        router.push(`/admin/management/subject_teacher/${row.id}`);
      }}
    />
  );
};

export default SubjectTeacherList;
