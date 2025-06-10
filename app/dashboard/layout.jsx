import { HeadersAdapter } from 'next/dist/server/web/spec-extension/adapters/headers'
import React from 'react'
import Header from './_components/Header'

function Dashboardlayout({children}) {
  return (
    <div>
        <Header/>
     {children}
    </div>
  )
}

export default Dashboardlayout
