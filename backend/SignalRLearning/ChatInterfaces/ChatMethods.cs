using Microsoft.AspNetCore.SignalR;

namespace SignalRLearning.ChatInterfaces
{
  public abstract class ChatMethods : IUserJoinedGroup, IAddMessageToDB, IUserExitFromChat, ICollectionsFromDB
  {
    public abstract Task AddMessageToDB(IHubCallerClients clients, string connectionId, UserMessage userMessage);

    public abstract Task<bool> CollectionsFromDB(IHubCallerClients clients, string connectionId, string adminName, UserMessage userMessage, bool createGroup);

    public abstract void UserExitFromChat(IHubCallerClients clients, string connectionId, Exception? exception);

    public abstract Task UserJoinedGroup(IGroupManager groups, IHubCallerClients clients, string connectionId, UserDetails userDetails, UserMessage userMessage);
  }
}
