import React from 'react'
import ChatInput from './ChatInput'
import MessageList from './MessageList'

const Homepage = async () => {
  const data = await fetch(`${process.env.VERCEL_URL}/api/getMessages`).then((res) => res.json())
  
  return (
    <main>
      <MessageList />
      <ChatInput />
    </main>
  )
}

export default Homepage
