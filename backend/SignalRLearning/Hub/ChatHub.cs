using Microsoft.AspNetCore.SignalR;
using SignalRLearning.ChatInterfaces;
using SignalRLearning.Services;

namespace SignalRLearning.Hubs
{
    public class ChatHub : Hub
    {
        private readonly ChatService _chatService;
        private readonly GroupsService _groupService;
        private Group groupMessage;
        public ChatHub(ChatService chatService, GroupsService groupService)
        {
            _chatService = chatService;
            _groupService = groupService;
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
                groupMessage = new Group(imageURL, user.User!, message, DateTime.Now);

                // Sending the message to all the Clients Connected with that group
                UpdateUser(user.User!);
                await Clients.Group(user.Room!).SendAsync("AllMessages", user.User, message, imageURL, DateTime.Now);
                await _groupService!.AddMessageToDb(groupMessage, groupName);
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
            var messages = await _groupService.GetAllMessages(groupName);
            return messages;
        }

        // Get All Collection Name from Database
        public async Task<Boolean> GetCollectionsNames(string adminName,string groupName, string imageURL, bool createGroup)
        {
            List<string> collections = await _groupService.GetAllCollectionData();
            if (collections.Contains(groupName))
            {
                return true;
            }
            if (createGroup)
            {
                groupMessage = new Group(imageURL, "", $"{adminName} created {groupName}", DateTime.Now);
                await _groupService.CreateNewCollection(groupMessage, groupName);
                await Clients.Client(Context.ConnectionId).SendAsync("NewGroupCreated", groupMessage);
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
