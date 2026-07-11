import type { APIRoute } from "astro";
import { clearAdminCookie } from "@data/admin/client";

export const POST: APIRoute = ({ cookies, redirect }) => {
    clearAdminCookie(cookies);
    return redirect("/admin/login");
};
