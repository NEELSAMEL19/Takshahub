"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import Stepper from "@/components/UI/Stepper";
import { Button } from "@/components/UI";
import PersonalDetails from "./PersonalDetails";
import SchoolDetails from "./SchoolDetails";
import { registerSchema, RegisterFormData } from "../validation";
import { useRegister } from "@/hooks/auth/useAuth";
import { sideMenuApi } from "@/service/sideMenu";
import { getSideMenuItems } from "@/utils/permission";
import { Status } from "../types";

type SchoolField = keyof typeof registerSchema.shape.school.shape;
type PersonalFields = "fullName" | "email" | "password" | "phoneNumber";
type SchoolTextFields = "name" | "city" | "website" | "udiseNumber";

export function RegisterForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [signupSteps] = useState<string[]>(["Basic Details", "School Details"]);
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    school: {
      name: "",
      type: "",
      board: "",
      city: "",
      state: "",
      website: "",
      udiseNumber: "",
    },
  });

  const [errors, setErrors] = useState<{
    personal: Partial<Record<PersonalFields, string>>;
    school: Partial<Record<SchoolField, string>>;
  }>({
    personal: {},
    school: {},
  });

  const [status, setStatus] = useState<{
    personal: Record<PersonalFields, Status>;
    school: Record<SchoolTextFields, Status>;
  }>({
    personal: {
      fullName: "info",
      email: "info",
      password: "info",
      phoneNumber: "info",
    },
    school: {
      name: "info",
      city: "info",
      website: "info",
      udiseNumber: "info",
    },
  });

  const registerMutation = useRegister(
    (backendErrors: Record<string, string>) => {
      const personalErrors: Partial<Record<PersonalFields, string>> = {};
      const schoolErrors: Partial<Record<SchoolField, string>> = {};

      Object.entries(backendErrors).forEach(([key, msg]) => {
        if (key.startsWith("school.")) {
          const schoolKey = key.split(".")[1] as SchoolField;
          schoolErrors[schoolKey] = msg;
        } else {
          personalErrors[key as PersonalFields] = msg;
        }
      });

      setErrors({ personal: personalErrors, school: schoolErrors });

      setStatus({
        personal: {
          fullName: personalErrors.fullName ? "error" : "success",
          email: personalErrors.email ? "error" : "success",
          password: personalErrors.password ? "error" : "success",
          phoneNumber: personalErrors.phoneNumber ? "error" : "success",
        },
        school: {
          name: schoolErrors.name ? "error" : "success",
          city: schoolErrors.city ? "error" : "success",
          website: schoolErrors.website ? "error" : "success",
          udiseNumber: schoolErrors.udiseNumber ? "error" : "success",
        },
      });
    },
  );

  const handlePersonalChange = (field: PersonalFields, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    const result = registerSchema.shape[field].safeParse(value);
    setErrors((prev) => ({
      ...prev,
      personal: {
        ...prev.personal,
        [field]: result.success ? undefined : result.error.issues[0].message,
      },
    }));
    setStatus((prev) => ({
      ...prev,
      personal: {
        ...prev.personal,
        [field]: result.success ? (value ? "success" : "info") : "error",
      },
    }));
  };

  const handleSchoolChange = (field: SchoolField, value: string) => {
    setFormData((prev) => ({
      ...prev,
      school: { ...prev.school, [field]: value },
    }));

    const result = registerSchema.shape.school.shape[field].safeParse(value);
    setErrors((prev) => ({
      ...prev,
      school: {
        ...prev.school,
        [field]: result.success ? undefined : result.error.issues[0].message,
      },
    }));

    if (
      field === "name" ||
      field === "city" ||
      field === "website" ||
      field === "udiseNumber"
    ) {
      setStatus((prev) => ({
        ...prev,
        school: {
          ...prev.school,
          [field]: result.success ? (value ? "success" : "info") : "error",
        },
      }));
    }
  };

  const handleNext = () => {
    if (step < signupSteps.length) {
      setStep((prevStep) => prevStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prevStep) => prevStep - 1);
    }
  };

  const handleSubmit = async () => {
    const result = registerSchema.safeParse(formData);

    if (!result.success) {
      const personalErrors: Partial<Record<PersonalFields, string>> = {};
      const schoolErrors: Partial<Record<SchoolField, string>> = {};

      result.error.issues.forEach((issue) => {
        const isSchoolField = issue.path[0] === "school";
        if (isSchoolField) {
          const field = issue.path[1] as SchoolField;
          if (!schoolErrors[field]) schoolErrors[field] = issue.message;
        } else {
          const field = issue.path[0] as PersonalFields;
          if (!personalErrors[field]) personalErrors[field] = issue.message;
        }
      });

      setErrors({ personal: personalErrors, school: schoolErrors });

      setStatus({
        personal: {
          fullName: personalErrors.fullName
            ? "error"
            : status.personal.fullName,
          email: personalErrors.email ? "error" : status.personal.email,
          password: personalErrors.password
            ? "error"
            : status.personal.password,
          phoneNumber: personalErrors.phoneNumber
            ? "error"
            : status.personal.phoneNumber,
        },
        school: {
          name: schoolErrors.name ? "error" : status.school.name,
          city: schoolErrors.city ? "error" : status.school.city,
          website: schoolErrors.website ? "error" : status.school.website,
          udiseNumber: schoolErrors.udiseNumber
            ? "error"
            : status.school.udiseNumber,
        },
      });

      if (Object.keys(personalErrors).length > 0) {
        setStep(1);
      }
      return;
    }

    setErrors({ personal: {}, school: {} });

    try {
      const response = await registerMutation.mutateAsync(formData);
      const role = response?.data?.auth?.role;

      if (role === "ADMIN") {
        const menuData = await queryClient.fetchQuery({
          queryKey: ["sideMenu", "admin"],
          queryFn: sideMenuApi.adminMenu,
          staleTime: 1000 * 60 * 5,
        });

        if (menuData?.data) {
          const menuItems = getSideMenuItems(menuData.data);
          const firstModulePath = menuItems[0]?.path;

          if (firstModulePath) {
            router.replace(firstModulePath);
            return;
          }
        }
        router.replace("/admin");
      } else if (role === "TEACHER") {
        router.replace("/teacher");
      } else if (role === "STUDENT") {
        router.replace("/student");
      } else {
        router.replace("/dashboard");
      }
    } catch (error) {
      console.error("Post-registration navigation runtime failure:", error);
    }
  };

  return (
      <div className="w-full flex justify-center items-center max-w-lg space-y-6 rounded-2xl p-6 sm:p-10">
        <div className="w-full">
          <Stepper
            steps={signupSteps}
            currentStep={step}
            onStepClick={(targetStep) => setStep(targetStep)}
          />
        </div>

        <form
          className="w-full mt-4 px-2.5"
          onSubmit={(e) => {
            e.preventDefault();
            if (step === signupSteps.length) handleSubmit();
            else handleNext();
          }}
        >
          {/* Managed content area with explicit minimum size requirements */}
          <div className="min-h-[260px] md:min-h-[240px]">
            {step === 1 && (
              <PersonalDetails
                formData={formData}
                errors={errors.personal}
                status={status.personal}
                onChange={handlePersonalChange}
              />
            )}

            {step === 2 && (
              <SchoolDetails
                schoolData={formData.school}
                errors={errors.school}
                status={status.school}
                onChange={handleSchoolChange}
              />
            )}
          </div>

          {/* Clean Action Bars with mobile layout safety overrides */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-6">
            {step > 1 && (
              <Button
                type="button"
                variant="secondary"
                onClick={handleBack}
                disabled={registerMutation.isPending}
                className="w-full sm:w-auto"
              >
                Back
              </Button>
            )}

            <Button
              type="submit"
              variant="primary"
              isLoading={registerMutation.isPending}
              className="w-full sm:w-auto min-w-[100px]"
            >
              {step === signupSteps.length ? "Register" : "Next"}
            </Button>
          </div>
        </form>
      </div>
  );
}
