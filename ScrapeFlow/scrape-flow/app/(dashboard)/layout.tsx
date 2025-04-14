import React from 'react'

function layout({children}: { children: React.ReactNode }) {
  return (
    <div className='flex h-screen'>
      <div className='flex flex-col flex-1 min-h-screen'>
        <header className='flex items-center justify-between py-4 px-6 h-[50px] shadow-md'>
            
        </header>

      </div>
    </div>
  )
}

export default layout
