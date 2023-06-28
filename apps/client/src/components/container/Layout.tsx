import Navbar from "@/components/common/Navbar"
import React, { PropsWithChildren } from "react"


export const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <main>
      <Navbar />
      <div className="max-w-8xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </main>
  )
}