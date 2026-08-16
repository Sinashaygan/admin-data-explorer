import { z } from "zod";

import {
  ORDER_PAGE_SIZES,
  ORDER_SORT_FIELDS,
  ORDER_STATUSES,
} from "../model/order.constants";
import { DEFAULT_ORDER_FILTERS } from "../model/order.defaults";

const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .optional()
  .catch(undefined);

const statusArraySchema = z.preprocess(
  (value) => {
    if (Array.isArray(value)) {
      return value.flatMap((item) =>
        typeof item === "string" ? item.split(",") : [],
      );
    }

    if (typeof value === "string") {
      return value.split(",");
    }

    return [];
  },
  z.array(z.enum(ORDER_STATUSES)).catch([]),
);

export const orderQueryParamsSchema = z
  .object({
    page: z.coerce.number().int().min(0).catch(DEFAULT_ORDER_FILTERS.page),

    pageSize: z.coerce
      .number()
      .refine((value) =>
        (ORDER_PAGE_SIZES as readonly number[]).includes(value),
      )
      .catch(DEFAULT_ORDER_FILTERS.pageSize),

    search: z.string().trim().max(120).catch(DEFAULT_ORDER_FILTERS.search),

    status: statusArraySchema,

    startDate: dateSchema,
    endDate: dateSchema,

    sortBy: z.enum(ORDER_SORT_FIELDS).catch(DEFAULT_ORDER_FILTERS.sortBy),

    sortOrder: z.enum(["asc", "desc"]).catch(DEFAULT_ORDER_FILTERS.sortOrder),
  })
  .superRefine((value, context) => {
    if (value.startDate && value.endDate && value.startDate > value.endDate) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endDate"],
        message: "End date must be after start date",
      });
    }
  })
  .catch(DEFAULT_ORDER_FILTERS);

export type OrderQueryParams = z.infer<typeof orderQueryParamsSchema>;
