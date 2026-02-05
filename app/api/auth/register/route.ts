import { NextRequest, NextResponse } from "next/server";
import { api } from "../../api";
import { isAxiosError } from "axios";
import { logErrorResponse } from "../../_utils/utils";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const apiRes = await api.post("/auth/register", body);

    const setCookie = apiRes.headers["set-cookie"];
    const res = NextResponse.json(apiRes.data, { status: apiRes.status });

    if (setCookie) {
      const cookiesArr = Array.isArray(setCookie) ? setCookie : [setCookie];
      for (const c of cookiesArr) {
        res.headers.append("Set-Cookie", c);
      }
    }

    return res;
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      return NextResponse.json(
        { error: error.message, response: error.response?.data },
        { status: error.response?.status ?? 500 }
      );
    }

    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
