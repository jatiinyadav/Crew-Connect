using Microsoft.AspNetCore.SignalR;

namespace SignalRLearning.ChatInterfaces
{
  public interface ICollectionsFromDB
  {
    public Task<Boolean> CollectionsFromDB(IHubCallerClients clients, string connectionId, string adminName, UserMessage userMessage, bool createGroup);
  }
}
