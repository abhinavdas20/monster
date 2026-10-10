import { NextResponse } from "next/server";
import { z } from "zod";

export async function readJson<T extends z.ZodType>(
  request: Request,
  schema: T,
): Promise<{ data: z.infer<T> } | { error: NextResponse }> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return { error: NextResponse.json({ message: "Request body must be valid JSON" }, { status: 400 }) };
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return {
      error: NextResponse.json(
        { message: "Request validation failed", issues: z.treeifyError(parsed.error) },
        { status: 400 },
      ),
    };
  }

  return { data: parsed.data };
}
