import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { FieldError, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { AxiosError } from 'axios'
import { useState } from 'react'

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
    register,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormData>()

  const updateProfileMutation = useMutation({
    mutationFn: (body: UpdateProfileRequest) => ProfileApi.updateProfile(body)
  })

  const handleUpdateProfile = handleSubmit(async (form: FormData) => {
    let imageUrl = ''
    try {
      const imageUploadResponse = await MediaApi.uploadFile(selectedImage)
      imageUrl = imageUploadResponse?.data.data || user?.avatar || ''
    } catch {
      imageUrl = user?.avatar || ''
    }

    const profileData: UpdateProfileRequest = {
      ...form,
      avatar: imageUrl,
      addressWardId: wardId ?? user?.addressWardId ?? 0
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

  // Address State
  const [provinceId, setProvinceId] = useState<number>()
  const [districtId, setDistrictId] = useState<number>()
  const [wardId, setWardId] = useState<number>()

  // Address Query
  const { data: provinceData } = useQuery({
    queryKey: ['provinces'],
    queryFn: () => AddressApi.getProvinces(),
    keepPreviousData: true
  })

  const provinces: SelectItem[] =
    provinceData?.data.data.map((p) => ({
      label: p.name,
      value: p.id
    })) ?? []

  const { data: districtData } = useQuery({
    queryKey: ['districts', provinceId],
    queryFn: () => AddressApi.getDistrictsOfProvince(provinceId ?? -1),
    keepPreviousData: true
  })

  const districts: SelectItem[] =
    districtData?.data.data.map((p) => ({
      label: p.name,
      value: p.id
    })) ?? []

  const { data: wardData } = useQuery({
    queryKey: ['wards', districtId],
    queryFn: () => AddressApi.getWardsOfDistrict(districtId ?? -1),
    keepPreviousData: true
  })

  const wards: SelectItem[] =
    wardData?.data.data.map((p) => ({
      label: p.name,
      value: p.id
    })) ?? []

  // Address select handler
  const handleSelectProvince = (provinceId?: number) => {
    setProvinceId(provinceId)
  }

  const handleSelectDistrict = (districtId?: number) => {
    setDistrictId(districtId)
  }

  const handleSelectWard = (wardId?: number) => {
    setWardId(wardId)
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
          <SelectBox selectList={provinces} onSelected={handleSelectProvince} className='w-full' />
        </LabelWrapper>

        <LabelWrapper label='address_district' margin='mt-1'>
          <SelectBox
            isDisabled={provinceId === undefined}
            selectList={districts}
            onSelected={handleSelectDistrict}
            className='w-full'
          />
        </LabelWrapper>

        <LabelWrapper label='address_ward' margin='mt-1'>
          <SelectBox
            isDisabled={provinceId === undefined || districtId === undefined}
            selectList={wards}
            onSelected={handleSelectWard}
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
