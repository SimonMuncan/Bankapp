import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './ProfilePage.module.css';
import { updateService } from '../../services/updateService.js';
import Input from '../../components/Input.tsx';
import { updateUserProfileSuccess } from '../../store/actions/authActions.js';
import { RootState, UserDataToUpdate } from '../../types/index.ts';


const ProfilePage = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch(); 

    const [updateName, setUpdateName] = useState<string>('');
    const [updateEmail, setUpdateEmail] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        if (user) {
            setUpdateName(user.name || '');
            setUpdateEmail(user.email || '');
        }
    }, [user]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setSuccessMessage('');
        setIsLoading(true);

        if (newPassword && newPassword.length > 0 && newPassword !== confirmNewPassword) {
            setError('New passwords do not match.');
            setIsLoading(false);
            return;
        }

        if (newPassword && newPassword.length > 0 && newPassword.length < 8) {
            setError('New password must be at least 8 characters long!');
            setIsLoading(false);
            return;
        }

        const userDataToUpdate: UserDataToUpdate = {"name": "","email": "", "password": ""};


        if (updateName !== user.name) {
            userDataToUpdate.name = updateName;
        }
        if (updateEmail !== user.email) {
            userDataToUpdate.email = updateEmail;
        }
        else {
            userDataToUpdate.email = user.email
        }
        if (newPassword) { 
            userDataToUpdate.password = newPassword;
        }

        if (Object.keys(userDataToUpdate).length === 0) {
            setSuccessMessage('No changes were made to your profile.'); 
            setIsLoading(false);
            return;
        }

        try {
            const response = await updateService(userDataToUpdate);
            setSuccessMessage(response.detail || "Profile updated successfully!");

            const updatedFieldsForRedux = {"name": "","email": ""};
            if (userDataToUpdate.name !== undefined) { 
                updatedFieldsForRedux.name = userDataToUpdate.name;
            }
            if (userDataToUpdate.email !== undefined) { 
                updatedFieldsForRedux.email = userDataToUpdate.email;
            }

            if (Object.keys(updatedFieldsForRedux).length > 0) {
                dispatch(updateUserProfileSuccess(updatedFieldsForRedux));
            }

            setNewPassword('');
            setConfirmNewPassword('');

        } catch (err) {
            const errorMessage = err.response?.detail || err.message || 'Profile update failed. Please try again.';
            setError(errorMessage);
            console.error('Profile update error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) {
        return <div className={styles.loading}>Loading user data or not logged in...</div>;
    }

    return (
        <div className={styles.profilePageContainer}>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>Your Profile</h1>
            </div>

            <div className={styles.profileContentGrid}>
                <div className={styles.infoCard}>
                    <h2 className={styles.cardTitle}>Current Information</h2>
                    <div className={styles.infoGroup}>
                        <strong className={styles.infoLabel}>Username:</strong>
                        <span className={styles.infoValue}>{user.name}</span>
                    </div>
                    <div className={styles.infoGroup}>
                        <strong className={styles.infoLabel}>Email:</strong>
                        <span className={styles.infoValue}>{user.email}</span>
                    </div>
                </div>

                <div className={styles.updateCard}>
                    <h2 className={styles.cardTitle}>Update Profile</h2>
                    <form onSubmit={handleSubmit} className={styles.authForm}>
                        {error && <p className={styles.errorMessage}>{error}</p>}
                        {successMessage && <p className={styles.successMessage}>{successMessage}</p>}
                        
                        <Input
                            id="updateUsername" 
                            type="text" 
                            value={updateName} 
                            set={setUpdateName}
                            title="Username" 
                            placeHolder="Enter new username" 
                        />
                        <Input
                            id="updateEmail" 
                            type="email" 
                            value={updateEmail} 
                            set={setUpdateEmail}
                            title="Email Address" 
                            placeHolder="Enter new email" 
                        />
                        <Input
                            id="newPassword" 
                            type="password" 
                            value={newPassword} 
                            set={setNewPassword}
                            title="New Password (leave blank to keep current)" 
                            placeHolder="Enter new password" 
                        />
                        <Input
                            id="confirmNewPassword" 
                            type="password" 
                            value={confirmNewPassword} 
                            set={setConfirmNewPassword}
                            title="Confirm New Password" 
                            placeHolder="Repeat new password" 
                        />
                        <button type="submit" className={styles.authButton} disabled={isLoading}>
                            {isLoading ? 'Updating...' : 'Update Profile'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;