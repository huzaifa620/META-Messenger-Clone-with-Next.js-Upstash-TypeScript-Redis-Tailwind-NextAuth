'use client'

import { FormEvent, useState } from 'react'
import { v4 as uuid } from 'uuid'
import { Message } from '../typings'
import useSWR from 'swr'
import fetcher from '../utils/fetchMessages'

const ChatInput = () => {

  const [input, setInput] = useState("")
  const { data: messages, error, mutate } = useSWR("/api/getMessages", fetcher)

  const addMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input) return;

    const messageToSend = input;
    setInput("");
    const id = uuid()

    const message: Message = {
      id,
      message: messageToSend,
      createdAt: Date.now(),
      username: 'Elon',
      profilePic: 'https://cdn.pixabay.com/photo/2023/01/10/07/12/cat-7709087__340.jpg',
      email: 'faghost6201@gmail.com'
    }

    const uploadMessageToUpstash = async () => {
      const data = await fetch('/api/addMessage', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({message})
      }).then(res => res.json())

      return [data.message, ...messages!]

    }
    
    await mutate(uploadMessageToUpstash, {
      optimisticData: [message, ...messages!],
      rollbackOnError: true
    })

  }

  return (
    <form onSubmit={addMessage} className='fixed bottom-0 z-50 w-full flex px-10 py-5 space-x-2 border-t bg-white border-gray-200'>
        <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder='Enter message here...' className='flex-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent px-5 py-3 disabled:opacity-50 disabled:cursor-not-allowed' />
        <button type='submit' disabled={!input} className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed'> Send </button>
    </form>
  )
}

export default ChatInput
