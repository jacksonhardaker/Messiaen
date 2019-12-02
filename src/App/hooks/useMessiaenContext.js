import { useContext } from 'react';
import { MessiaenContext } from '../context/MessiaenContext';

const useMessiaenContext = () => useContext(MessiaenContext);

export default useMessiaenContext;
