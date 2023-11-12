import {
  config,
  fields,
  collection,
  type LocalConfig,
  type GitHubConfig,
} from "@keystatic/core";

const storage: LocalConfig["storage"] | GitHubConfig["storage"] =
  process.env.NODE_ENV === "development"
    ? { kind: "local" }
    : {
        kind: "github",
        repo: {
          owner: "zakiego",
          name: "ramadan-countdown",
        },
      };

export const keystaticConfig = config({
  storage: {
    kind: "local",
  },
  collections: {
    ramadan: collection({
      label: "Ramadan",
      slugField: "year",
      path: "public/content/ramadan/*",
      format: { data: "json" },
      schema: {
        year: fields.slug({ name: { label: "Ramadan Year" } }),
        ramadanStart: fields.date({
          label: "Ramadan Start",
          validation: {
            isRequired: true,
          },
        }),
        ramadanEnd: fields.date({
          label: "Ramadan End",
          validation: {
            isRequired: true,
          },
        }),
        eidAlFitr: fields.date({
          label: "Eid Al-Fitr",
          validation: {
            isRequired: true,
          },
        }),
        notes: fields.document({
          label: "Notes",
          formatting: true,
          links: true,
          images: true,
        }),
      },
    }),
  },
});
