import { ReactNode } from "react"


function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
       {/* Header */}

       <div>
        {/* Sidebar */}

            <div>
                {/* Sidebar content */}

                {children}
            </div>

       </div>
    </div>
  )
}
export default AdminLayout