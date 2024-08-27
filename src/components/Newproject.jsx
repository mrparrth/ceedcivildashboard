// import React from 'react'
import ProjectDetails from './ProjectDetails';

const Newproject = () => {
  return (
    <div className="flex flex-nowrap dashboard-container min-h-[700px] h-100">
    <div className="flex-1 p-6 pl-10" style={{ paddingLeft: '100px', marginLeft: '100px' }}>
      {/*------------------- Dashboard Table start------------------ */}
      <div className="container mx-auto mt-4">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-800 text-white text-[15px] h-[50px]">
            <tr>
              <th className="px-4 py-2 text-center">New Project</th>
            </tr>
          </thead>
          <tbody className="px-4 py-2 text-center">

          < ProjectDetails />            
          </tbody>
        </table>
      </div>
    </div>
    
  </div>
  )
}

export default Newproject
