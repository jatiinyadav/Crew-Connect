using SignalRLearning.ChatInterfaces;

namespace SignalRLearning.Services
{
    public class ChatService
    {
        private static readonly IDictionary<string, UserDetails> Users = new Dictionary<string, UserDetails>();

        // Used to add Users to the Dictionary
        public bool AddUsersToDictionary(string connectionID, UserDetails userToAdd)
        {
            lock (Users)
            {
                Users[connectionID] = userToAdd;
                return true;
            }
        }

        // Used to assign Connection ID to the user
        public void AddUserConnectinID(string user, string connectionID)
        {
            //lock (Users)
            //{
            //    if(Users.ContainsKey(user))
            //    {
            //        Users[user] = connectionID;
            //    }
            //}
        }

        // Get User by Connection ID
        public UserDetails GetUserByConnectionID(string connectionID)
        {
            lock (Users)
            {
                // We can use ForEach loop Also
                return Users.Where(x => x.Key == connectionID).Select(x => x.Value).FirstOrDefault()!;
            }
        }

        // Get Connection ID by User 
        //public string GetConnectionIDByUser(string user)
        //{
        //    lock (Users)
        //    {
        //        return Users.Where(x => x.Key == user).Select(x => x.Value).FirstOrDefault()!;
        //    }
        //}

        // Remove User from the List
        public void RemoveUser(string user)
        {
            lock (Users)
            {
                if (Users.ContainsKey(user)) Users.Remove(user);
            }   
        }

        // Get List of all Online Users
        public string[] GetAllOnlineUsers(string room)
        {
            return Users.Where(x => x.Value.Room == room).Select(x => x.Value.User).ToArray()!;
        }
    }
}
