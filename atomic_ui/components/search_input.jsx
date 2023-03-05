import { useEffect, useRef, useState } from 'react'
import { debounce } from '../helpers'

const SearchInput = ({ onChange }) => {
  const [text, setText] = useState('')

  const debouncedOnChange = useRef(debounce(onChange, 300)).current
  useEffect(() => {
    debouncedOnChange(text)
  }, [text])

  return (
    <label className="relative flex items-center">
      <input
        type="text"
        className="py-3 px-6 bg-white rounded-full block w-full text-xl font-medium focus:outline-violet-500"
        placeholder="Type to search..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <i className="fas fa-search block absolute right-5 text-2xl text-violet-400" />
    </label>
  )
}

export default SearchInput
