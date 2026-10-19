import { getMe } from '@/services/getme';

const UserDashboardPage = async () => {
    const data = await getMe();
    console.log(data)
    return (
        <div>
            user dashboard page
        </div>
    );
};

export default UserDashboardPage;