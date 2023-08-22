//import React from 'react';
import { render,screen } from '@testing-library/react';
import AccountSettings from './AccountSettings';

describe('AccountSettings Component',()=>{
test('renders learn react link', () => {
   render(<AccountSettings />);  
   const linkElement = screen.getByText(/LoveSpark/i);
   expect(linkElement).toBeInTheDocument();
});

});
