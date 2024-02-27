using Microsoft.AspNetCore.SignalR;
using SignalRLearning.ChatInterfaces;
using MongoDLL;
using System;

namespace SignalRLearning.Hubs
{
  public class ChatHub : Hub
  {
    private readonly ChatClass _chatClass;

    public ChatHub(ChatClass chatClass)
    {
      _chatClass = chatClass;
    }

    public async Task JoinGroup(UserDetails userDetails, UserMessage userMessage)
    {
      await _chatClass.UserJoinedGroup(Groups, Clients, Context.ConnectionId, userDetails, userMessage);
    }

    // Method Invoked when user sends a message
    public async Task SendMessage(UserMessage userMessage)
    {
      await _chatClass.AddMessageToDB(Clients, Context.ConnectionId, userMessage);
    }

    // Method Invoked when user got Disconnected
    public override Task OnDisconnectedAsync(Exception? exception)
    {
      _chatClass.UserExitFromChat(Clients, Context.ConnectionId, exception);
      return base.OnDisconnectedAsync(exception);
    }

    // Send All the Messages
    public async Task<List<Group>> SendAllMessages(UserMessage userMessage)
    {
      return await _chatClass.GetAllGroupMessages(userMessage);
    }

    // Get All Collection Name from Database
    public async Task<Boolean> GetCollectionsNames(string adminName, UserMessage userMessage, bool createGroup)
    {
      return await _chatClass.CollectionsFromDB(Clients, Context.ConnectionId, adminName, userMessage, createGroup);
    }

    // When Message is sent update logged in user
    public void UpdateUser(string username)
    {
      _chatClass.GetLoggedInUser(Clients, Context.ConnectionId, username);
    }
  }
}
