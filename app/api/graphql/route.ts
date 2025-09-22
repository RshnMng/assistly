// import { NextRequest, NextResponse } from "next/server";
// import { serverClient } from "@/lib/server/server-client";
// import { parse } from "graphql";

// export async function OPTIONS() {
//   console.log("OPTIONS request received and gere ut us");
//   const allowedOrigin = "https://www.assist-rm.com";

//   const corsHeaders = {
//     "Access-Control-Allow-Origin": allowedOrigin,
//     "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
//     "Access-Control-Allow-Headers": "Content-Type, Authorization",
//   };

//   const response = new NextResponse(null, { status: 204 });
//   Object.entries(corsHeaders).forEach(([key, value]) => {
//     response.headers.set(key, value);
//   });

//   return response;
// }

// export async function POST(request: NextRequest) {
//   const { query, variables } = await request.json();

//   const allowedOrigin = "https://www.assist-rm.com";

//   const corsHeaders = {
//     "Access-Control-Allow-Origin": allowedOrigin,
//     "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
//     "Access-Control-Allow-Headers": "Content-Type, Authorization",
//   };

//   try {
//     let result;
//     if (query.trim().startsWith("mutation")) {
//       // handle mutation
//       result = await serverClient.mutate({
//         mutation: parse(query),
//         variables,
//       });
//     } else {
//       // handle queries
//       result = await serverClient.query({
//         query: parse(query),
//         variables,
//       });
//     }

//     const data = result.data;
//     return NextResponse.json(
//       {
//         data,
//       },
//       {
//         headers: corsHeaders,
//       }
//     );
//   } catch (error) {
//     console.log(error, "error");
//     return NextResponse.json(error, {
//       status: 500,
//       headers: corsHeaders,
//     });
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import { serverClient } from "@/lib/server/server-client";
import { parse } from "graphql";

const allowedOrigin = "https://www.assist-rm.com"; // ✅ Set your frontend domain here

const corsHeaders = {
  "Access-Control-Allow-Origin": allowedOrigin,
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Preflight request handler (CORS)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

// GraphQL POST request handler
export async function POST(request: NextRequest) {
  try {
    const { query, variables } = await request.json();

    const isMutation = query.trim().startsWith("mutation");

    const result = isMutation
      ? await serverClient.mutate({ mutation: parse(query), variables })
      : await serverClient.query({ query: parse(query), variables });

    return new NextResponse(JSON.stringify({ data: result.data }), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error: any) {
    console.error("GraphQL Error:", error);

    return new NextResponse(
      JSON.stringify({
        error: {
          message: error?.message || "Unexpected error",
        },
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
}
