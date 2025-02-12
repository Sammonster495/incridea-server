/* eslint-disable @typescript-eslint/only-throw-error */
import {
  createUploadthing,
  UTFiles,
  type FileRouter,
} from "uploadthing/express";
import { authenticateUser } from "~/uploadthing/authenticateUser";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const uploadRouter = {
  asset: f({
    image: {
      maxFileCount: 50,
      maxFileSize: "64MB",
    },
    video: {
      maxFileCount: 50,
      maxFileSize: "64MB",
    },
    "model/gltf-binary": {
      maxFileCount: 50,
      maxFileSize: "64MB",
    },
  })
    .middleware(async ({ req, res, files }) => {
      const user = await authenticateUser(req, res);
      if (!user || user.role !== "ADMIN")
        throw new UploadThingError({
          message: "Unauthorized",
          code: "FORBIDDEN",
        });
      const customId = req.headers.custom_id as string | undefined;
      return {
        [UTFiles]: files.map((file) => ({
          ...file,
          ...(customId ? {
            customId: customId.replace(/[\s\\/]/g, "_"),
          } : {
            customId: file.name + "_" + file.lastModified
          })
        })),
      };
    })
    .onUploadError((error) => {
      console.error("Error uploading asset:", error);
    })
    .onUploadComplete((data) => {
      console.log("Gallery Image:", data.file.url);
    }),

  event: f({
    image: {
      maxFileCount: 1,
      maxFileSize: "512KB",
    },
  })
    .middleware(async ({ req, res, files }) => {
      const user = await authenticateUser(req, res);
      if (!user || (user.role !== "ADMIN" && user.role !== "ORGANIZER"))
        throw new UploadThingError({
          message: "Unauthorized",
          code: "FORBIDDEN",
        });
      const customId = req.headers.custom_id as string | undefined;
      return {
        [UTFiles]: files.map((file) => ({
          ...file,
          ...(customId ? {
            customId: customId.replace(/[\s\\/]/g, "_"),
          } : {
            customId: file.name + "_" + file.lastModified
          })
        })),
      };
    })
    .onUploadError((error) => {
      console.error("Error uploading asset:", error);
    })
    .onUploadComplete((data) => {
      console.log("Event Image:", data.file.url);
    }),

  quiz: f({
    image: {
      maxFileCount: 1,
      maxFileSize: "512KB",
    },
  })
    .middleware(async ({ req, res, files }) => {
      const user = await authenticateUser(req, res);
      if (!user || (user.role !== "ADMIN" && user.role !== "ORGANIZER"))
        throw new UploadThingError({
          message: "Unauthorized",
          code: "FORBIDDEN",
        });
      const customId = req.headers.custom_id as string | undefined;
      return {
        [UTFiles]: files.map((file) => ({
          ...file,
          ...(customId ? {
            customId: customId.replace(/[\s\\/]/g, "_"),
          } : {
            customId: file.name + "_" + file.lastModified
          })
        })),
      };
    })
    .onUploadError((error) => {
      console.error("Error uploading asset:", error);
    })
    .onUploadComplete((data) => {
      console.log("Question Image:", data.file.url);
    }),

  accommodation: f({
    image: {
      maxFileCount: 1,
      maxFileSize: "512KB",
    },
  })
    .middleware(async ({ req, res, files }) => {
      const user = await authenticateUser(req, res);
      if (!user)
        throw new UploadThingError({
          message: "Unauthorized",
          code: "FORBIDDEN",
        });
      const customId = req.headers.custom_id as string | undefined;
      return {
        [UTFiles]: files.map((file) => ({
          ...file,
          ...(customId ? {
            customId: customId.replace(/[\s\\/]/g, "_"),
          } : {
            customId: file.name + "_" + file.lastModified
          })
        })),
      };
    })
    .onUploadError((error) => {
      console.error("Error uploading asset:", error);
    })
    .onUploadComplete((data) => {
      console.log("Accomodation Image:", data.file.url);
    }),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;
