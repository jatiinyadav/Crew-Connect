using Microsoft.AspNetCore.SignalR;
using SignalRLearning.ChatInterfaces;

namespace SignalRLearning.Models.Interfaces
{
  public interface ICollectionsFromDB
  {
    public Task<bool> CollectionsFromDB(IHubCallerClients clients, string connectionId, string adminName, UserMessage userMessage, bool createGroup);
  }
}
