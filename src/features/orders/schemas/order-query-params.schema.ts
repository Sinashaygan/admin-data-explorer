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

