import  { useCallback, useEffect } from 'react'
import { useAppDispatch,useAppSelector } from '../../../../Hooks';
import { UpdateUser } from '../../../../Actions/userAction';
import { Link } from 'react-router-dom';
const Success = () => {
    const {user} = useAppSelector((state)=>state.user);
    const dispatch = useAppDispatch();
    const Updaterole = useCallback(async()=>{
        if(user?._id){
          console.log(user?._id);
      dispatch(UpdateUser({id:user._id,data:{role:'Premium'}}));
        }
    },[user,dispatch]);
    

    useEffect(()=>{
        if(user?.role!=='Premium'){
        Updaterole();
        }
    },[Updaterole,user]);

  return (
    <div className="bg-gray-100 h-full">
    <div className="bg-white p-6 flex justify-center items-center flex-col  h-screen  md:mx-auto">
      <svg
        viewBox="0 0 24 24"
        className="text-green-600 w-16 h-16 mx-auto my-6"
      >
        <path
          fill="currentColor"
          d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z"
        ></path>
      </svg>
      <div className="text-center">
        <h3 className="md:text-2xl text-base text-green-600 font-semibold text-center">
          Payment Successfull!
        </h3>
        <p className="text-yellow-600 my-2">
          Thank you for Buying LoveSpark Premium Enjoy Your New Features.
        </p>
        <p className='text-pink-500'> Have a great day!</p>
        <div className="py-10 text-center ">
          <Link to={'/'} className='bg-green-500  hover:bg-green-600 hover:text-white   p-2 text-[rgba(255,255,255,0.8)] rounded-[5px] font-bold'>Continue</Link>
        </div>
      </div>
    </div>
  </div>
  )
}

export default Success