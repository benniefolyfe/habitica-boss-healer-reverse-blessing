import React, { createContext, useState, PropsWithChildren } from 'react';
import { HabiticaUserAPI } from '../../api/interfaces';
import { getGameData } from '../../services/content';
import { getUserData, updateUserData, useUserBlessing } from '../../services/user';
import { UserData, UserContextType, GameData } from './interfaces';

const userModelObject = (): UserData => ({
    profile: { name: "" },
    items: { gear: { equipped: {} } },
    stats: {
        lvl: 1,
        buffs: { con: 0, int: 0 },
        class: "",
        con: 0,
        int: 0,
        mp: 0
    },
    id: "",
});

const gameDataObject = (): GameData => ({
    data: { gear: { } }
});

export const HabiticaUserProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
    const [habiticaUserAPI, setHabiticaUserAPI] = useState<HabiticaUserAPI>({
        userId: '',
        apiToken: ''
    });
    const [userData, setUserData] = useState<UserData>();

    const authenticateUserData = async (apiUserDetails: HabiticaUserAPI): Promise<string> => {
        try {
            const userData = await getUserData(apiUserDetails)
            setHabiticaUserAPI(apiUserDetails)
            setUserData(userData.data)
            return "Success"
        } catch {
            return "User ID or API Token is invalid!"
        }     
    };

    const updateUser = async (payload: any) => {
        await updateUserData(habiticaUserAPI, payload)
    };

    const CastBlessingSkill = async (payload: any) => {
        await useUserBlessing(habiticaUserAPI, payload)
    };

    const fetchGameContent = async (): Promise<GameData> => {
        return await getGameData(habiticaUserAPI)
    };

    return (
        <HabiticaUserContext.Provider
            value={{
                userData: userData || userModelObject(),
                updateUser,
                authenticateUserData,
                CastBlessingSkill,
                fetchGameContent,
            }}
        >
            {children}
        </HabiticaUserContext.Provider>
    );
};

export const HabiticaUserContext = createContext<UserContextType>({
    userData: userModelObject(),
    updateUser: async () => { },
    authenticateUserData: async () => { return await "" },
    CastBlessingSkill: async () => { },
    fetchGameContent: async () => {
        return await gameDataObject()
    },
})