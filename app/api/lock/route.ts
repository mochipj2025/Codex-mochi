import {NextResponse} from "next/server";
export async function POST(request:Request){const response=NextResponse.redirect(new URL("/skills",request.url),303);response.cookies.set("skill_access","",{httpOnly:true,secure:true,sameSite:"lax",path:"/",maxAge:0});return response}
