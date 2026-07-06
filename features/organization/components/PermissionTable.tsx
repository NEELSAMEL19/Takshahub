import React from "react";

// Local Permission shape used by the PermissionTable UI
export type Permission = {
  module: string;
  feature: string;
  canRead: boolean;
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
};

// --- Types matching your API response ---
type ApiFeature = {
  id: string;
  name: string;
  allowedActions: PermissionKey[];
};

type ApiModule = {
  id: string;
  name: string;
  features: ApiFeature[];
};

type Feature = {
  id: string;
  name: string;
  allowedActions: PermissionKey[];
} & Partial<Record<PermissionKey, boolean>>;

type Module = {
  id: string;
  name: string;
  isOpen: boolean;
  features: Feature[];
};

type PermissionTableProps = {
  template: ApiModule[]; // from useGetPermissionTemplate
  permissions: Permission[]; // existing values to hydrate
  onChange: (permissions: Permission[]) => void;
};

type PermissionKey = "canRead" | "canCreate" | "canUpdate" | "canDelete";

const PERMISSION_COLUMNS: { key: PermissionKey; label: string }[] = [
  { key: "canRead", label: "Read" },
  { key: "canCreate", label: "Create" },
  { key: "canUpdate", label: "Update" },
  { key: "canDelete", label: "Delete" },
];

// Build internal module state from API template + existing permissions
function buildModules(
  template: ApiModule[],
  permissions: Permission[],
): Module[] {
  return template.map((mod) => ({
    id: mod.id,
    name: mod.name,
    isOpen: true,
    features: mod.features.map((feat) => {
      const match = permissions.find(
        (p) => p.module === mod.id && p.feature === feat.id,
      );
      // Seed each allowed action — prefer existing permission value, default false
      const actionValues = Object.fromEntries(
        feat.allowedActions.map((action) => [action, match?.[action] ?? false]),
      ) as Partial<Record<PermissionKey, boolean>>;

      return {
        id: feat.id,
        name: feat.name,
        allowedActions: feat.allowedActions,
        ...actionValues,
      };
    }),
  }));
}

export default function PermissionTable({
  template,
  permissions,
  onChange,
}: PermissionTableProps) {
  const [modules, setModules] = React.useState<Module[]>(() =>
    buildModules(template, permissions),
  );

  // Re-initialise if the template changes (e.g. portalType switch)
  React.useEffect(() => {
    // Avoid synchronous setState inside effect (ESLint rule).
    setTimeout(() => {
      setModules(buildModules(template, permissions));
    }, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [template]);

  const toggleAccordion = (moduleId: string) => {
    setModules((prev) =>
      prev.map((mod) =>
        mod.id === moduleId ? { ...mod, isOpen: !mod.isOpen } : mod,
      ),
    );
  };

  const handleCheckboxChange = (
    moduleId: string,
    featureId: string,
    permissionKey: PermissionKey,
  ) => {
    const updatedModules = modules.map((mod) => {
      if (mod.id !== moduleId) return mod;
      return {
        ...mod,
        features: mod.features.map((feat) => {
          if (feat.id !== featureId) return feat;
          return { ...feat, [permissionKey]: !feat[permissionKey] };
        }),
      };
    });

    setModules(updatedModules);

    // Emit only the actions that exist per feature (driven by allowedActions)
    const updatedPermissions: Permission[] = updatedModules.flatMap((mod) =>
      mod.features.map((feat) => ({
        module: mod.id,
        feature: feat.id,
        canRead: feat.canRead ?? false,
        canCreate: feat.canCreate ?? false,
        canUpdate: feat.canUpdate ?? false,
        canDelete: feat.canDelete ?? false,
      })),
    );

    onChange(updatedPermissions);
  };

  return (
    <div className="w-full px-5">
      {/* Table Header */}
      <div className="grid grid-cols-12 gap-4 pb-3 font-bold text-gray-700 text-sm md:text-base">
        <div className="col-span-4">Modules & Features</div>
        {PERMISSION_COLUMNS.map(({ key, label }) => (
          <div key={key} className="col-span-2 text-center">
            {label}
          </div>
        ))}
      </div>

      {modules.map((module) => (
        <div key={module.id} className="last:border-none">
          {/* Module Row */}
          <div
            onClick={() => toggleAccordion(module.id)}
            className="grid grid-cols-12 gap-4 py-4 items-center cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <div className="col-span-4 flex items-center font-semibold text-gray-800 select-none">
              <svg
                className={`w-4 h-4 mr-2 transform transition-transform text-gray-500 ${module.isOpen ? "rotate-90" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
              {module.name}
            </div>
            {PERMISSION_COLUMNS.map(({ key }) => (
              <div key={key} className="col-span-2" />
            ))}
          </div>

          {/* Features */}
          {module.isOpen && (
            <div className="bg-gray-50/50 pl-6 pb-2">
              {module.features.map((feature) => (
                <div
                  key={feature.id}
                  className="grid grid-cols-12 gap-4 py-2 items-center text-sm text-gray-600"
                >
                  <div className="col-span-4 pl-4 border-l-2">
                    {feature.name}
                  </div>

                  {PERMISSION_COLUMNS.map(({ key }) => (
                    <div key={key} className="col-span-2 text-center">
                      {feature.allowedActions.includes(key) ? (
                        <input
                          type="checkbox"
                          checked={!!feature[key]}
                          onChange={() =>
                            handleCheckboxChange(module.id, feature.id, key)
                          }
                          className="w-4 h-4 text-blue-500 rounded"
                        />
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
