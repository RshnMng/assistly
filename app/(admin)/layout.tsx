import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userId } = await auth();

  if (!userId) {
    return redirect(`/login`);
  }

  return (
    <div className="flex flex-col flex-1 bg-purple-500">
      <Header />
      <div className="flex flex-col flex-1 md:flex-row bg-teal-500">
        {/* Sidebar */}
        <Sidebar />

        <div className="flex-1 flex justify-center lg:justify-start items-start max-w-5xl mx-auto w-full bg-orange-500">
          {/* Sidebar content */}

          {children}
        </div>
      </div>
    </div>
  );
}
export default AdminLayout;
