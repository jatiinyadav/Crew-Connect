using Microsoft.AspNetCore.SignalR;
using SignalRLearning.ChatInterfaces;
using SignalRLearning.Services;
using MongoDLL;

namespace SignalRLearning.Hubs
{
    public class ChatHub : Hub
    {
        private readonly ChatService _chatService;
        private Group _group = new("", "", "", DateTime.Now);

        public ChatHub(ChatService chatService)
        {
            _chatService = chatService;
        }
        public async Task JoinGroup(UserDetails userDetails, string imageURL)
        {
            // Adding Group Name
            await Groups.AddToGroupAsync(Context.ConnectionId, userDetails.Room!);

            // Adding User in Dictionary
            _chatService.AddUsersToDictionary(Context.ConnectionId, userDetails);

            // Adding Client to group an returning a function and message.
            await Clients.Group(userDetails.Room!).SendAsync("JoinedGroup", $"{userDetails.Room}", $"{userDetails.User}", imageURL);
            await SendConnectedUsers(userDetails.Room!);
        }

        // Method Invoked when user sends a message
        public async Task SendMessage(string message, string groupName, string imageURL)
        {
            // Getting the user from the dictionary
            var user = _chatService.GetUserByConnectionID(Context.ConnectionId);
            if (user != null)
            {
                _group = new Group(imageURL, user.User!, message, DateTime.Now);

                // Sending the message to all the Clients Connected with that group
                UpdateUser(user.User!);
                await Clients.Group(user.Room!).SendAsync("AllMessages", user.User, message, imageURL, DateTime.Now);
                await MongoData.AddMessageToDb(_group, user.Room!);
            }
        }

        // Method Invoked when user got Disconnected
        public override Task OnDisconnectedAsync(Exception? exception)
        {
            // Getting the user from the dictionary
            var user = _chatService.GetUserByConnectionID(Context.ConnectionId);
            if (user== null)
            {
                // Disconnecting
                return base.OnDisconnectedAsync(exception);
            } else
            {
            // Sending Message
            Clients.Group(user!.Room!).SendAsync("LeaveGroup", "Chat Bot", $"{user.User}", DateTime.Now);

            // Delete Users from Dictionary
            _chatService.RemoveUser(Context.ConnectionId);

            // Sending the updated users
            SendConnectedUsers(user.Room!);
            }
            return base.OnDisconnectedAsync(exception);

        }
         
        // Send All the Connected Users.
        public Task SendConnectedUsers(string room)
        {
            var allConnectedUsers = _chatService.GetAllOnlineUsers(room);

            return Clients.Group(room).SendAsync("ConnectedUsers", allConnectedUsers);
        }
        
        // Send All the Messages
        public async Task<List<Group>> SendAllMessages(string groupName)
        {
            var messages = await MongoData.GetAllMessages(groupName);
            return messages;
        }

        // Get All Collection Name from Database
        public async Task<Boolean> GetCollectionsNames(string adminName,string groupName, string imageURL, bool createGroup)
        {
            List<string> collections = await MongoData.GetAllCollectionData();
            if (collections.Contains(groupName))
            {
                return true;
            }
            if (createGroup)
            {
                _group = new Group(imageURL, "", $"{adminName} created {groupName}", DateTime.Now);
                await MongoData.CreateNewCollection(_group, groupName);
                await Clients.Client(Context.ConnectionId).SendAsync("NewGroupCreated", _group);
            }

            return false;
        }

        // When Message is sent update logged in user
        public async void UpdateUser(string username)
        {
            await Clients.Client(Context.ConnectionId).SendAsync("Username", username);
        }
    }
}
