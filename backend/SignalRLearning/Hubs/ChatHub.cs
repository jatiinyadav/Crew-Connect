using Microsoft.AspNetCore.SignalR;
using SignalRLearning.ChatInterfaces;
using MongoDLL;

namespace SignalRLearning.Hubs
{
  public class ChatHub : Hub
  {
    /// <summary>
    /// Class to execute all the methods
    /// </summary>
    private readonly ChatClass _chatClass;

    public ChatHub(ChatClass chatClass)
    {
      _chatClass = chatClass;
    }

     /// <summary>
     /// Will be executed when user will Join the Group.
     /// </summary>
     /// <param name="userDetails"></param>
     /// <param name="userMessage"></param>
     /// <returns></returns>
    public async Task JoinGroup(UserDetails userDetails, UserMessage userMessage)
    {
      await _chatClass.UserJoinedGroup(Groups, Clients, Context.ConnectionId, userDetails, userMessage);
    }

    /// <summary>
    /// Will be excuted when user will send a message.
    /// </summary>
    /// <param name="userMessage"></param>
    /// <returns></returns>
    public async Task SendMessage(UserMessage userMessage)
    {
      await _chatClass.AddMessageToDB(Clients, Context.ConnectionId, userMessage);
    }

    /// <summary>
    /// Will be executed when user will leave the chat.
    /// </summary>
    /// <param name="exception"></param>
    /// <returns></returns>
    public override Task OnDisconnectedAsync(Exception? exception)
    {
      _chatClass.UserExitFromChat(Clients, Context.ConnectionId, exception);
      return base.OnDisconnectedAsync(exception);
    }

    /// <summary>
    /// Get all the message of that particular group.
    /// </summary>
    /// <param name="userMessage"></param>
    /// <returns></returns>
    public async Task<List<Group>> SendAllMessages(UserMessage userMessage)
    {
      return await _chatClass.GetAllGroupMessages(userMessage);
    }

    /// <summary>
    /// Will be executed at the time of login.
    /// To check whether the group exits or not.
    /// </summary>
    /// <param name="adminName"></param>
    /// <param name="userMessage"></param>
    /// <param name="createGroup"></param>
    /// <returns></returns>
    public async Task<Boolean> GetCollectionsNames(string adminName, UserMessage userMessage, bool createGroup)
    {
      return await _chatClass.CollectionsFromDB(Clients, Context.ConnectionId, adminName, userMessage, createGroup);
    }

    /// <summary>
    /// To get the logged in user username.
    /// </summary>
    /// <param name="username"></param>
    public void UpdateUser(string username)
    {
      _chatClass.GetLoggedInUser(Clients, Context.ConnectionId, username);
    }
  }
}
