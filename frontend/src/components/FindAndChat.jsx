import React from 'react'

import Search from './Search'
import Groups from './Groups'
import People from './People'
import CreateGroup from "./CreateGroup"

const FindAndChat = ({handler}) => {
  return (
    <div className='flex flex-col justify-between items-center h-full w-[25%]'>
        <Search/>
        {/* <Groups/> */}
        <CreateGroup handler={handler}/>
        <People/>
    </div>
  )
}

export default FindAndChat