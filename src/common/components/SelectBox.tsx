import Select, { SingleValue } from 'react-select'
import { Controller } from 'react-hook-form'

import Item from './Item'

export type SelectItem = { label: string; value: string; icon?: string }

interface Prop {
  control?: any
  controlField?: string
  onSelected?: (selectedValue?: string) => void
  selectList: SelectItem[]
  defaultValue?: string
  isSearchable?: boolean
  isClearable?: boolean
  isDisabled?: boolean
  className?: string
}

export default function SelectBox(props: Prop) {
  const {
    control,
    controlField,
    selectList,
    defaultValue,
    isSearchable,
    isClearable,
    isDisabled,
    onSelected,
    className
  } = props

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

  return selectList.length > 0 ? (
    controlField ? (
      <Controller
        name={controlField}
        control={control}
        render={({ field: { onChange } }) => (
          <Select
            options={selectList}
            defaultValue={selectList.find((option) => option.value === defaultValue)}
            formatOptionLabel={formatOptionLabel}
            styles={customStyles}
            className={className}
            onChange={(val: SingleValue<SelectItem>) => onChange(val?.value)}
            noOptionsMessage={NoOptionsMessage}
            isSearchable={isSearchable ?? true}
            isClearable={isClearable ?? true}
            isDisabled={isDisabled ?? false}
          />
        )}
        rules={{ required: true }}
      />
    ) : onSelected ? (
      <Select
        options={selectList}
        defaultValue={selectList.find((option) => option.value === defaultValue)}
        formatOptionLabel={formatOptionLabel}
        styles={customStyles}
        className={className}
        onChange={(val: SingleValue<SelectItem>) => onSelected(val?.value)}
        noOptionsMessage={NoOptionsMessage}
        isSearchable={isSearchable ?? true}
        isClearable={isClearable ?? true}
        isDisabled={isDisabled ?? false}
      />
    ) : null
  ) : null
}
