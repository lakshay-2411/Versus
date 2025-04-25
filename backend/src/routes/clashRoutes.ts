import { Router, Request, Response } from "express";
import { ZodError } from "zod";
import { formatError, imageValidator, removeFile, uploadFile } from "../helper";
import { clashSchema } from "../validation/clashValidation";
import { FileArray, UploadedFile } from "express-fileupload";
import prisma from "../config/database";
import authMiddleware from "../middleware/AuthMiddleware";
import { count } from "console";

const router = Router();

router.get("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const clash = await prisma.clash.findMany({
      where: {
        user_Id: req.user?.id!,
      },
      orderBy: {
        id: "desc",
      },
    });
    res.json({ message: "Clashes fetched successfully.", data: clash });
  } catch (error) {
    if (error instanceof ZodError) {
      const errors = formatError(error);
      res.status(422).json({ message: "Invalid data", errors });
      return;
    }
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
    return;
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const clash = await prisma.clash.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        ClashItem: {
          select: {
            image: true,
            id: true,
            count: true,
          },
        },
        ClashComments: {
          select: {
            id: true,
            comment: true,
            created_at: true,
          },
          orderBy: {
            id: "desc",
          },
        },
      },
    });
    res.json({ message: "Clash fetched successfully.", data: clash });
  } catch (error) {
    if (error instanceof ZodError) {
      const errors = formatError(error);
      res.status(422).json({ message: "Invalid data", errors });
      return;
    }
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
    return;
  }
});

router.post("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const payload = clashSchema.parse(body);

    // check if files are present in the request
    if (req.files?.image) {
      const image = req.files?.image as UploadedFile;
      const validMsg = imageValidator(image.size, image.mimetype);
      if (validMsg) {
        res.status(422).json({ errors: { image: validMsg } });
        return;
      }
      payload.image = await uploadFile(image);
    } else {
      res.status(422).json({ errors: { image: "Image field is required." } });
    }

    await prisma.clash.create({
      data: {
        ...payload,
        user_Id: req.user?.id!,
        expire_at: new Date(payload.expire_at),
        image: payload.image!,
      },
    });
    res.json({ message: "Clash created successfully." });
  } catch (error) {
    if (error instanceof ZodError) {
      const errors = formatError(error);
      res.status(422).json({ message: "Invalid data", errors });
      return;
    }
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
    return;
  }
});

router.put("/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const payload = clashSchema.parse(body);

    // check if files are present in the request
    if (req.files?.image) {
      const image = req.files?.image as UploadedFile;
      const validMsg = imageValidator(image.size, image.mimetype);
      if (validMsg) {
        res.status(422).json({ errors: { image: validMsg } });
        return;
      }

      // remove old image if exists
      const clash = await prisma.clash.findUnique({
        select: {
          image: true,
          id: true,
        },
        where: {
          id: Number(id),
        },
      });
      if (clash) removeFile(clash?.image!);
      payload.image = await uploadFile(image);
    }

    await prisma.clash.update({
      where: {
        id: Number(id),
      },
      data: {
        ...payload,
        expire_at: new Date(payload.expire_at),
      },
    });
    res.json({ message: "Clash updated successfully." });
  } catch (error) {
    if (error instanceof ZodError) {
      const errors = formatError(error);
      res.status(422).json({ message: "Invalid data", errors });
      return;
    }
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
    return;
  }
});

router.delete("/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // remove image
    const clash = await prisma.clash.findUnique({
      select: {
        image: true,
        id: true,
      },
      where: {
        id: Number(id),
      },
    });
    if (clash) removeFile(clash?.image!);
    await prisma.clash.delete({
      where: {
        id: Number(id),
      },
    });
    res.json({ message: "Clash deleted successfully." });
  } catch (error) {
    if (error instanceof ZodError) {
      const errors = formatError(error);
      res.status(422).json({ message: "Invalid data", errors });
      return;
    }
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
    return;
  }
});

// Versus items route
router.post("/items", authMiddleware, async (req: Request, res: Response) => {
  const { id } = req.body;
  const files: FileArray | null | undefined = req.files;
  let imgErrors: Array<string> = [];
  const images = files?.["images[]"] as UploadedFile[];
  if (images.length >= 2) {
    // Check validations
    images.map((img) => {
      const validMsg = imageValidator(img?.size, img?.mimetype);
      if (validMsg) imgErrors.push(validMsg);
    });
    if (imgErrors.length > 0) {
      res.status(422).json({ errors: imgErrors });
      return;
    }

    // Upload images
    let uploadedImages: string[] = [];
    images.map((img) => {
      uploadedImages.push(uploadFile(img));
    });

    uploadedImages.map(async (item) => {
      await prisma.versusItem.create({
        data: {
          image: item,
          clash_Id: Number(id),
        },
      });
    });
    res.json({ message: "Versus items created successfully." });
  } else {
    res
      .status(422)
      .json({ errors: ["Select atleast 2 images for having a Versus!"] });
    return;
  }
});

export default router;
