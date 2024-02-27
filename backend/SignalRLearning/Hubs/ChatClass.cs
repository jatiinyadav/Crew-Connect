using SignalRLearning.ChatInterfaces;
using Microsoft.AspNetCore.SignalR;
using SignalRLearning.Services;
using MongoDLL;
using SignalRLearning.Models.Abstract;

namespace SignalRLearning.Hubs
{
  public class ChatClass : ChatMethods
  {
    private readonly ChatService _chatService;

    private Group _group = new("", "", "", DateTime.Now);

    public ChatClass(ChatService chatService)
    {
      _chatService = chatService;
    }
    public override async Task UserJoinedGroup(IGroupManager groups, IHubCallerClients clients, string connectionId, UserDetails userDetails, UserMessage userMessage)
    {
      // Adding Group Name
      await groups.AddToGroupAsync(connectionId, userDetails.Room!);

      // Adding User in Dictionary
      _chatService.AddUsersToDictionary(connectionId, userDetails);

      // Adding Client to group an returning a function and message.
      await clients.Group(userDetails.Room!).SendAsync("JoinedGroup", $"{userDetails.Room}", $"{userDetails.User}", userMessage.imageURL);
      await SendConnectedUsers(clients, userDetails.Room!);
    }

    public override async Task AddMessageToDB(IHubCallerClients clients, string connectionId, UserMessage userMessage)
    {
      // Getting the user from the dictionary
      var user = _chatService.GetUserByConnectionID(connectionId);
      if (user != null)
      {
        _group = new Group(userMessage.imageURL!, user.User!, userMessage.message!, DateTime.Now);

        // Sending the message to all the Clients Connected with that group
        GetLoggedInUser(clients,connectionId, user.User!);
        await clients.Group(user.Room!).SendAsync("AllMessages", user.User, userMessage.message!, userMessage.imageURL!, DateTime.Now);
        await MongoData.AddMessageToDb(_group, user.Room!);
      }
    }

    public override void UserExitFromChat(IHubCallerClients clients, string connectionId, Exception? exception)
    {
      // Getting the user from the dictionary
      var user = _chatService.GetUserByConnectionID(connectionId);
      if (user == null)
      {
        // Disconnecting
        return;
      }
      else
      {
        // Sending Message
        clients.Group(user!.Room!).SendAsync("LeaveGroup", "Chat Bot", $"{user.User}", DateTime.Now);

        // Delete Users from Dictionary
        _chatService.RemoveUser(connectionId);

        // Sending the updated users
        SendConnectedUsers(clients, user.Room!);
      }
      return;

    }

    public async Task<List<Group>> GetAllGroupMessages(UserMessage userMessage)
    {
      var messages = await MongoData.GetAllMessages(userMessage.groupName!);
      return messages;
    }

    public override async Task<Boolean> CollectionsFromDB(IHubCallerClients clients, string connectionId, string adminName, UserMessage userMessage, bool createGroup)
    {
      List<string> collections = await MongoData.GetAllCollectionData();
      if (collections.Contains(userMessage.groupName!))
      {
        return true;
      }
      if (createGroup)
      {
        _group = new Group(userMessage.imageURL!, "", $"{adminName} created {userMessage.groupName!}", DateTime.Now);
        await MongoData.CreateNewCollection(_group, userMessage.groupName!);
        await clients.Client(connectionId).SendAsync("NewGroupCreated", _group);
      }

      return false;
    }

    // Send All the Connected Users.
    public Task SendConnectedUsers(IHubCallerClients clients, string room)
    {
      var allConnectedUsers = _chatService.GetAllOnlineUsers(room);

      return clients.Group(room).SendAsync("ConnectedUsers", allConnectedUsers);
    }

    // When Message is sent update logged in user
    public async void GetLoggedInUser(IHubCallerClients clients, string connectionId, string username)
    {
      await clients.Client(connectionId).SendAsync("Username", username);
    }
  }
}
