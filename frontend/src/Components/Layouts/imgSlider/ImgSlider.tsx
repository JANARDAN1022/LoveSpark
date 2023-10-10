import { useAppSelector } from '../../../Hooks';




const Slider = () => {
  const {user} = useAppSelector((state)=>state.user);
  const coverUrl = user?.CoverUrl; 

  const slideImages = [
    {
      url:coverUrl
    }
  ]

    return (
      <div className="slide-container w-[100%]  h-[200px] lg:h-[470px]">  
        <div className='slideshowdivIMG w-[100%] h-[100%]'>
              <div className='slideshowdiv w-[100%] h-[100%]'>
              <img src={slideImages[0].url} alt='Slider' className='w-[100%] h-[100%] object-cover'/>
              </div>
            </div>
      </div>
    )
}


export default Slider;