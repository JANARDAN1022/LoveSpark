import { Slide } from 'react-slideshow-image';
//import './Slider.css';
import 'react-slideshow-image/dist/styles.css';
import { Icon } from 'react-icons-kit';
import {arrow_left} from 'react-icons-kit/ikons/arrow_left'
import {arrow_right} from 'react-icons-kit/ikons/arrow_right'
//import IMG from '../../Assets/freeP.jpeg';
import IMG2 from '../../Assets/pexelsPhoto.jpeg';
import { useAppSelector } from '../../Hooks';
//import { MainPageContext } from '../../Context/MainPageContext';





const Slider = () => {
  const {user} = useAppSelector((state)=>state.user);
  const coverUrl = user?.CoverUrl; 

  const slideImages = [
    {
      url:coverUrl
    },
    {
      url:IMG2
    }
  ]
  const buttonStyle = {
    width: "90px",
    height:'150px',
    backgroundcolor:'hsla(0,0%,100%,.99)',
    border: '0px',
    color:'white'
};

const properties = {
    prevArrow: <button style={{ ...buttonStyle }}><Icon icon={arrow_left} size={40} /></button>,
    nextArrow: <button style={{ ...buttonStyle }}><Icon icon={arrow_right} size={40} /></button>
}

    return (
      <div className="slide-container">
        <Slide  autoplay={false} {...properties}>
         {slideImages.map((slideImage, index)=> (
            <div key={index} className='slideshowdivIMG'>
              <div className='slideshowdiv'>
              <img src={slideImage.url} alt='Sider'/>
              </div>
            </div>
          ))} 
        </Slide>
      </div>
    )
}


export default Slider;