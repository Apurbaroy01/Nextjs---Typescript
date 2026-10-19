import { Navbar } from '@/components/navbar'
import { getMe } from '@/services/getme';
import React from 'react'

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const data = await getMe();
  console.log(data)
  return (
    <div className="h-full">
      <Navbar data={data}/>
      <div className='max-w-7xl mx-auto mt-2 px-4 flex-1'>
        {children}
      </div>
    </div>
  )
}

export default DashboardLayout
