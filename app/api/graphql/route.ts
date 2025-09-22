import { NextRequest, NextResponse } from "next/server";
import { serverClient } from "@/lib/server/server-client";
import { parse } from "graphql";

const allowedOrigin = "https://www.assist-rm.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": allowedOrigin,
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  // Handle preflight requests
  return NextResponse.json(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function POST(request: NextRequest) {
  const { query, variables } = await request.json();

  try {
    let result;
    if (query.trim().startsWith("mutation")) {
      // handle mutation
      result = await serverClient.mutate({
        mutation: parse(query),
        variables,
      });
    } else {
      // handle queries
      result = await serverClient.query({
        query: parse(query),
        variables,
      });
    }

    const data = result.data;
    return NextResponse.json(
      {
        data,
      },
      {
        headers: corsHeaders,
      }
    );
  } catch (error) {
    console.log(error, "error");
    return NextResponse.json(error, {
      status: 500,
      headers: corsHeaders,
    });
  }
}
