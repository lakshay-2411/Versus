import { ZodError } from "zod";
import ejs from "ejs";
import path from "path";
import moment from "moment";
import { supportMimes } from "./config/fileSystem";
import { UploadedFile } from "express-fileupload";
import { v4 as uuidV4 } from "uuid";
import fs from "fs";

export const formatError = (error: ZodError): any => {
  let errors: any = {};
  error.errors?.map((issue) => {
    errors[issue.path[0]] = issue.message;
  });
  return errors;
};

export const renderEmailEjs = async (
  fileName: string,
  payload: any
): Promise<string> => {
  const filePath = path.join(__dirname, "views", "emails", `${fileName}.ejs`);
  const html: string = await ejs.renderFile(filePath, payload);
  return html;
};

export const checkDateHourDiff = (date: Date | string): number => {
  const now = moment();
  const tokenSendAt = moment(date);
  const diff = moment.duration(now.diff(tokenSendAt));
  return diff.asHours();
};

export const imageValidator = (size: number, mime: string): string | null => {
  if (bytesToMB(size) > 4) {
    return "File size should be less than 4MB";
  } else if (!supportMimes.includes(mime)) {
    return "File type not supported";
  }
  return null;
};

export const bytesToMB = (bytes: number): number => {
  return bytes / (1024 * 1024);
};

export const uploadFile = (image: UploadedFile) => {
  const fileExt = image?.name.split(".");
  const fileName = uuidV4() + "." + fileExt[1];
  const uploadPath = process.cwd() + "/public/images/" + fileName;
  image.mv(uploadPath, (err) => {
    if (err) throw err;
  });
  return fileName;
};

export const removeFile = async (fileName: string) => {
  const path = process.cwd() + "/public/images/" + fileName;
  if (fs.existsSync(path)) {
    fs.unlinkSync(path);
  }
};
