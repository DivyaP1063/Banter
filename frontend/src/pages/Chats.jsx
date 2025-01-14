import React from 'react'

import Sidebar from '../components/Sidebar'
import FindAndChat from '../components/FindAndChat'
import Chat from "../components/Chat"
import { useSelector } from 'react-redux'
import Slidingdrawer from '../components/Slidingdrawer'
import Modal from '../components/Modal'
import GroupModal from '../components/GroupModal'
import DeleteGroupModal from '../components/DeleteGroupModal'



const Chats = () => {

  const user = useSelector((state) => state.user.user);

  const toSlide = useSelector((state) => state.slide.toSlide);

  const show =useSelector((state)=>state.modal.show);


  return (
    <div className='relative w-screen max-w-screen h-screen max-h-screen p-5 flex justify-between bg-blue-100 '>
        {show&&<Modal  renderGroup={<GroupModal/>} renderDeleteGroup={<DeleteGroupModal/>} />}
    <div className={`absolute top-0 left-0 transition-transform duration-500 ease-in-out`}
              style={{
            transform: toSlide ? "translateX(-100%)" : "translateX(0%)", // Toggle Slide
          }}>
    <Slidingdrawer/>
    </div>
        
      <Sidebar/>
      <FindAndChat/>
      <Chat/>
      
    </div>
  )
}

export default Chats