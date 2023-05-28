import ReactPaginate from 'react-paginate'
import { Icon } from '@iconify/react'

interface Props {
  pageSize: number
  totalRecords: number
  onChangePage: (newPage: number) => void
}

export default function Pagination(props: Props) {
  const { pageSize, totalRecords, onChangePage } = props

  const totalPages = Math.ceil(totalRecords / pageSize)

  const handlePageClick = (selectedItem: { selected: number }) => {
    onChangePage(selectedItem.selected + 1)
  }

  if (totalRecords === 0) return null

  return (
    <div className='flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6'>
      <div>
        <p className='text-black'>total has {totalRecords} results</p>
      </div>

      <ReactPaginate
        pageCount={totalPages}
        onPageChange={handlePageClick}
        breakLabel='...'
        breakClassName='px-2 py-1'
        containerClassName='flex justify-center'
        pageClassName='mx-2 mt-1'
        previousLabel={
          <Icon className='text-secondary group-hover:text-white' fontSize={20} icon='fa-solid:angle-left' />
        }
        previousClassName='px-2 py-1 border rounded-lg hover:bg-gray-200'
        nextLabel={<Icon className='text-secondary group-hover:text-white' fontSize={20} icon='fa-solid:angle-right' />}
        nextClassName='px-2 py-1 border rounded-lg hover:bg-gray-200'
        activeClassName='font-bold text-chakra-blue'
        disabledClassName='opacity-50 cursor-not-allowed'
        renderOnZeroPageCount={null}
      />
    </div>
  )
}
