import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContextComponent';
import { CarContext } from '../components/CarContextProvider';
import Swal from 'sweetalert2';
import { addComma, serverUrl } from '../controller/controller';
import { ReactComponent as Sticker } from '../assets/revSticker.svg'
import { ReactComponent as DblArrow } from '../assets/revsidearrow.svg'

const UserCarListings = () => {
  const { user } = useContext(AuthContext);
  const { cars, setCars } = useContext(CarContext);

  const userCars = cars.filter((car) => car.user === user._id);
  const [userCarListings, setUserCarListing] = useState([]);

  useEffect(() => { 
    setUserCarListing(cars.filter((car) => car.user === user._id));
  }, [cars, user._id]);

  useEffect(() => {
    axios.get(`${serverUrl}api/saleposts/`)
      .then((response) => {
        const userCars = response.data.filter((car) => car.user === user._id);
        setUserCarListing(userCars);
      });
  }, [user._id]);

  const handleDelete = (id) => {
    axios.delete(`${serverUrl}api/saleposts/${id}`)
      .then(() => {
        const updatedCars = cars.filter((car) => car._id !== id);
        setCars(updatedCars);
        Swal.fire({
          icon: 'success',
          title: "You have successfully deleted this posting!"
        });
      })
      .catch(error => console.error('Error deleting car:', error));
  };

  // New states for price editing modal
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [editingCarId, setEditingCarId] = useState(null);
  const [newPrice, setNewPrice] = useState('');

  const handlePriceChange = () => {

    const priceValue = parseFloat(newPrice.replace(/[^0-9.]/g, '').trim());
    if(!isNaN(priceValue)) {
    axios.put(`${serverUrl}api/saleposts/${editingCarId}`, { Price: priceValue })
      .then(() => {
        const updatedCars = cars.map(car => {
          console.log('Before Update', cars);
          if (car._id === editingCarId) {
            return { ...car, Price: newPrice };
          }
          return car;
        });
        console.log('After update', updatedCars)
        setCars(updatedCars);
        setShowPriceModal(false);
        Swal.fire({
          icon: 'success',
          title: "Price updated successfully!"
        });
      })
      .catch(error => console.error('Error updating car price:', error));
      Swal.fire({
        icon: 'error',
        title: "Please enter a valid number for the price."
      });
  } else {
    console.error('invalid price input');
  }
};

  const priceConversion = (price) => {
    // If price is 7 digits or more
    if (price >= 1000000) {
      return (price / 1000000).toFixed(1) + 'M' // divide by 1,000,000 and add 'M' to indicate millions
    }

    // If price is less than 7 digits
    return (price / 1000).toFixed(1) + 'k' // divide by 1,000 and add 'k' to indicate thousands
  }

  return (
     <div className='min-h-screen px-5 sm:px-24 md:px-52 xl:px-72 bg-off-white pt-20 pb-10 overflow-x-hidden first-letter:bg-off-white'>
      <div className='w-full flex justify-center'>
        <div className="flex flex-wrap justify-between items-center w-full mb-8 pt-8 lg:w-[50%]">
      <h1 className='flex text-center text-3xl font-bold my-8'>Your Listings</h1>
      </div>
      </div>
    <div className="grid lg:grid-cols-2 gap-x-12 items-stretch">
      {userCars.length > 0 ? (
        userCars.map((car, index) => (
          <div className='flex flex-col mb-12 relative xl:w-[1/2] ' key={car._id}> 
            <Link to={`/usercarlistingsdetails?id=${car._id}`}>
            <div className="sticker text-center flex flex-col items-center justify-center absolute transform rotate-12 -top-8 -right-4">
                    <h2 className="absolute font-west-avenue text-3xl">
                      {'$' + priceConversion(car.Price)}
                    </h2>
                    <Sticker className="h-24 font-west-avenue text-3xl" />
                  </div>
              <div className="w-full border-black border border-b-0">
                <div className="img-container aspect-w-16 aspect-h-9 border-b border-black">
                  <img src={userCarListings[index]?.image} alt='Car' className="aspect-content object-cover" />
                </div>
                <div className="flex justify-between items-center p-6">
                      <div className="">
                        <h2 className="w-auto font-west-avenue text-3xl">
                          {car.Year} {car.Make} {car.Model}
                        </h2>
                        <p>{addComma(car.Mileage)} miles</p>
                      </div>
                      <DblArrow className="ml-6 h-6" />
                    </div>
              </div>
            </Link>
            <div className="text-center w-full">
              <button 
                onClick={() => { 
                  setEditingCarId(car._id); 
                  setShowPriceModal(true); 
                }} 
                className="w-[50%] border bg-off-yellow border-black p-2 font-bold"
              >
                edit price
              </button>
              <button onClick={() => handleDelete(car._id)} className="w-[50%] border border-l-0 bg-off-red border-black p-2 font-bold">delete</button>
            </div>
          </div>
        ))
      ) : (
        <div>
          <p className="font-bold">You have not posted any cars.</p>
        </div>
      )}

      {showPriceModal && (
        <div className="fixed top-0 left-0 w-full h-full flex flex-col justify-center items-center bg-opacity-50 bg-black z-1200">
          <div className="flex flex-col items-center w-[80%] lg:w-1/2 min-h-[30%] lg:h-1/2 bg-off-white p-4">
            <h2 className="text-3xl font-bold mt-20 mb-12">Edit Price</h2>
           
            <input className='w-64 md:w-80 p-2 border border-black border-b-0 bg-off-white'
              type="text" 
              value={newPrice} 
              onChange={e => setNewPrice(e.target.value.replace(/[^0-9.]/g, ''))}
              placeholder="$0"
            />
       
            <div className='mb-12'>
            <button className='w-32 md:w-40 border bg-off-yellow border-black p-2 font-bold' onClick={handlePriceChange}>Confirm</button>
            <button className='w-32 md:w-40 border border-l-0 bg-off-red border-black p-2 font-bold' onClick={() => setShowPriceModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

    </div>
      <Link className="mt-8 flex justify-center items-center w-full" to="/post">
        <button className="mt-8 mb-12 w-48 lg:w-60 border bg-off-red border-black p-2 font-bold">create listing</button>
      </Link>
    </div>
  );
};

export default UserCarListings;
