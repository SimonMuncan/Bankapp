import React from 'react';
import { Dispatch as ReduxDispatch, AnyAction } from 'redux';


export interface User {
    id: number;
    name: string;
    email: string;
}

export interface Wallet {
    id: number;
    balance: number;
}

export interface InputProps {
    id: string;
    type: 'number' | 'text' | 'password' | 'email'; 
    value: string;
    set: (value: string) => void;
    title: string;
    placeHolder: string;
}

export interface AuthState {
    user: User;
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean;
    token: string;
}

export interface RootState {
    auth: AuthState;
}

export interface ApiError {
    detail: string;
}

export interface InputLoginProps {
    id: string;
    type: 'text' | 'password' | 'email'; 
    value: string;
    set: React.Dispatch<React.SetStateAction<string>>; 
    title: string;
    placeHolder: string;
    isLoading: boolean;
    dispatch: ReduxDispatch<AnyAction>; 
    reduxError: string | null;          
    clearAuthError: () => AnyAction;
}


export interface InputPropsRegister {
    id: string;
    type: 'number' | 'text' | 'password' | 'email'; 
    value: string;
    set: React.Dispatch<React.SetStateAction<string>>;
    title: string;
    placeHolder: string;
    isLoading: boolean;
}

export interface RegisterResponse{
    detail: string;
}

export interface UserDataToUpdate{
    name: string;
    email: string;
    password: string;
}

export interface Transaction {
    id: number; 
    timestamp: string; 
    sender_id: number;
    receiver_id: number;
    amount: number; 
    status: boolean;
    description: string | null;
    sender?: string;   
    receiver?: string;
}

export interface TypeFilters {
    incoming: boolean;
    outgoing: boolean;
}

export interface SearchProps {
    searchTerm: string | null;
    setSearchTerm: React.Dispatch<React.SetStateAction<string | null>>;
    searchTitle: string;
    searchLabel: string;
    searchPlaceholder: string;
}

export interface ExportPDFProps {
    isLoading: boolean;
    debouncedSearchTerm: string | null;
    activeUserId: number;
    setError: React.Dispatch<React.SetStateAction<string | null>>;
    title: string;
    transactionType: string; 
}

export interface CheckboxProps {
    id: string;
    name: keyof TypeFilters; 
    checked: boolean;
    setTypeFilters: React.Dispatch<React.SetStateAction<TypeFilters>>;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

export interface PaginationControlsProps {
    currentPage: number;
    handlePreviousPage: () => void;
    handleNextPage: () => void;
    isLoading: boolean;
    isLastPage: boolean;
}

export interface TransferResponse {
    detail: string;
}