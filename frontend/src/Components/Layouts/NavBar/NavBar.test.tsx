import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../../../store';
import NavBar from './NavBar';
import { act } from 'react-dom/test-utils';
import { useAppSelector, useAppDispatch } from '../../../Hooks';
import { LogoutUser } from '../../../Actions/userAction';

jest.mock('../../../Hooks', () => {
  const originalModule = jest.requireActual('../../../Hooks');
  return {
    ...originalModule,
    useAppDispatch: jest.fn(),
    useAppSelector: jest.fn(),
  };
});

afterEach(() => {
  cleanup();
});

describe('NavBar Component', () => {
  test('calls LoginFunction  when login button is clicked', async () => {
    
    const mockDispatch = jest.fn();

    (useAppDispatch as jest.Mock).mockReturnValue(mockDispatch);
    (useAppSelector as jest.Mock).mockReturnValue({ isAuthenticated: false, loading: false });

    render(
      <Provider store={store}>
        <Router>
          <NavBar />
        </Router>
      </Provider>
    );

    const loginButton = screen.getByTestId('Nav LoginBTn');
    expect(loginButton).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(loginButton);
    });

 
    expect(useAppSelector).toHaveBeenCalledTimes(1); 
    expect(mockDispatch).not.toHaveBeenCalledWith(LogoutUser());
  });
});
