import Select, { SingleValue } from 'react-select'

import Item from './Item'

export type SelectItem = { label: string; value: number; icon?: string }

type Prop = {
  selectList: SelectItem[]
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

  const handleChange = (selectedOption: SingleValue<SelectItem>) => {
    onSelected(selectedOption?.value)
  }

  const formatOptionLabel = ({ label, icon }: SelectItem) => (
    <Item size='w-4 h-4' variant='SQUARE' icon={icon} text={label} />
  )

  const NoOptionsMessage = () => {
    return <div>no_options</div>
  }

  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      borderRadius: '0.125rem',
      borderWidth: '0.125rem',
      fontSize: '0.875rem',
      outline: 'none',
      transitionDuration: '0.2s',
      backgroundColor: '#f0f4f8',
      hoverBorderColor: '#a0aec0',
      borderColor: 'transparent',
      cursor: 'pointer'
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isFocused ? '#e2e8f0' : 'white',
      color: state.isFocused ? '#1a202c' : '#4a5568',
      cursor: 'pointer',
      padding: '0.5rem 1rem'
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: '#1a202c'
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
      noOptionsMessage={NoOptionsMessage}
      isSearchable={isSearchable ?? true}
      isClearable={isClearable ?? true}
      isDisabled={isDisabled ?? false}
    />
  )
}
