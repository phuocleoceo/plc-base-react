import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FieldError, useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { AxiosError } from 'axios'

import { ImageUpload, InputValidation, LabelWrapper, SelectBox } from '~/common/components'
import { UserProfileType, UpdateProfileRequest } from '~/features/profile/models'
import { SelectItem } from '~/common/components/SelectBox'
import { AddressApi } from '~/features/address/apis'
import { ProfileApi } from '~/features/profile/apis'
import { ValidationHelper } from '~/shared/helpers'
import { MediaApi } from '~/features/media/apis'
import { ProfileTab } from '~/shared/enums'

interface Props {
  user?: UserProfileType
  onChangeTab: (newTab: ProfileTab) => void
}

type FormData = Pick<UpdateProfileRequest, 'displayName' | 'phoneNumber' | 'address' | 'addressWardId'>

export default function UpdateProfile(props: Props) {
  const { user, onChangeTab } = props
  const [selectedImage, setSelectedImage] = useState<File>()

  const queryClient = useQueryClient()

  const {
    reset,
    control,
    register,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormData>()

  const updateProfileMutation = useMutation({
    mutationFn: (body: UpdateProfileRequest) => ProfileApi.updateProfile(body)
  })

  const handleUpdateProfile = handleSubmit(async (form: FormData) => {
    console.log(form)
    let imageUrl = ''
    try {
      const imageUploadResponse = await MediaApi.uploadFile(selectedImage)
      imageUrl = imageUploadResponse?.data.data || user?.avatar || ''
    } catch {
      imageUrl = user?.avatar || ''
    }

    const profileData: UpdateProfileRequest = {
      ...form,
      avatar: imageUrl
    }

    updateProfileMutation.mutate(profileData, {
      onSuccess: () => {
        toast.success('update_profile_success')
        queryClient.invalidateQueries(['profile'])
        reset()
        onChangeTab(ProfileTab.ProfileDetail)
      },
      onError: (error) => {
        const validateErrors = ValidationHelper.getErrorFromServer(error as AxiosError)
        Object.keys(validateErrors).forEach((key) => {
          setError(key as keyof FormData, validateErrors[key])
        })
      }
    })
  })

  const handleSelectImage = async (image: File) => {
    setSelectedImage(image)
  }

  // Address
  const [provinceId, setProvinceId] = useState<number | undefined>(user?.addressProvinceId)
  const [districtId, setDistrictId] = useState<number | undefined>(user?.addressDistrictId)
  const [provinces, setProvinces] = useState<SelectItem[]>([])
  const [districts, setDistricts] = useState<SelectItem[]>([])
  const [wards, setWards] = useState<SelectItem[]>([])

  useEffect(() => {
    const getProvinces = async () => {
      const provinceData = await AddressApi.getProvinces()
      setProvinces(
        provinceData.data.data.map((p) => ({
          label: p.name,
          value: p.id.toString()
        }))
      )
    }
    getProvinces()
  }, [])

  useEffect(() => {
    const getDistricts = async () => {
      const districtData = await AddressApi.getDistrictsOfProvince(provinceId ?? -1)
      setDistricts(
        districtData.data.data.map((p) => ({
          label: p.name,
          value: p.id.toString()
        }))
      )
    }
    getDistricts()
  }, [provinceId])

  useEffect(() => {
    const getWards = async () => {
      const wardData = await AddressApi.getWardsOfDistrict(districtId ?? -1)
      setWards(
        wardData.data.data.map((p) => ({
          label: p.name,
          value: p.id.toString()
        })) ?? []
      )
    }
    getWards()
  }, [districtId])

  // Address select handler
  const handleSelectProvince = (provinceId?: string) => {
    setProvinceId(parseInt(provinceId ?? ''))
  }

  const handleSelectDistrict = (districtId?: string) => {
    setDistrictId(parseInt(districtId ?? ''))
  }

  return (
    <form onSubmit={handleUpdateProfile}>
      <div>
        <ImageUpload originImage={user?.avatar} onSelectedImage={handleSelectImage} />
      </div>

      <div className='mt-5 ml-2 flex w-[16.5rem] flex-col gap-4'>
        <InputValidation
          label='display_name'
          defaultValue={user?.displayName}
          placeholder='enter_display_name...'
          register={register('displayName', {
            required: {
              value: true,
              message: 'display_name_required'
            }
          })}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          error={errors.displayName as FieldError}
        />

        <InputValidation
          label='phone_number'
          defaultValue={user?.phoneNumber}
          placeholder='enter_phone_number...'
          register={register('phoneNumber', {
            required: {
              value: true,
              message: 'phone_number_required'
            }
          })}
          error={errors.phoneNumber as FieldError}
        />

        <InputValidation
          label='address'
          defaultValue={user?.address}
          placeholder='enter_address...'
          register={register('address', {
            required: {
              value: true,
              message: 'address_required'
            }
          })}
          error={errors.address as FieldError}
        />

        <LabelWrapper label='address_province' margin='mt-1'>
          <SelectBox
            selectList={provinces}
            onSelected={handleSelectProvince}
            defaultValue={user?.addressProvinceId.toString()}
            className='w-full'
          />
        </LabelWrapper>

        <LabelWrapper label='address_district' margin='mt-1'>
          <SelectBox
            isDisabled={provinceId === undefined}
            selectList={districts}
            onSelected={handleSelectDistrict}
            defaultValue={user?.addressDistrictId.toString()}
            className='w-full'
          />
        </LabelWrapper>

        <LabelWrapper label='address_ward' margin='mt-1'>
          <SelectBox
            control={control}
            controlField='addressWardId'
            isDisabled={provinceId === undefined || districtId === undefined}
            selectList={wards}
            defaultValue={user?.addressWardId.toString()}
            className='w-full'
          />
        </LabelWrapper>
      </div>

      <div className='mt-5 text-center'>
        <button type='submit' className='btn w-40'>
          {isSubmitting ? 'updating_profile...' : 'update_profile'}
        </button>
        <button onClick={() => onChangeTab(ProfileTab.ProfileDetail)} className='mt-3 btn w-40'>
          go_back
        </button>
      </div>
    </form>
  )
}
