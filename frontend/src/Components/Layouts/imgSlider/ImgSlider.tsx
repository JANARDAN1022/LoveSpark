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
      <div className="slide-container">  
        <div className='slideshowdivIMG'>
              <div className='slideshowdiv'>
              <img src={slideImages[0].url} alt='Slider'/>
              </div>
            </div>
      </div>
    )
}


export default Slider;