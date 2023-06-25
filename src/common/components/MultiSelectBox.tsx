import Select, { SingleValue } from 'react-select'
import { Controller } from 'react-hook-form'

import { TranslateHelper } from '~/shared/helpers'
import { SelectItem } from '~/shared/types'
import Item from './Item'

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

export default function MultiSelectBox(props: Prop) {
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
    <Item size='w-4 h-4' variant='SQUARE' icon={icon} text={TranslateHelper.translate(label)} />
  )

  const NoOptionsMessage = () => {
    return <div>{TranslateHelper.translate('no_options')}</div>
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

  const SelectComponent = (onChange: any) => (
    <Select
      options={selectList}
      defaultValue={selectList.find((option) => option.value === defaultValue)}
      formatOptionLabel={formatOptionLabel}
      styles={customStyles}
      className={className}
      onChange={onChange}
      noOptionsMessage={NoOptionsMessage}
      isSearchable={isSearchable ?? true}
      isClearable={isClearable ?? true}
      isDisabled={isDisabled ?? false}
    />
  )

  return selectList.length > 0 ? (
    controlField ? (
      <Controller
        name={controlField}
        control={control}
        defaultValue={defaultValue}
        render={({ field: { onChange } }) => SelectComponent((val: SingleValue<SelectItem>) => onChange(val?.value))}
        rules={{ required: true }}
      />
    ) : onSelected ? (
      SelectComponent((val: SingleValue<SelectItem>) => onSelected(val?.value))
    ) : null
  ) : null
}
