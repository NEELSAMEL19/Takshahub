import React from 'react'

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between h-full px-6 bg-white">
      <div className="flex items-center space-x-4">
        <button className="lg:hidden p-2 rounded-md hover:bg-gray-100">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full hover:bg-gray-100">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10.5 17h5l-5 5v-5zM6 17h2l-2 5v-5z" />
          </svg>
        </button>
        <div className="flex items-center space-x-2 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-gray-300"></div>
          <span className="text-sm font-medium text-gray-700">Admin</span>
        </div>
      </div>
    </nav>
  )
}

export default Navbar