//import React from 'react';
import { render, screen, fireEvent,waitFor} from '@testing-library/react';
import axios from 'axios'; // Import axios for mocking
import { Provider } from 'react-redux';
import { store } from '../../../store';
import AccountSettings from './AccountSettings';
import { BrowserRouter as Router } from 'react-router-dom';
//import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';

// Mock axios for testing HandlePayment
jest.mock('axios');

describe('AccountSettings Component', () => {
  test('renders Account Settings Component', () => {
    render(
      <Provider store={store}>
        <Router>
          <AccountSettings />
        </Router>
      </Provider>
    );
    const linkElement = screen.getByText(/LoveSpark/i);
    expect(linkElement).toBeInTheDocument();
  });
  test('handles payment when user is not premium', async () => {
    const mockUser = { role: 'user' };

    (axios.post as jest.Mock).mockResolvedValue({ data: { url: 'mocked-url' } });

    act(() => {
      render(
        <Provider store={store}>
          <Router>
            <AccountSettings />
          </Router>
        </Provider>
      );
    });

    act(() => {
      fireEvent.click(screen.getByText('LoveSpark'));
    });

    expect(screen.getByTestId('loading-stripe')).toBeInTheDocument();

    await act(async()=>{
     waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        'https://love-spark.vercel.app/create-checkout-session',
        expect.anything()
      );
    });
  })
    expect(window.location.href).toBe( "http://localhost/" );
  });

  test('Handle Delete Account',async()=>{
   (axios.delete as jest.Mock).mockResolvedValue(null);
   
  
    render(
      <Provider store={store}>
        <Router>
          <AccountSettings />
        </Router>
      </Provider>
    );
  
  
   act(() => {
    fireEvent.click(screen.getByText('Delete Your Account'));
  });
  
  expect(screen.getByTestId('loading-DeleteAccount')).toBeInTheDocument();
  
 await act(async()=>{ 
    waitFor(() => {
    expect(axios.delete).toHaveBeenCalledWith(
      "https://love-spark.vercel.app/api/Users/undefined",
       expect.anything()
     );
  })
});
  expect(window.location.href).toBe( "http://localhost/" );
  });
 
});


