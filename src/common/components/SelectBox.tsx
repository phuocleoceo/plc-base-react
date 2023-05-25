import Select, { SingleValue } from 'react-select'

import Item from './Item'

export type Category = { label: string; value: number; icon?: string }

type Prop = {
  selectList: Category[]
  defaultValue?: number
  isSearchable?: boolean
  isClearable?: boolean
  isDisabled?: boolean
  onSelected: (selectedValue?: number) => void
  className?: string
}

export default function SelectBox(props: Prop) {
  const { selectList, defaultValue, isSearchable, isClearable, isDisabled, onSelected, className } = props

  const getDefaultOption = () => {
    return selectList.find((option) => option.value === defaultValue)
  }

  const handleChange = (selectedOption: SingleValue<Category>) => {
    onSelected(selectedOption?.value)
  }

  const formatOptionLabel = ({ label, icon }: Category) => (
    <div style={{ display: 'flex' }}>
      <Item size='w-4 h-4' variant='SQUARE' icon={icon} text={label} />
    </div>
  )

  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      borderRadius: '3px'
    }),
    option: (provided: any) => ({
      ...provided,
      display: 'flex',
      alignItems: 'center'
    })
  }

  return (
    <Select
      options={selectList}
      defaultValue={getDefaultOption()}
      formatOptionLabel={formatOptionLabel}
      styles={customStyles}
      onChange={handleChange}
      className={className}
      isSearchable={isSearchable ?? true}
      isClearable={isClearable ?? true}
      isDisabled={isDisabled ?? false}
    />
  )
}
