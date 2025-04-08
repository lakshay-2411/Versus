import { ZodError } from "zod";
import ejs from "ejs";
import path from "path";
import moment from "moment";

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
