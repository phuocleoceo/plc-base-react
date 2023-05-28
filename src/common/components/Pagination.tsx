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

  return (
    <div className='flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6'>
      <div>
        <p className='text-sm text-gray-700'>total has {totalRecords} results</p>
      </div>

      <ReactPaginate
        pageCount={totalPages}
        onPageChange={handlePageClick}
        breakLabel='...'
        containerClassName='flex justify-center'
        pageClassName='inline-block mx-1'
        previousLabel={
          <Icon className='text-secondary group-hover:text-white' fontSize={20} icon='fa-solid:angle-left' />
        }
        previousClassName='px-2 py-1 border rounded-lg hover:bg-gray-200'
        nextLabel={<Icon className='text-secondary group-hover:text-white' fontSize={20} icon='fa-solid:angle-right' />}
        nextClassName='px-2 py-1 border rounded-lg hover:bg-gray-200'
        activeClassName='font-bold'
        breakClassName='px-2 py-1'
        disabledClassName='opacity-50 cursor-not-allowed'
      />
    </div>
  )
}
