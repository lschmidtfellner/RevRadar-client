import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { AuthContext } from '../context/AuthContextComponent'
import Swal from 'sweetalert2'
import { useLocation } from 'react-router-dom'
import { CarContext } from '../components/CarContextProvider'

function UpdateListing() {
  const { user } = useContext(AuthContext)
  const { cars } = useContext(CarContext)

  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const selectedCarId = queryParams.get('id')

  const [carToUpdate, setCarToUpdate] = useState(null)

  const [makeList, setMakeList] = useState([])
  const [makeId, setMakeId] = useState('')

  const [modelList, setModelList] = useState([])
  const [modelId, setModelId] = useState('')

  const [yearList, setYearList] = useState([])
  const [yearId, setYearId] = useState('')

  const [mileageBody, setMileageBody] = useState('')

  const [descriptionBody, setDescriptionBody] = useState('')

  const [carCategory, setCarCategory] = useState('')

  const [selectedImages, setSelectedImages] = useState([])

  useEffect(() => {
    const car = cars.find((car) => car._id === selectedCarId)
    setCarToUpdate(car)
    setCarCategory(carToUpdate?.Category)
  })

  useEffect(() => {
    let ignore = false
    axios
      .get(
        'https://luke-used-cars-backend-19ea42e37e12.herokuapp.com/api/carinfo'
      )
      .then((response) => {
        if (!ignore) {
          console.log('fetched list of makes')
          const makes = response.data
            .map((car) => car.Make)
            .filter((make, index, array) => array.indexOf(make) === index)
          setMakeList(makes)
          setMakeId(carToUpdate?.Make)
        }
      })
    return () => {
      ignore = true
    }
  }, [])

  useEffect(() => {
    let ignore = false
    if (makeId !== '') {
      axios
        .get(
          `https://luke-used-cars-backend-19ea42e37e12.herokuapp.com/api/carinfo/search?Make=${makeId}`
        )
        .then((response) => {
          if (!ignore) {
            console.log('fetched list of models')

            const models = response.data
              .map((car) => car.Model)
              .filter((model, index, array) => array.indexOf(model) === index)
            setModelList(models)
            setModelId(carToUpdate.Model)
          }
        })

      return () => {
        ignore = true
      }
    }
  }, [makeId, carToUpdate])

  useEffect(() => {
    let ignore = false
    if (modelId !== '') {
      axios
        .get(
          `https://luke-used-cars-backend-19ea42e37e12.herokuapp.com/api/carinfo/search?Make=${makeId}&Model=${modelId}`
        )
        .then((response) => {
          if (!ignore) {
            console.log('fetched list of years')
            const years = response.data
              .map((car) => car.Year)
              .filter((year, index, array) => array.indexOf(year) === index)
            setYearList(years)
            setYearId(carToUpdate.Year)
          }
        })
      return () => {
        ignore = true
      }
    }
  }, [makeId, modelId, carToUpdate])

  const handleImageUpload = (e) => {
    const uploadedImages = Array.from(e.target.files)
    setSelectedImages(uploadedImages)
    console.log('Selected Images:', uploadedImages)
  }

  useEffect(() => {
    console.log('Selected Images:', selectedImages)
  }, [selectedImages])

  useEffect(() => {

  })

  const handleUpdateListing = async () => {
    // Extract the user's ObjectId from the user information
    const userId = user._id // Assuming the user object has an "_id" property containing the ObjectId

    // Prepare the data to be sent to the backend
    const formData = new FormData()
    formData.append('Make', makeId)
    formData.append('Model', modelId)
    formData.append('Year', yearId)
    formData.append('Category', carCategory)
    formData.append('Mileage', mileageBody)
    formData.append('Condition', 'used')
    formData.append('Description', descriptionBody)
    formData.append('user', userId) // Pass the user's ObjectId value here
    selectedImages.forEach((image, index) => {
      formData.append('images', image)
    })

    console.log('New Listing FormData:', formData)

    // Send the data to the backend route
    axios
      .put(
        `https://luke-used-cars-backend-19ea42e37e12.herokuapp.com/api/saleposts/${carToUpdate._id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )
      .then((response) => {
        console.log('Listing updated successfully:', response.data)
        // Handle any success actions here
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Listing updated successfully'
        })
      })
      .catch((error) => {
        console.error('Error creating listing:', error)
        // Handle any error actions here
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error creating listing'
        })
      })
  }



  return (
    <>
      {carToUpdate ? (
        <div className="w-full mx-auto overflow-x-hidden">
          <div className="flex flex-col items-center justify-center">
            <div className="flex flex-wrap justify-center items-center w-full yellow mb-8 py-8">
              <h1 className="text-center text-3xl blue font-bold my-8">Edit Your Listing</h1>
            </div>
            <div className="mt-2 w-full ml-3 text-left mx-auto">
              <label className="text-gray-600">make: </label>
              <select className="blue rounded-full ml-2 mb-8 text-base"
                value={makeId}
                onChange={(e) => {
                  setMakeId(e.target.value)
                }}
              >
                {makeList.map((make, index) => (
                  <option key={index} value={make}>
                    {make}
                  </option>
                ))}
              </select>
              <br></br>
              <label className="text-gray-600">model: </label>
              <select className="blue rounded-full mb-8"
                value={modelId}
                onChange={(e) => {
                  setModelId(e.target.value)
                }}
              >
                {modelList.map((model, index) => (
                  <option key={index} value={model}>
                    {model}
                  </option>
                ))}
              </select>
              <br></br>
              <label className="text-gray-600">year: </label>
              <select className="ml-3 blue rounded-full mb-8"
                value={yearId}
                onChange={(e) => {
                  setYearId(e.target.value)
                }}
              >
                {yearList.map((year, index) => (
                  <option key={index} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <div className="lg:w-2/5 md:w-2/5 w-4/5 mx-auto">
                <input className="block w-full blue rounded-full border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 my-8 mileage-input"
                  type="text"
                  placeholder="mileage:"
                  value={mileageBody}
                  onChange={(e) => {
                    setMileageBody(e.target.value)
                  }}
                />

                <input className="block w-full rounded-full border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-8 mileage-input my-6 car-description"
                  type="text"
                  value={descriptionBody}
                  placeholder="description:"
                  onChange={(e) => {
                    setDescriptionBody(e.target.value)
                    console.log(descriptionBody)
                  }}
                ></input>
                <input className="my-6" type="file" multiple onChange={handleImageUpload} />
                {selectedImages.map((image, index) => (
                  <div key={index}>
                    <img src={URL.createObjectURL(image)} alt={`Image ${index}`} />
                  </div>
                ))}
                <button className="rounded-full pink-bg lg:w-1/6 md:w-1/6 py-1 w-2/5  text-white font-bold  hover:text-black mt-8 mr-8 create-btn" onClick={handleUpdateListing}>
                  Update Listing
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>Loading...</>
      )}
    </>
  )
}

export default UpdateListing