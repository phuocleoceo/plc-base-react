import { useState } from 'react'

import Item from './Item'

export type Category = { text: string; icon?: string; value: number }

type Prop = {
  selectList: Category[]
  defaultValue?: number
  onSelected: (selectedValue: number) => void
  className?: string
}

export default function SelectBox(props: Prop) {
  const { selectList, defaultValue, onSelected, className } = props

  const getTextByValue = (value: number | undefined) => {
    if (!value) return ''

    const selectedOption = selectList.find((option) => option.value === value)
    return selectedOption?.text ?? ''
  }

  const [selectedValue, setSelectedValue] = useState<number>(defaultValue)

  const handleSelectChange = (event: any) => {
    const value = event.target.value
    setSelectedValue(value)
    onSelected(value)
  }

  return (
    <div className='relative inline-block w-full'>
      <select
        value={selectedValue}
        onChange={handleSelectChange}
        className={`appearance-none border-gray-300 bg-[#edf2f7] px-4 py-1 tracking-wide hover:bg-[#e2e8f0] 'rounded-[4px] border-[1px]' ${
          className ?? 'w-full sm:max-w-fit'
        }`}
      >
        <option value=''>select_an_option</option>

        {selectList.map((option) => (
          <option key={option.value} value={option.value}>
            <Item size='w-4 h-4' variant='SQUARE' text={option.text} />
          </option>
        ))}
      </select>

      <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700'>
        <svg className='fill-current h-4 w-4' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'>
          <path d='M10 12l-6-6h12l-6 6z' />
        </svg>
      </div>
    </div>

    // <div className='relative text-[15px] font-medium text-black'>
    //   <div
    //     role='button'
    //     tabIndex={0}
    //     onKeyDown={(event) => {
    //       if (event.key === 'Enter') toggle()
    //     }}
    //     onClick={toggle}
    // className={`flex items-center justify-between border-gray-300 bg-[#edf2f7] px-4 py-1 tracking-wide hover:bg-[#e2e8f0] 'rounded-[4px] border-[1px]' ${
    //   className ?? 'w-full sm:max-w-fit'
    // }`}
    //   >
    //     <div className='flex flex-wrap gap-2'>
    //       <Item size='h-4 w-4' text={getTextByValue(defaultValue)} />
    //     </div>
    //     <Icon className='ml-3' icon='la:angle-down' />
    //   </div>

    //   {isShowing && (
    //     <ul className='absolute bottom-0 z-10 w-full translate-y-[calc(100%+5px)] rounded-[3px] bg-white py-2 shadow-md'>
    //       {selectList.length > 0 ? (
    //         selectList.map((props, idx) => (
    //           // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    //           <li
    //             className='cursor-pointer px-4 py-2 hover:bg-[#e2e8f0]'
    //             onClick={() => handleClickOption(idx)}
    //             onKeyDown={(event) => {
    //               if (event.key === 'Enter') toggle()
    //             }}
    //             key={idx}
    //           >
    //             <Item size='w-4 h-4' variant='SQUARE' text={selectList[idx].text} />
    //           </li>
    //         ))
    //       ) : (
    //         <span className='my-2 block text-center'>no_options</span>
    //       )}
    //     </ul>
    //   )}
    // </div>
  )
}
