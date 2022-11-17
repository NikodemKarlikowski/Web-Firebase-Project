﻿import {auth, firestore} from "../lib/firebase";
import {useEffect, useState} from "react";
import {useAuthState} from "react-firebase-hooks/auth";

// Custom hook to read auth record and user profile doc
export function useUserData() {
    const [user] = useAuthState(auth);
    const [username, setUsername] = useState(null);

    useEffect(() => {
        let unsubsribe;

        if (user) {
            const ref = firestore.collection('users').doc(user.uid);
            unsubsribe = ref.onSnapshot((doc) => {
                setUsername(doc.data()?.username);
            });
        } else {
            setUsername(null);
        }

        return unsubsribe;
    }, [user]);

    return {user, username};
}