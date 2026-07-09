"use client";

import Grid from "@/components/UI/Grid";
import { useRouter } from "next/navigation";
import { AcademicYear as AcademicYearType } from "@/types/academic";
import {
  useActivateAcademicYear,
  useDeleteAcademicYear,
  useGetAcademicYears,
} from "@/hooks/academic/academicYear";

const AcademicYear = () => {
  const { data, isLoading } = useGetAcademicYears();
  const { mutate: deleteAcademicYear, isPending: isDeleting } =
    useDeleteAcademicYear();
  const { mutate: activateAcademicYear, isPending: isActivating } =
    useActivateAcademicYear();
  const router = useRouter();

  const handleDelete = (row: AcademicYearType) => {
    deleteAcademicYear(row.id);
  };

  const handleActivate = (row: AcademicYearType) => {
    if (row.isActive || isActivating) return;
    activateAcademicYear(row.id);
  };

  const columns = [
    {
      field: "label",
      headerName: "Label",
    },
    {
      field: "isActive",
      headerName: "Status",
      renderCell: (row: AcademicYearType) =>
        row.isActive ? (
          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
            Active
          </span>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleActivate(row);
            }}
            disabled={isActivating}
            title="Click to activate this academic year"
            className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full hover:bg-blue-100 hover:text-blue-700 disabled:opacity-50 transition-colors"
          >
            {isActivating ? "Activating..." : "Inactive"}
          </button>
        ),
    },
    {
      field: "startDate",
      headerName: "Start Date",
      renderCell: (row: AcademicYearType) => row.startDate.split("T")[0],
    },
    {
      field: "endDate",
      headerName: "End Date",
      renderCell: (row: AcademicYearType) => row.endDate.split("T")[0],
    },
    {
      field: "actions",
      headerName: "Action",
      renderCell: (row: AcademicYearType) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(row);
          }}
          disabled={isDeleting || row.isActive}
          title={row.isActive ? "Cannot delete the active year" : undefined}
          className="text-red-600 hover:underline disabled:opacity-50"
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
        router.push(`/admin/academic/academic_year/${row.id}`);
      }}
    />
  );
};

export default AcademicYear;
