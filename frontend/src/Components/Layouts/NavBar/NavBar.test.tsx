import {render,screen,cleanup} from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../../../store';
import NavBar from './NavBar';
//import Home from '../../Pages/Home';

afterEach(() => {
    cleanup(); // Resets the DOM after each test suite
})


describe('NavBar Component',()=>{
test('Renders NavBar Component',async()=>{
   render(
        <Provider store={store}>
            <Router>
            <NavBar />     
            </Router>
        </Provider>
     )

 const Button = screen.getByTestId('Nav LoginBTn');
 expect(Button).toBeInTheDocument();
});

});