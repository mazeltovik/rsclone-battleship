const serverUrl = 'http://localhost:3000';

export const getUsers = async () => {
    const users = await fetch(`${serverUrl}/usersGet`);
    const data = await users.json();
    return data;
};
export const getUser = async (userName: string, userPass: string) => {
    const user = await fetch(`${serverUrl}/userGet/${userName}&${userPass}`);
    const data = await user.json();
    return data;
};
export const registrationUser = async (userName: string, userPass: string) => {
    const user = await fetch(`${serverUrl}/userReg/${userName}&${userPass}`);
    return user;
};
export const pushUser = async (user: any) => {
    await fetch(`${serverUrl}/pushUser/${user.id}`, {
        method: 'POST',
        body: JSON.stringify(user),
        headers: { 'Content-Type': 'application/json' },
    });
};
export const setUsers = async (obj: Array<{}>) => {
    try {
        await fetch(`${serverUrl}/usersPost`, {
            method: 'POST',
            body: JSON.stringify(obj),
            headers: { 'Content-Type': 'application/json' },
        });
    } catch {}
};

export const getLeaders = async () => {
    const leaders = await fetch(`${serverUrl}/getLeaders`);
    const data = await leaders.json();
    return data;
};
