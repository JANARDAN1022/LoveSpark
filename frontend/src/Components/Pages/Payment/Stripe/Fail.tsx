import {Link } from 'react-router-dom'

const Fail = () => {
  return (
    <div className="bg-white h-[100vh]">
    <div className="bg-white p-6  md:mx-auto">
      <svg
        viewBox="0 0 24 24"
        className="text-red-600 w-16 h-16 mx-auto my-6"
      >
        <path
          fill="currentColor"
          d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z"
        ></path>
      </svg>
      <div className="text-center">
        <h3 className="md:text-2xl text-base text-red-500 font-semibold text-center">
          Payment Failed!
        </h3>
        <p className="text-gray-600 my-2">
         Contact Ur bank if Payment is Deducted,Purchase Failed
        </p>
        <p> Have a great day Please Try Again later!</p>
        <div className="py-10 text-center">
          <Link to={'/MainPage'}>Go Back To MainPage</Link>
        </div>
      </div>
    </div>
  </div>
  )
}

export default Fail