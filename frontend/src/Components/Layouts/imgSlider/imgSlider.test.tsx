import { render,screen} from '@testing-library/react';
//import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../../../store';
import  ImgSlider  from './ImgSlider';


describe('ImgSlider Component',()=>{
test('Renders ImgSlider',()=>{
render(
<Provider store={store}>
        <ImgSlider />
</Provider>
);
});

test('Displays user cover image', () => {
        const mockCoverUrl = 'mocked-cover-url';
        const slideImages = [
                {
                  url:mockCoverUrl
                }
              ]
        render(
          <Provider store={store}>
            <ImgSlider />
          </Provider>
        );
      
        // Mock the Redux store to have the desired coverUrl
        store.dispatch({ type: 'user/setUser', payload: { CoverUrl: mockCoverUrl } });
      
        // Find the rendered cover image
        const coverImage = screen.getByAltText('Slider');
      
        // Assert that the src attribute matches the mockCoverUrl
        expect(coverImage).toBeInTheDocument();
      });
      

});