import { PayloadAction } from '@reduxjs/toolkit';
import { AnyAction } from 'redux';

const isPending = (action: AnyAction): action is PayloadAction<any> => action.type.endsWith('/pending');
const isFulfilled = (action: AnyAction): action is PayloadAction<any> => action.type.endsWith('/fulfilled');
const isRejected = (action: AnyAction): action is PayloadAction<any> => action.type.endsWith('/rejected');

export { isPending, isFulfilled, isRejected };
