import { getMe } from '@/services/getme';

const UserDashboardPage = async () => {
    const data = await getMe();
    console.log(data)
    return (
        <div>
            <h1>User dashboard</h1>
            <p>{data?.message}</p> 
            user dashboard page
        </div>
    );
};

export default UserDashboardPage;